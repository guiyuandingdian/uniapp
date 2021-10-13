export default {
	data(){
		return {
			weixinBind : true 
		}
	},
	created(){
		this.setWeixinBind();
	},
	methods: {
		setWeixinBind(){
			// #ifdef APP-PLUS || MP-WEIXIN
			let user = uni.getStorageSync("base-user");
			this.weixinBind = !user || user.weixinBind ;
			// #endif 
		},
		
		async weixinLogin(){
			this.changeScene("weixinLogin");
			try{
				let code = await uni.$b.getWeixinCode();
				await this.sendRequest({code},"base-login/wxapp/login");
			}catch(err){
				this.loginFail(err);
			}
		},
		
		async bindWeixin(){
			this.changeScene("bindWeixin");
			let code = await uni.$b.getWeixinCode();
			let res = await uni.$b.call({
				url :  "base-login/user/user/bindWeixin" , 
				data : {code}
			});
			
			//更新绑定状态
			this.bindTypesSuccess( res , "weixinBind");
		}
	}
}