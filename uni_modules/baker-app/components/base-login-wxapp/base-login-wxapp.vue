<template>
	<view class="pd" @tap="login">
		<image src="../base-login-types/static/weixinLogin.png" mode="widthFix" class="w40 h40"></image>
	</view>
</template>

<script>
	import typesMixin from "../base-login-types/base-login-types-mixin.js" ;
	export default {
		name:"base-login-wxapp",
		mixins:[typesMixin],
		data(){
			return {
				loginUrl : "base-login/wxapp/login"
			}
		},
		methods: {
			
			async login(){
				try{
					let code = await uni.$b.getWeixinCode();
					await this.sendRequest({code});
				}catch(err){
					this.loginFail(err);
				}
			}
		}
	}
</script>
