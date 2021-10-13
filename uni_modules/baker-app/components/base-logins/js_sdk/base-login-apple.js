export default {
	data(){
		return {
			appleBind : true 
		}
	},
	created(){
		this.setAppleBind();
	},
	methods: {
		setAppleBind(){
			// #ifdef APP-PLUS 
			let user = uni.getStorageSync("base-user");
			this.appleBind = !user || user.appleBind ;
			// #endif
		},
		
		async getAppleUserInfo(){
			let provider = "apple" ;
			const [loginErr, loginData] = await uni.login({ provider });
			if (loginErr) {
				uni.$b.showToast('苹果登录失败，请稍后再试');
				return;
			}
			
			// 获取用户信息
			const [getUserInfoErr, result] = await uni.getUserInfo({ provider });
			if (getUserInfoErr) {
				let content = getUserInfoErr.errMsg;
				uni.$b.showModal({
					title: '获取用户信息失败',
					content: '错误原因' + content,
					showCancel: false
				});
				return;
			}
			
			return result.userInfo ;
		},
		
		async appleLogin() {
			this.changeScene("appleLogin");
			try{
				let userInfo = await this.getAppleUserInfo() ;
				if (!userInfo) {
					return ;
				}
				
				//服务端登录
				await this.sendRequest(userInfo,"base-login/apple/login");
				
			}catch(e){
				this.loginFail(e);
			}
		},
		
		async bindApple() {
			this.changeScene("bindApple");
			
			let userInfo = await this.getAppleUserInfo() ;
			if (!userInfo) {
				return ;
			}
			let res = await uni.$b.call({
				url :  "base-login/user/user/bindApple" , 
				data : userInfo
			});
			
			//更新绑定状态
			this.bindTypesSuccess( res , "appleBind");
		}
	}
}