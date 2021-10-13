<template>
	<view class="pd" @tap="login()">
		<image src="../base-login-types/static/univerifyLogin.png" mode="widthFix" class="w40 h40"></image>
	</view>
</template>

<script>
	import typesMixin from "../base-login-types/base-login-types-mixin.js" ;
	export default {
		name:"base-login-univerify",
		mixins:[typesMixin],
		props:{
			scene : String ,
			basicPath : String ,
			value : Boolean ,
			providers:{
				type : Array ,
				default(){
					return [] ;
				}
			}
		},
		data() {
			return {
				bindUrl : "base-login/user/user/bindMobile",
				loginUrl : "base-login/univerify/login",
				preloginTimer: null
			};
		},
		computed: {
			
			buttons(){
				let basicPath = this.basicPath ;
				return this.providers.map(provider => {
					return {
						provider ,
						iconPath : `${basicPath}/components/base-login-types/static/${provider}.png`
					}
				});
			},
			
			_univerifyStyle() {
				return uni.$b.deepMerge(
					{
						"otherLoginButton": {
						    "visible": false 
						},
						authButton: {
							normalColor: uni.$b.getValue("components.mainColor"),
							highlightColor: uni.$b.getValue("components.mainColor"),
							textColor:uni.$b.getValue("components.mainInverse")
						},
						buttons: {
							"iconWidth": "45px",
							"list" : this.buttons
						}
					},
					this.univerifyStyle,
					{
						fullScreen: true
					}
				);
			},
			
			bindStyle(){
				let btn = this.buttons.find(item => item.provider == "smsLogin");
				let list = [] ;
				if (btn) {
					list.push({
						...btn ,
						provider : "bindMobile"
					});
				}
				return uni.$b.deepMerge(this._univerifyStyle , {
					authButton: {
						"title": "本机号码一键绑定"
					},
					buttons: {
						"list" : list
					}
				})
			}
		},
		async created() {
			await this.preLogin();
		},
		methods: {
			preLogin() {
				clearTimeout(this.preloginTimer);
				return new Promise((resolve, reject) => {
					uni.preLogin({
						provider: "univerify",
						success: (res) => {
							this.$emit("input" , true);
	
							//超时后自动重新获取
							this.preloginTimer = setTimeout(() => {
								this.preLogin();
							}, 9 * 60 * 1000);
							
							resolve(true);
						},
						
						fail: (res) => {
							// 预登录失败
							this.$emit("input" , false);
							// 不显示一键登录选项（或置灰）
							// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
							console.log(res.errCode);
							console.log(res.errMsg); 
							resolve(false);
						}
					});
				});
			},
	
			univerify(univerifyStyle) {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: "univerify",
						univerifyStyle ,
						success: (res) => {
							// {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
							resolve(res.authResult);
						},
						fail: (err) => {
							console.log("err :>> ", err);
							// 登录失败
							console.log(err);
							this.univerifyFail(err);
						},
						complete: (res) => {
							uni.closeAuthView();
							//重新预登陆
							this.preLogin();
						}
					});
				});
			},
			
			univerifyFail(res){
				let {errCode , errMsg , index , provider} = res ;
				
				//用户关闭授权界面,登录流程结束
				if ( errCode == 30003 ) {
					this.$emit("cancel");
					return;
				}
				
				//用户点击了其他登录方式
				if (errCode == 30002 || errCode == 30006) {
					this.$emit("changeOthers");
					return ;
				}
	
				//用户点击了自定义登录按钮
				if (errCode == 30008) {
					this.$emit("changeType" , provider);
					return ; 
				}
				
				//弹出错误提示
				uni.$b.showToast(errMsg);
			},
	
			async login(isBind) {
				
				if (isBind === undefined) {
					isBind = this.scene == "bindMobile" ;
				}
				
				console.log("isBind: ",isBind);
				
				//激活预登陆
				// let prepared = await this.preLogin();
				// if (!prepared) {
				// 	this.univerifyFail({errCode : 30002 , errMsg : "预登录失败" });
				// 	return ;
				// }
				
				//请求手机号授权数据，服务端登录
				let style = isBind ? this.bindStyle : this._univerifyStyle ;
				let data = await this.univerify(style);
				let url = isBind ? this.bindUrl : this.loginUrl ;
				let res = await this.sendRequest(data , url , !isBind);
				if (isBind && res.code != "ok") {
					this.$emit("changeType" , "bindMobile");
				}
			}
		}
	};
</script>
