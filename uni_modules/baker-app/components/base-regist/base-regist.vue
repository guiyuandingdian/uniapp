<template>
	<view>
		<b-form :action="action" :check-auth="false" title-width="0" scale="1.14" @success="onSuccess">
			
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
						:countdown-key="countdownKey" :countdown="true">获取验证码</b-btn>
					<view v-if="!mobileCorrect" class="abs" @tap="showError"></view>
				</view>
			</b-input>
			
			<b-input v-if="showPsw" name="password" :type="passwordType" :sign="true" :placeholder="placeholder" title="密码" class="mt20" input-class="grayBg rds8"></b-input>
			
			<b-input v-if="inviteCode" key="inviteCode" name="inviteCode" title="邀请码" :value="iCode" :required="inviteCodeRequired" :placeholder="inviteCodeHolder" class="mt20" input-class="grayBg rds8"></b-input>
			
			<b-agreement v-if="showAgreement" name="aggreement" class="mt0 fz12" :title="['用户协议','隐私政策']" :content-path="[agreementUrl,privacyUrl]" :countdown="-1"></b-agreement>
			
			<b-btn class="mt20" form-type="submit" type="block" radius="23" ptb="12">
				{{btnText}}
			</b-btn>
			
		</b-form>
	</view>
</template>

<script>
	import baseLoginSms from "../base-logins/js_sdk/base-login-sms-mixins.js";
	export default {
		name:"base-regist",
		mixins:[baseLoginSms],
		props:{
			loginTypes:{
				type : Array ,
				default(){
					return [] ;
				}
			},
			passwordType:{
				type : String ,
				default : "weekPassword"
			},
			inviteCode:Boolean,
			inviteCodeRequired:Boolean,
			agreementUrl:String,
			privacyUrl:String,
			inviteCodeCacheKey:String
		},
		computed: {
			showPsw(){
				return this.loginTypes.includes("passwordLogin");
			},
			countdownKey(){
				return `sendSms_${this.scene}` ;
			},
			placeholder(){
				return {
					"weekPassword" : "6~22位，字母/数字/字符至少包含两种" ,
					"mediumPassword" : "8~32位，字母/数字/字符至少包含三种" ,
					"strongPassword" : "8~32位，大小写字母/数字/字符至少包含四种" 
				}[this.passwordType] ;
			},
			inviteCodeHolder(){
				return this.inviteCodeRequired ? "请输入邀请码" : "请输入邀请码，选填" ;
			},
			showAgreement(){
				return this.scene == "register" ;
			}
		},
		data(){
			return {
				appName : process.env.VUE_APP_NAME,
				iCode : uni.getStorageSync(this.inviteCodeCacheKey)
			}
		},
		methods:{
			onSuccess(e){
				this.$emit('success' , e);
			}
		}
	}
</script>
