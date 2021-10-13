<template>
	<view>
		<base-logins ref="login"
			:url="url" 
			:href="href" 
			:params="params"
			:inviteCode="true"
			inviteCodeCacheKey="baker_inviteCode"
			loginUrl="/uni_modules/baker-app/pages/login/login"
			agreementUrl="/uni_modules/baker-app/pages/user/agreement"
			privacyUrl="/uni_modules/baker-app/pages/user/privacy"
			basicPath="/uni_modules/baker-app"
			:defaultScene="defaultScene"
			:logo="logo"
			:mode="mode"
			:loginTypes="loginTypes"
			:forceBindMobile="forceBindMobile"
			@loginSuccess="loginSuccess"
			@success="onSuccess"
			@showLoginPanel="onShowLoginPanel"
			@weixinBind="bindSuccess"
			@cancelAccount="onCancelAccount">
			
			<slot></slot>
			
		</base-logins>
	</view>
</template>

<script>
	import {userStore} from "../../js_sdk/baker-user-store.js" ;
	export default {
		name: "baker-logins",
		props: {
			url: String,
			href: String,
			params: {
				type: Object,
				default () {
					return {};
				}
			},
			mode : {
				type : String ,
				default : "check"
			}
		},
		computed: {
			config() {
				return uni.$b.getValue("login");
			},
			logo(){
				return this.config.logo ;
			},
			loginTypes(){
				return this.config.loginTypes ;
			},
			defaultScene(){
				return this.config.defaultScene ;
			},
			forceBindMobile(){
				return this.config.forceBindMobile ;
			}
		},
		methods: {

			checkToken(){
				this.$refs.login.checkToken();
			},

			async onSuccess(e) {
				this.$emit("success", e);
			}, 
			
			bindSuccess(){
				userStore.dispatch("loadData" , {forceUpdate :true });
				uni.$emit("onUserStateChanged");
			},

			loginSuccess(e){
				userStore.dispatch("loadData" , {forceUpdate :true });
				uni.$emit("onUserStateChanged");
				
				this.$emit("loginSuccess", e);
				this.saveHistory();
				this.saveChannel();
				
				let callback = uni.$b.getValue("login.success");
				uni.$b.isFn(callback) && callback(e) ;
			},
			
			onCancelAccount({data}){
				let callback = uni.$b.getValue("login.cancelAccount");
				uni.$b.isFn(callback) && callback(data) ;
			},
			
			onShowLoginPanel(e){
				this.$emit("showLoginPanel" , e);
			},

			async saveHistory() {
				let keys = ["baker_history" , "baker_cartoon_history"];
				for (let key of keys) {
					let history = uni.getStorageSync(key) || [];
					if (history.length == 0) {
						continue ;
					}
					let isSuccess = await this.bakerApi.batchSaveHistory(history , key);
					if (isSuccess) {
						uni.setStorageSync(key , []);
					}
				}
			},
			
			async saveChannel() {
				let channel = uni.getStorageSync("baker_channel") || 1 ;
				await this.bakerApi.saveChannel(channel);
			}
		}
	}
</script>
