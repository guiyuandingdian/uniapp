class BasePayment {
	
	constructor(args) {
		this.args = args ;
		this.success = args.success || (() => {}) ;
		this.fail = args.fail || (() => {}) ;
		this.complete = (e) => {
			args.complete && args.complete(e);
			uni.hideLoading();
		};
		this.order = {} ;
	}
	//请求支付
	async requestPay(){
		uni.showLoading({
			title:"支付中..."
		})
		let data = this.args.data ;
		uniCloud.callFunction({
			name: this.args.name ,
			data ,
			success: ({result}) => {
				if (result.orderInfo && result.order) {
					console.log("获取支付参数成功 result: ",result);
					this.onGetOrderInfo(result);
					return ;
				}
				console.log("获取支付参数失败 result: ",result);
				this.fail(result);
				this.complete(result);
			},
			fail: (e) => {
				this.fail(e);
				this.complete(e);
			}
		});
	}
	
	onGetOrderInfo({order , orderInfo}){
		this.order = order ;
		// #ifdef MP-ALIPAY
		uni.hideLoading();
		// #endif
		
		let payConfig = {
			// #ifdef APP-PLUS
			provider: this.args.data.payType || this.args.data.data.payType ,
			// #endif
			
			// #ifdef MP-WEIXIN
			...orderInfo,
			// #endif
			
			// #ifdef APP-PLUS || MP-ALIPAY
			orderInfo ,
			// #endif
			
			_debug :  process.env.NODE_ENV === 'development' ,
			
			success : (e) => {
				let res = this.parseResult(e) ;
				// #ifdef MP-ALIPAY
				if (e.resultCode != "9000") {
					this.fail(res);
					return ;
				}
				// #endif
				this.success(res);
			},
			fail : (e) => {
				let res = this.parseResult(e) ;
				this.fail(res);
			},
			complete:e => {
				let res = this.parseResult(e) ;
				this.complete(res);
			}
		};
		
		uni.requestPayment(payConfig);
	}
	
	parseResult(e){
		console.log(e);
		let res = { order : this.order , ...e } ;
		let code = "ok" ;
		let message = "" ;
		// #ifdef MP-WEIXIN
		if (e.errMsg != "requestPayment:ok") {
			code = e.errMsg == "requestPayment:fail cancel" ? "cancel" : "fail" ;
		}
		message = code == "cancel" ? "已取消" : e.errMsg ;
		// #endif
		
		// #ifdef MP-ALIPAY
		if (e.resultCode != "9000") {
			code = e.resultCode == "6001" ? "cancel" : "fail" ;
		}
		message = code == "cancel" ? "已取消" : e.memo ;
		// #endif
		
		// #ifdef APP-PLUS
		if (e.errMsg != "requestPayment:ok") {
			code = e.errMsg.indexOf("cancel") > -1 || e.errMsg.indexOf("62001") > -1 ? "cancel" : "fail" ;
			message = code == "cancel" ? "已取消" : e.errMsg ;
			if (e.errMsg == "requestPayment:fail service not found") {
				code = "provider error" ;
				message = "当前provider：" + (this.args.data.payType || this.args.data.data.payType) ;
			}
			if (e.errMsg && e.errMsg.indexOf("General errors") > -1) {
				console.log("e.errMsg: ",e.errMsg);
				code = "package error" ;
				message = `支付失败，请检查包名、签名是否正确，是否为正式包：${e.errMsg}` ;
			}
		}
		// #endif
		
		res.code = code ;
		res.message = message ;
		return res ;
	}
}

//获取登录code
function getCode(){
	// #ifdef MP-WEIXIN || MP-ALIPAY
	return new Promise((resolve,reject)=>{
		let provider = "alipay" ;
		// #ifdef MP-WEIXIN
		provider = "weixin" ;
		// #endif
		uni.login({
			provider ,
			success: ({code}) => {
				resolve(code);
			},
			fail: (err) => {
				reject(err);
				uni.showToast({
					title:'登录失败',
					icon : "none"
				});
			}
		})
	});
	// #endif
	// #ifndef MP-WEIXIN || MP-ALIPAY
	return Promise.resolve("");
	// #endif
}

class ApplePayment {
	constructor(productIds , onReady) {
		this.productIds = productIds;
		this.orderList = [];
		this.ready = false;
		this.onReady = onReady || (() => { });
		this.init();
	}

	onFail(error) {
		this.fail(error);
		this.complete(error);
	}

	getChannel() {
		return new Promise((resolve, reject) => {
			plus.payment.getChannels(
				(channels) => {
					let iapChannel = channels.find((item) => item.id === "appleiap");
					if (!iapChannel) {
						this.onFail(new Error("支付通道未配置，请在manifest.json中勾选苹果支付模块"));
						return;
					}
					this.iapChannel = iapChannel ;
					this.restoreComplateRequest();
					resolve(iapChannel);
				},
				(error) => {
					this.onFail(error);
				}
			);
		});
	}

	init() {
		return new Promise(async (resolve, reject) => {
			this.getChannel()
				.then((iapChannel) => {
					//必须调用此方法才能进行 iap 支付
					iapChannel.requestOrder(
						this.productIds,
						(orderList) => {
							this.orderList = orderList;
							this.onReady(orderList);
							this.ready = true;
							resolve(orderList);
						},
						(err) => {
							reject(err);
						}
					);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	
	restoreComplateRequest() {
	    this.iapChannel.restoreComplateRequest({}, (results) => {  
	        console.log("results: ",results);
			
	    });
	}

	requestPayment({ productid, quantity = 1, success, fail, complete }) {
		uni.requestPayment({
			provider: "appleiap",
			orderInfo: { productid , quantity , optimize: true },
			success,
			fail : (err)=>{
				this.restoreComplateRequest();
				fail && fail(err);
			},
			complete
		});
	}
}

let payIns;
function initApplePay(productIds, onReady) {
	payIns = new ApplePayment(productIds, onReady);
}

function applePay({ productid, success, fail, complete } = {}) {
	if (!payIns) {
		fail && fail("请先调用initApplePay()函数初始化苹果支付环境");
		return;
	}
	if (!payIns.ready) {
		fail && fail("苹果支付环境尚未准备好");
	}
	payIns({ productid, success, fail, complete });
}



function requestPayment(args , needCode) {
	let payment = new BasePayment(args);
	payment.requestPay();
}

async function requestBasePay (action , args) {
	if (!args.data) {
		args.data = {} ;
	}
	let data = {...args.data} ;
	// #ifdef MP-WEIXIN || MP-ALIPAY
	data.code = await getCode();
	// #endif
	requestPayment({
		name :  "base-payment" ,
		data : {
			action ,
			data
		},
		success : args.success ,
		fail : args.fail ,
		complete : args.complete
	});
}

function pay (args) {
	requestBasePay("user/baseOrder/create" , args );
}

function continuePay (args) {
	requestBasePay("user/baseOrder/continuePay" , args );
}



export default {
	requestPayment,
	getCode,
	pay,
	initApplePay,
	applePay,
	continuePay
};
