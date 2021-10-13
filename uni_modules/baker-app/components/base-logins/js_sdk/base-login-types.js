export default {
	data(){
		return {
			bindData:{} ,
			providers : [] 
		}
	},
	computed: {
		showTitle(){
			let others = this.showSms || this.showBaidu || this.showWeibo || this.showQQ || this.showPsw ;
			// #ifdef H5
			return others ;
			// #endif
			return others || this.showApple || this.showWxapp || this.showUniverify ;
		},
		title(){
			if (this.isBind) {
				return "其他绑定方式" ;
			}
			return this.notLoginMode ? "登录" : "其他登录方式" ;
		},
		notLoginMode(){
			return this.scene == "register" || this.scene == "resetPassword" || this.scene == "bindMobile" ;
		},
		isBind(){
			return this.scene == "bindMobile" ; 
		},
		isIos(){
			// #ifndef APP-PLUS
			return false ;
			// #endif
			// #ifdef APP-PLUS
			return uni.getSystemInfoSync().platform == "ios" ;
			// #endif
		},
		hasPswType(){
			return this.loginTypes.includes("passwordLogin") ;
		},
		showSms(){
			return !this.isBind &&  this.loginTypes.includes("smsLogin") && this.scene != "smsLogin" ;
		},
		showPsw(){
			return !this.isBind && !this.isUniverifyBind &&  this.hasPswType && this.scene != "passwordLogin" ;
		},
		showUniverify(){
			return this.univerifyUsable && this.loginTypes.includes("univerifyLogin") && this.providers.includes("univerify") && this.scene != "univerifyLogin" ;
		},
		showApple(){
			return !this.isBind && !this.isUniverifyBind && this.loginTypes.includes("appleLogin") && this.providers.includes("apple") && this.isIos && this.scene != "appleLogin"  ;
		},
		showWxapp(){
			return !this.isBind && !this.isUniverifyBind && this.loginTypes.includes("weixinLogin") && this.providers.includes("weixin") && this.scene != "weixinLogin" ;
		},
		showQQ(){
			return !this.isBind && !this.isUniverifyBind && this.loginTypes.includes("qqLogin") && this.providers.includes("qq") && this.scene != "qqLogin" ;
		},
		showWeibo(){
			return !this.isBind && !this.isUniverifyBind && this.loginTypes.includes("weiboLogin") && this.providers.includes("sinaweibo") && this.scene != "weiboLogin" ;
		},
		showBaidu(){
			return !this.isBind && !this.isUniverifyBind && this.loginTypes.includes("baiduLogin") && this.scene != "baiduLogin" ;
		},
		otherProviders(){
			let providers = [] ;
			if(this.showSms) providers.push("smsLogin");
			if(this.showPsw) providers.push("passwordLogin");
			if(this.showApple) providers.push("appleLogin");
			if(this.showWxapp) providers.push("weixinLogin");
			if(this.showQQ) providers.push("qqLogin");
			if(this.showWeibo) providers.push("weiboLogin");
			if(this.showBaidu) providers.push("baiduLogin");
			return providers ;
		}
	},
	
	async created() {
		this.providers = await this.getProviders();
		uni.$on("base-logins-bind",({weixinBind = true,appleBind = true,mobileBind = true} = {}) => {
			this.weixinBind = weixinBind ;
			this.appleBind = appleBind ;
			this.mobileBind = mobileBind ;
		})
	},
	methods: {
		getProviders() {
			return new Promise((resolve, reject) => {
				uni.getProvider({
					service: 'oauth',
					success: (result) => {
						resolve(result.provider);
					},
					fail: (error) => {
						console.error('获取登录通道失败', error);
						resolve([]);
					}
				});
			})
		},
		
		loginFail(err){
			this.changeScene(this.prevScene);
			console.log("err: ",err);	
			if (err.cancel) {
				uni.$b.showToast("取消登录");
				return ;
			}
			uni.$b.showModal({
				content: uni.$b.isObject(err) ? JSON.stringify(err) : err ,
				showCancel:false
			}); 
		},
		
		async sendRequest(data , url ){
			data.needPermission = this.needPermission ;
			data.inviteCode = uni.getStorageSync(this.inviteCodeCacheKey) || "" ;
			let res = await uni.$b.call({
				url , 
				data
			});
			await this.loginSuccess(res);
			return res ;
		},
		
		bindTypesSuccess(res , bindType){
			res.bindType = bindType ;
			if (res.code == "bindOthers") {
				this.bindData = res ;
				this.$refs.bindModal.show();
				return ;
			}
			
			this.showBindResult(bindType);
		},
		
		showBindResult(bindType){
			//更新绑定状态
			uni.showToast({title:"绑定成功"});
			let user = uni.getStorageSync("base-user");
			user[bindType] = true ;
			uni.setStorageSync("base-user" , user);
			this[bindType] = true ;
			
			this.$emit(bindType , true);
		}
	}
}