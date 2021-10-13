<template>
	<view @tap="checkToken">
		
		<slot></slot>
		
		
		<!-- #ifdef APP-PLUS -->
		<view class="none">
			<base-login-types ref="loginTypes"
				:loginTypes="loginTypes"
				:basicPath="basicPath"
				:needPermission="needPermission"
				:inviteCodeKey="inviteCodeKey"
				value=""
				@success="loginSuccess"
				@cancel="onCancel"
				@input="onChangeOthers"
				@onUniVerifyChange="univerifyUsable = $event;"></base-login-types>
		</view>
		<!-- #endif -->
		
	</view>
</template>

<script>
	export default {
		name:"base-login-check",
		props:{
			loginTypes:Array,
			basicPath:String,
			needPermission:Boolean,
			inviteCodeKey:String
		},
		data() {
			return {
				
			}
		},
		methods: {
			async checkToken(){
				//显示登录面板
				if (!uni.$b.isLogin()) {
					this.toLogin();
					return ;
				}
			
				//需要绑定手机号码
				let user = uni.getStorageSync("base-user") ;
				if (!user.mobileBind) {
					this.setLocalScene("bindMobile");
					this.toLogin();
					return ;
				}
				
				//token有效，登录成功
				await this.complete();
			},
		}
	}
</script>
