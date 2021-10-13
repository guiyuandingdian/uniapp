<template>
	<view :class="{'none' : inited < 2}">
		
		<view class="flex ct mt50" v-if="showTitle">
			<view class="bt w30"></view>
			<view class="gray mlr10 fz12">{{title}}</view>
			<view class="bt w30"></view>
		</view>
		
		<view class="flex ct mt">
			<view class="pd" v-if="showPsw" @tap="change('passwordLogin')">
				<image src="./static/passwordLogin.png" mode="widthFix" class="w40 h40"></image>
			</view>
			<view class="pd" v-if="showSms" @tap="change('smsLogin')">
				<image src="./static/smsLogin.png" mode="widthFix" class="w40 h40"></image>
			</view>
			
			<!-- #ifdef APP-PLUS -->
			
			<base-login-apple ref="appleLogin" v-if="showApple" @success="loginSuccess" :inviteCodeKey="inviteCodeKey" :needPermission="needPermission"></base-login-apple>
			
			<base-login-wxapp ref="weixinLogin" v-if="showWxapp" @success="loginSuccess" :inviteCodeKey="inviteCodeKey" :needPermission="needPermission"></base-login-wxapp>
			
			
			<view class="pd" @tap="univerifyLogin()">
				<image src="../base-login-types/static/univerifyLogin.png" mode="widthFix" class="w40 h40"></image>
			</view>
			
			<base-login-univerify ref="univerifyLogin" v-if="showUniverify" :value="univerifyUsable" @input="onInput" :providers="otherProviders" 
				:inviteCodeKey="inviteCodeKey" :needPermission="needPermission" :basicPath="basicPath" :scene="value"
				@success="loginSuccess" @cancel="onCancel" @changeType="onChangeType" @changeOthers="changeOthers"></base-login-univerify>

			<!-- #endif -->
			
			<view class="pd" v-if="showQQ">
				<image src="./static/qqLogin.png" mode="widthFix" class="w40 h40"></image>
			</view>
			<view class="pd" v-if="showWeibo">
				<image src="./static/weiboLogin.png" mode="widthFix" class="w40 h40"></image>
			</view>
			<view class="pd" v-if="showBaidu">
				<image src="./static/baiduLogin.png" mode="widthFix" class="w40 h40"></image>
			</view>
		</view>
		
		
		<view class="mt30 flex ct"  :class="{none : notLoginMode}">
			<block v-if="hasPswType">
				<view @tap="change('resetPassword')">找回密码</view>
				<view class="plr10 op5 gray">|</view>
			</block>
			<view @tap="change('register')">注册账号</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"base-login-types",
		props:{
			needPermission : Boolean ,
			basicPath : String ,
			inviteCodeKey : String ,
			value : String ,
			loginTypes:Array
		},
		computed: {
			showTitle(){
				let others = this.showSms || this.showBaidu || this.showWeibo || this.showQQ ;
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
				return this.value == "register" || this.value == "resetPassword" || this.value == "bindMobile" ;
			},
			isBind(){
				return this.value == "bindMobile" ;
			},
			hasPswType(){
				return this.loginTypes.includes("passwordLogin") ;
			},
			showSms(){
				return !this.isBind &&  this.loginTypes.includes("smsLogin") && this.value != "smsLogin" ;
			},
			showPsw(){
				return !this.isBind &&  this.hasPswType && this.value != "passwordLogin" ;
			},
			showUniverify(){
				return this.univerifyUsable && this.loginTypes.includes("univerifyLogin") && this.providers.includes("univerify") ;
			},
			showApple(){
				return !this.isBind && this.loginTypes.includes("appleLogin") && this.providers.includes("apple") && uni.getSystemInfoSync().platform == "ios" ;
			},
			showWxapp(){
				return !this.isBind && this.loginTypes.includes("weixinLogin") && this.providers.includes("weixin") ;
			},
			showQQ(){
				return !this.isBind && this.loginTypes.includes("qqLogin") && this.providers.includes("qq") ;
			},
			showWeibo(){
				return !this.isBind && this.loginTypes.includes("weiboLogin") && this.providers.includes("sinaweibo") ;
			},
			showBaidu(){
				return !this.isBind && this.loginTypes.includes("baiduLogin") ;
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
			},
			bindProviders(){
				return this.showSms ? ["smsLogin"] : [] ;
			}
		},
		data(){
			return {
				providers : [] ,
				univerifyUsable : true ,
				inited : 0
			}
		},
		async created() {
			this.providers = await this.getProviders();
			this.inited ++ ;
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
			change(scene){
				this.$emit("input" , scene);
			},
			onCancel(res){
				this.$emit("cancel");
			},
			changeOthers(){
				this.$emit("changeOthers");
			},
			login(loginType , params){
				if (!this.$refs[loginType]) {
					console.error(`${loginType}登录方式不存在或当前环境不支持`);
					return ;
				}
				this.$refs[loginType].login(params);
			},
			onChangeType(loginType){
				if (["passwordLogin","smsLogin","bindMobile"].includes(loginType)) {
					this.change(loginType);
					return ;
				}
				this.login(loginType);
			},
			onInput(usable){
				this.univerifyUsable = usable ;
				this.inited ++ ;
				this.$emit("onUniVerifyChange" , this.showUniverify);
			}
		}
	}
</script>
