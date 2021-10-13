export default {
	// #ifdef APP-PLUS
	data() {
		return {
			univerifyUsable : false ,
			preloginTimer: null
		};
	},
	computed: {
		
		isUniverifyBind(){
			return this.scene == "univerifyBind" ;
		},
		
		buttons(){
			return this.otherProviders.map(provider => {
				return {
					provider ,
					iconPath : `${this.basicPath}/components/base-logins/static/${provider}.png`
				}
			}); 
		},
		
		_univerifyStyle() {
			return uni.$b.deepMerge(
				{
					"otherLoginButton": {
						"visible": false 
					},
					authButton: {
						normalColor: uni.$b.getValue("components.mainColor"),
						highlightColor: uni.$b.getValue("components.mainColor"),
						textColor:uni.$b.getValue("components.mainInverse")
					},
					buttons: {
						"iconWidth": "45px",
						"list" : this.buttons
					}
				},
				this.univerifyStyle,
				{
					fullScreen: true
				}
			);
		},
		
		bindStyle(){
			let btn = this.buttons.find(item => item.provider == "smsLogin");
			let list = [] ;
			if (btn) {
				list.push({ ...btn , provider : "bindMobile" });
			}
			return uni.$b.deepMerge( this._univerifyStyle , {
				authButton: { "title": "一键绑定本机号码" },
				buttons: { "list" : list }
			})
		}
	}, 
	
	async created() {
		uni.onNetworkStatusChange(async (e)=>{
			this.univerifyUsable = await this.preLogin();
		});
		this.univerifyUsable = await this.preLogin(); 
	},
	
	methods: {
		preLogin() {
			clearTimeout(this.preloginTimer);
			return new Promise((resolve, reject) => {
				uni.preLogin({
					provider: "univerify",
					success: (res) => {
						//超时后自动重新获取
						this.preloginTimer = setTimeout(() => {
							this.preLogin();
						}, 9 * 60 * 1000);
						
						resolve(true);
					},
					
					fail: (res) => {
						// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
						console.log(res.errCode , res.errMsg);
						resolve(false);
					}
				});
			});
		},
	
		univerify(univerifyStyle) {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: "univerify",
					univerifyStyle ,
					success: (res) => {
						// {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
						resolve(res.authResult);
					},
					fail: (err) => {
						console.log("err :>> ", err);
						this.sceneChanging = true ;
						this.univerifyFail(err);
					},
					complete: (res) => {
						uni.closeAuthView();
						//重新预登陆
						this.preLogin();
					}
				});
			});
		},
		
		univerifyFail(res){
			let {errCode , errMsg , index , provider} = res ;
			
			//关闭授权界面,登录流程结束 
			if ( errCode == 30003 ) {
				let scene = this.scene == "univerifyBind" ? "bindMobile" : this.defaultScene ;
				this.changeScene(scene);
				return ;
			}
			
			//点击其他登录方式
			if (errCode == 30002 || errCode == 30006) {
				this.changeScene(this.defaultScene);
				return ;
			} 
	
			//点击了自定义登录按钮
			if (errCode == 30008) {
				this.onOtherTypes(provider);
				return ;
			}
			
			//弹出错误提示
			uni.$b.showToast(errMsg);
			this.sceneChanging = false ;
		},
		
		onOtherTypes(loginType){
			this.changeScene(loginType);
			if ( ["smsLogin","passwordLogin","bindMobile"].includes(loginType)) {
				this.onChangeOthers(loginType);
				return ;
			}
			this[loginType]();
		},
	
		async univerifyLogin(scene) {
			if (!scene) {
				scene = this.scene == "bindMobile" ? "univerifyBind" : "univerifyLogin" ;
			}
			this.changeScene(scene);
			if (scene == "univerifyBind") {
				return await this.univerifyBind();
			}
			
			//请求手机号授权数据，服务端登录
			let url = "base-login/univerify/login" ;
			let data = await this.univerify(this._univerifyStyle);
			let res = await this.sendRequest(data , url );
		},
	
		async univerifyBind(scene) {
			if (!scene) {
				this.changeScene("univerifyBind");
			}
			let {token} = uni.getStorageSync("base-logins-result") || {};
			if (!token) {
				uni.$b.showToast("请登录");
				return ;
			}
			//请求手机号授权数据，服务端登录
			let url = "base-login/user/user/bindUniverifyMobile" ;
			let data = await this.univerify(this.bindStyle);
			let res = await uni.$b.call({url , data , token});
			await this.bindMobileSuccess(res , "mobileBind");
		}
	}
	// #endif
};