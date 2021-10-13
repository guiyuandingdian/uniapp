<template>
	<view>
		
		<view v-if="bindAppleMode && !appleBind && isIos" @tap="bindApple()">
			
			<slot></slot>
			
		</view>
		<view v-else-if="bindWeixinMode && !weixinBind" @tap="bindWeixin()">
			
			<slot></slot>
			
		</view>
		<view v-else-if="bindMobileMode && !mobileBind" @tap="bindMobile()">
			
			<slot></slot>
			
		</view>
		<view v-else-if="checkMode" @tap="checkToken()">
			
			<slot></slot>
			
		</view>
		<view v-else-if="displayMode">
			
			<view class="pd30 pb text-center">
				<block v-if="scene == 'weixinLogin'">
					
					<base-login-auth @auth="weixinLogin()" :logo="logo" title="微信授权登录" remark="使用微信账号一键注册并登录">
						<image src="./static/weixinLogin.png" mode="widthFix" class="w60 h60 rds"></image>
					</base-login-auth>
					
				</block>
				<block v-else-if="scene == 'appleLogin'">
					
					<base-login-auth @auth="appleLogin()" :logo="logo" title="Apple授权登录" remark="使用Apple账号一键注册并登录">
						<image src="./static/appleLogin.png" mode="widthFix" class="w60 h60 rds"></image>
					</base-login-auth>
					
				</block>
				<block v-else-if="scene == 'univerifyLogin'">
					
					<base-login-auth @auth="univerifyLogin()" :logo="logo" title="本机号码授权登录" remark="授权获取本机号码注册并登录">
						<image src="./static/univerifyLogin.png" mode="widthFix" class="w60 h60 rds"></image>
					</base-login-auth>
					
				</block>
				<block v-else-if="scene == 'univerifyBind'">
					
					<base-login-auth @auth="univerifyBind()" :logo="logo" title="本机号码授权绑定" remark="授权获取本机号码，并绑定当前账号">
						<image src="./static/univerifyLogin.png" mode="widthFix" class="w60 h60 rds"></image>
					</base-login-auth>

				</block>
				<block v-else>
					<image v-if="!!logo" :src="logo" mode="aspectFill" class="w60 h60 rds center-block"></image>
				</block>
			</view>
			
			<!-- 表单区域 --> 
			<view class="pd30 transition">
				
				<!-- 密码登录 -->
				<base-login-password v-if="scene == 'passwordLogin'"
					key="passwordLogin"
					:needPermission="needPermission" 
					:action="passwordLoginUrl" 
					:passwordType="passwordType"
					v-model="mobile"
					@success="loginSuccess"
					@regist="changeScene('register')"
					@resetPassword="changeScene('resetPassword')"></base-login-password>
				
				
				<!-- 短信验证码登录 -->
				<base-login-sms v-else-if="scene == 'smsLogin'"
					key="smsLogin"
					scene="login"
					btnText="登录"
					:needPermission="needPermission"
					:action="smsLoginUrl" 
					:sendSmsUrl="sendSmsUrl"
					v-model="mobile"
					@success="loginSuccess"></base-login-sms>
				
				
				<!-- 短信注册 -->
				<base-regist v-else-if="scene == 'register'"
					key="register"
					scene="register"
					btnText="注册"
					:loginTypes="loginTypes"
					:needPermission="needPermission"
					:action="registUrl"
					:sendSmsUrl="sendRegistSmsUrl"
					:inviteCode="inviteCode"
					:inviteCodeRequired="inviteCodeRequired"
					:agreementUrl="agreementUrl"
					:privacyUrl="privacyUrl"
					:inviteCodeCacheKey="inviteCodeCacheKey"
					v-model="mobile"
					@success="loginSuccess"
					@login="changeScene('passwordLogin')">
				
				</base-regist>
			
				
				<!-- 找回密码 -->
				<base-regist v-else-if="scene == 'resetPassword'"
					key="resetPassword"
					scene="login"
					btnText="确认重置"
					:loginTypes="loginTypes"
					:needPermission="needPermission"
					:action="resetPasswordUrl"
					:sendSmsUrl="sendSmsUrl"
					:inviteCodeCacheKey="inviteCodeCacheKey"
					v-model="mobile"
					@success="loginSuccess"
					@login="changeScene('passwordLogin')"></base-regist>	
				
				
				<!-- 绑定手机号码 -->
				<base-login-sms v-else-if="scene == 'bindMobile'"
					key="bindMobile"
					scene="bind"
					btnText="确认绑定"
					:action="bindMobileUrl"
					:sendSmsUrl="sendSmsUrl"
					v-model="mobile"
					@success="bindMobileSuccess"></base-login-sms>
				
				
				<!-- 登录方式切换 -->
				<view>
					
					<!-- 其他登录标题 -->
					<view class="flex ct mt50" v-if="showTitle">
						<view class="bt w30"></view>
						<view class="gray mlr10 fz12">{{title}}</view>
						<view class="bt w30"></view>
					</view>
					
					
					
					<view class="flex ct mt">
						
						<!-- 切换到密码登录 -->
						<view class="pd" v-if="showPsw" @tap="changeScene('passwordLogin')">
							<image src="./static/passwordLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						
						<!-- 切换到短信登录 -->
						<view class="pd" v-if="showSms" @tap="changeScene('smsLogin')">
							<image src="./static/smsLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						
						<!-- #ifdef APP-PLUS -->
						
						<!-- 苹果登录 -->
						<view v-if="showApple" @tap="appleLogin()" class="pd">
							<image src="./static/appleLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						
						<!-- 微信APP登录 -->
						<view v-if="showWxapp" class="pd" @tap="weixinLogin()">
							<image src="./static/weixinLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						
						<!-- 一键登录、授权手机号码 -->
						<view v-if="showUniverify" class="pd" @tap="univerifyLogin()">
							<image src="./static/univerifyLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						
						<view class="pd" v-if="showQQ">
							<image src="./static/qqLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						<view class="pd" v-if="showWeibo">
							<image src="./static/weiboLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
						<view class="pd" v-if="showBaidu">
							<image src="./static/baiduLogin.png" mode="widthFix" class="w45 h45"></image>
						</view>
				
						<!-- #endif -->
						
					</view>
					
					
					<view class="mt30 flex ct"  :class="{none : notLoginMode}">
						<block v-if="scene == 'passwordLogin'">
							<view @tap="changeScene('resetPassword')">找回密码</view>
							<view class="plr10 op5 gray">|</view>
						</block>
						<view @tap="changeScene('register')">注册账号</view>
					</view>
					
				</view>
			
			</view>
			
		</view>
		
		
		<!-- 绑定提醒 -->
		<b-modal ref="bindModal" title="绑定提醒" :show-close="false" btn-type="coverBtn" :countdown="9" 
			header-class="bold pd text-center fz16" confirm-text="确认绑定"
			@confirm="onRebind()"
			@cancel="onBindModalCancel()">
			<view>
				您要绑定的{{bindData.name}}已经注册为其他账号，该账号中的资产为：{{bindData.coin}}金币。
			</view>
			<view class="pt red">
				如果继续绑定，则会将该账号注销并清空相关数据。
			</view>
			<view class="ptb30 text-center fz18">
				是否确认绑定？
			</view>
		</b-modal>

	</view>
