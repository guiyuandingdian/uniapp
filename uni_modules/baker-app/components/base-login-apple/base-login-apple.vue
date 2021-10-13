<template>
	<view class="pd" @tap="login">
		<image src="../base-login-types/static/appleLogin.png" mode="widthFix" class="w40 h40"></image>
	</view>
</template>

<script>
	import typesMixin from "../base-login-types/base-login-types-mixin.js" ;
	export default {
		name:"base-login-apple",
		mixins:[typesMixin],
		props:{
			loginUrl:String,
			needPermission:Boolean
		},
		data() {
			return {
				loginUrl : "base-login/apple/login",
				provider : "apple"
			}
		},
		methods: {
			async getUserInfo(){
				let provider = this.provider ;
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
			
			async login() {
				try{
					let userInfo = await this.getUserInfo() ;
					if (!userInfo) {
						return ;
					}
					
					//服务端登录
					await this.sendRequest(userInfo);
					
				}catch(e){
					this.loginFail(e);
				}
			}
		}
	}
</script>
