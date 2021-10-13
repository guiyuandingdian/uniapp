<template>
	<view>
		<b-form @submit="onSubmit" :action="actionSync" :check-auth="false" title-width="0" scale="1.14" @success="onSuccess">
			
			<b-input name="needPermission" value-type="boolean" :value="needPermission" :hidden="true" :required="false"></b-input>
			
			<b-input name="mobile" type="mobile" v-model="mobile" title="手机号码" input-class="grayBg rds8" placeholder="仅支持中国大陆手机号">
				<view slot="prefix" class="h100p flex">
					+86
				</view>
			</b-input>
			
			<b-input name="code" maxlength="6" minlength="6" :show-count="false" type="int" title="验证码" class="mt20" input-class="grayBg rds8">
				<view slot="suffix" class="h100p flex pr10 father">
					<b-btn type="text" text-color="#1481b8" msg-type="toast"
						:url="sendSmsUrl" :params="{mobile , scene }" :check-auth="false" 
						countdown-key="sendLoginSms" :countdown="true">获取验证码</b-btn>
					<view v-if="!mobileCorrect" class="abs" @tap="showError"></view>
				</view>
			</b-input>
			
			<b-btn class="mt20" form-type="submit" type="block" radius="23" ptb="12">{{btnText}}</b-btn>
			
		</b-form>
	</view>
</template>

<script>
	import baseLoginSms from "../base-logins/js_sdk/base-login-sms-mixins.js";
	export default {
		name:"base-login-sms",
		mixins:[baseLoginSms],
		computed: {
			actionSync() {
				return this.scene == "bind" ? "" : this.action ; 
			}
		},
		methods:{
			onSuccess(e){
				this.$emit('success' , e);
			},
			async onSubmit(data){
				if (this.scene != "bind") {
					return ;
				}
				let {token} = uni.getStorageSync("base-logins-result") || {};
				if (!token) {
					uni.$b.showToast("请登录");
					return ;
				}
				let res = await uni.$b.call({url : this.action, data , token});
				this.onSuccess(res);
			}
		}
	}
</script>