</template>

<script>
	import baseLoginTypes from "./js_sdk/base-login-types.js" ;
	import baseUniverifyLogin from "./js_sdk/base-login-univerify.js" ;
	import baseAppleLogin from "./js_sdk/base-login-apple.js" ;
	import baseWeixinLogin from "./js_sdk/base-login-weixin.js" ; 
	import baseMobileLogin from "./js_sdk/base-login-mobile.js" ; 
	export default {
		name:"base-logins",
		mixins:[baseLoginTypes,baseUniverifyLogin,baseAppleLogin,baseWeixinLogin,baseMobileLogin],
		props: {
			defaultScene:{
				type : String ,
				default:"passwordLogin"
			},
			loginTypes:{
				type : Array ,
				default(){
					return ["passwordLogin","univerifyLogin","smsLogin","weixinLogin","appleLogin","qqLogin","weiboLogin","baiduLogin"] ;
				}
			},
			loginUrl:{
				type : String ,
				required : true
			},
			mode:{
				type : String ,
				default : "display"
			},
			inviteCodeCacheKey:{
				type : String ,
				default : "base_inviteCode"
			},
			forceBindMobile:Boolean,
			logo:String,
			href:String,
			url:String,
			params:{
				type : Object,
				default(){
					return {} ;
				}
			},
			openType:String,
			tokenKey:{
				type : String ,
				default : "uniIdToken"
			},
			tokenExpiredKey:{
				type : String ,
				default : "uniTokenExpired"
			},
			basicPath:{  //base-logins插件所处的基础路径 
				type : String ,
				default : "/uni_modules/base-logins"
			},
			passwordType:{
				type : String ,
				default : "weekPassword"
			},
			passwordLoginUrl:{
				type : String,
				default : "base-login/password/login"
			},
			smsLoginUrl:{
				type : String,
				default : "base-login/sms/login"
			},
			sendSmsUrl:{
				type : String,
				default : "base-login/sms/send"
			},
			sendRegistSmsUrl:{
				type : String,
				default : "base-login/sms/sendRegister"
			},
			registUrl:{
				type : String,
				default : "base-login/common/regist"
			},
			resetPasswordUrl:{
				type : String,
				default : "base-login/common/resetPassword"
			},
			bindMobileUrl:{
				type : String,
				default : "base-login/user/user/bindMobile"
			},
			needPermission:Boolean,
			forceBind:Boolean,
			inviteCode:{
				type : Boolean ,
				default : true 
			},
			inviteCodeRequired:Boolean,
			agreementTitle:{
				type : String  ,
				default:"用户协议及隐私政策"
			},
			agreementUrl:{
				type : String ,
				required : true
			},
			privacyUrl:{
				type : String ,
				required : true
			},
			univerifyStyle:{
				type : Object ,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				sceneChanging : true ,
				prevScene : "" ,
				scene : this.defaultScene ,
				mobile : "" 
			}
		},
		computed: {
			checkMode(){
				return this.mode == 'check' ;
			},
			displayMode(){
				return this.mode == "display" ;
			},
			bindWeixinMode(){
				return this.mode == "bindWeixin" ;
			},
			bindAppleMode(){
				return this.mode == "bindApple" ;
			},
			bindMobileMode(){
				return this.mode == "bindMobile" ;
			}
		},
		watch: {
			scene:{
				handler(value,oldValue){
					this.prevScene = oldValue ;
					if (this.displayMode) {
						uni.setNavigationBarTitle({
							title : this.getTitleByScene(value)
						});
					}
				},
				immediate : true
			}
		},
		created() {
			this.mobile = uni.getStorageSync("base-mobile") ;
			
		},
		mounted() {
			this.getLocalScene();
		},
		methods: {
			
			getTitleByScene(scene){
				return {
					"register" : "快速注册" ,
					"resetPassword" : "重置密码" ,
					"bindMobile" : "绑定手机号码",
					"smsLogin" : "短信登录" ,
					"passwordLogin" : "密码登录"
				}[scene] || "登录" ;
			},
			
			async checkToken(){
				//显示登录面板
				if (!uni.$b.isLogin()) {
					this.toLogin();
					return ;
				}
				

				//需要绑定手机号码
				let user = uni.getStorageSync("base-user") ;
				if ( !user.mobileBind && this.forceBindMobile ) {
					this.bindMobile(); 
					return ;
				}
				
				//token有效，登录成功
				await this.complete();
			},
			
			changeScene(scene){
				this.sceneChanging = true ;
				this.scene = scene ;
				this.$nextTick(() => {
					setTimeout(() => {
						this.sceneChanging = false ;
					}, 400);
				});
			},
			
			setLocalScene(scene){
				if (scene) {
					uni.setStorageSync("base-logins-scene" , scene);
				}
			},
			
			getLocalScene(){
				if (!this.displayMode) {
					return ;
				}
				let scene = uni.getStorageSync("base-logins-scene") || "" ;
				if ( scene ) {
					this.changeScene(scene);
					uni.removeStorageSync("base-logins-scene");
				}
				return scene ;
			},
			 
			toLogin(){ 
				// #ifdef APP-PLUS
				if (this.showUniverify) {
					this.univerifyLogin("univerfyLogin");
					return ;
				}
				// #endif
				
				this.navLogin();
			},
			
			onChangeOthers(loginType){
				if (this.displayMode) {
					return ;
				}
				this.setLocalScene(loginType);
				this.navLogin();
			},
			
			navLogin(){
				uni.navigateTo({
					url : this.loginUrl,
					animationDuration:100,
					animationType:"slide-in-bottom"
				});
			},
			
			//登录成功
			async loginSuccess(e){
				let {user,token,tokenExpired,menus, permissions} = e ;
				
				//绑定手机号
				if (!user.mobileBind && this.forceBindMobile) {
					this.bindMobile(e);
					return ;
				}
				
				uni.$emit("base-logins-bind" , user) ;
				
				//存储用户信息，本地保持登录状态
				uni.setStorageSync( this.tokenKey , token);
				uni.setStorageSync( this.tokenExpiredKey , tokenExpired);
				uni.setStorageSync("base-user" , user);
				
				//存储权限数据
				if (this.needPermission) {
					uni.setStorageSync("base-menus" , menus);
					uni.setStorageSync("base-permissions" , permissions);
				}
				
				this.$emit("loginSuccess" , e);
				
				//暂存上次登录成功的手机号码
				if (uni.$b.isMobile(this.mobile)) {
					uni.setStorageSync("base-mobile" , this.mobile);
				}
				
				await this.complete();
			},
			
			bindMobile(e){
				if (!e) {
					e = {
						user : uni.getStorageSync("base-user"),
						token : uni.getStorageSync( this.tokenKey ),
						tokenExpired : uni.getStorageSync( this.tokenExpiredKey ),
						menus : uni.getStorageSync( "base-menus" ), 
						permissions : uni.getStorageSync( "base-permissions" )
					}
				}
				
				uni.setStorageSync("base-logins-result" , e);
				
				// #ifdef APP-PLUS
				if (this.showUniverify) {
					this.univerifyLogin("univerifyBind");
					return ;
				}
				// #endif
				
				this.changeScene("bindMobile");
				this.onChangeOthers("bindMobile");
			},
			
			//业务执行完毕
			async complete(){
				//跳转
				if (this.href) {
					uni.$b.open({
						url : this.href ,
						params :this.params ,
						openType : this.displayMode ? "redirectTo" : this.openType
					});
					return ; 
				}
				
				//请求接口
				if (this.url) {
					let res = await uni.$b.call(this.url , this.params);
					this.$emit("success" , res);
					return ;
				}
				
				//登录成功回调
				this.$emit("success");
			},
			
			async bindMobileSuccess(res){
				let {mobile , code} = res ;
				
				if (code != "ok") {
					return await this.bindTypesSuccess(res , "mobileBind");
				}
				
				//更新绑定状态
				this.mobileBind = true ;
				this.$emit("mobileBind" , true);
				
				if (!!mobile) {
					this.mobile = mobile ; 
				}
				
				let loginRes = uni.getStorageSync("base-logins-result") ;
				if (loginRes) {
					uni.removeStorageSync("base-logins-result");
				}else{
					loginRes = {
						user : uni.getStorageSync("base-user"),
						token : uni.getStorageSync( this.tokenKey ),
						tokenExpired : uni.getStorageSync( this.tokenExpiredKey ),
						menus : uni.getStorageSync( "base-menus" ), 
						permissions : uni.getStorageSync( "base-permissions" )
					}
				}
				
				let {user} = loginRes ;
				user.mobileBind = true ;
				
				await this.loginSuccess(loginRes);
			},
			
			onBindModalCancel(){
				this.$refs.bindModal.hide();
				console.log("this.scene: ",this.scene);
				if (this.scene == "univerifyBind") {
					this.onChangeOthers("bindMobile");
				}
			},
		
			async onRebind(){
				let {token,bindType} = this.bindData ;
				let res = await uni.$b.call({
					url :  "base-login/user/user/rebind" , 
					data : { token , bindType }
				});
				this.$refs.bindModal.hide();
				if (bindType != "mobileBind") {
					this.showBindResult(bindType);
					return ;
				}
				this.$emit("cancelAccount" , res);
				await this.bindMobileSuccess(res);
			}
		}
	}
</script>
