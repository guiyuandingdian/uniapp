<template>
	<view>
		<b-form :action="action" :check-auth="false" title-width="0" scale="1.14" @success="onSuccess">
			
			<b-input name="needPermission" value-type="boolean" :value="needPermission" :hidden="true" :required="false"></b-input>
			
			<b-input name="username" type="mobile" v-model="mobile" title="手机号码" input-class="grayBg rds8"></b-input>
			
			<b-input name="password" :sign="true" :type="passwordType" title="密码" class="mt20" input-class="grayBg rds8"></b-input>
			
			<b-btn class="mt20" form-type="submit" type="block" radius="23" ptb="12" msg-type="icon">登录</b-btn>
		</b-form>
	</view>
</template>

<script>
	export default {
		name:"base-login-password",
		props:{
			passwordType:{
				type : String ,
				default : "weekPassword"
			},
			action:String,
			needPermission:Boolean,
			value:String
		},
		data() {
			return {
				mobile: "" 
			}
		},
		watch: {
			value:{
				handler(newValue, oldValue) {
					if (newValue) {
						this.mobile = newValue ;
					}
				},
				immediate : true 
			},
			mobile(newValue, oldValue) {
				if (newValue) {
					this.$emit("input", newValue);
				}
			}
		},
		methods:{
			onSuccess(e){
				this.$emit('success' , e);
			}
		}
	}
</script>
