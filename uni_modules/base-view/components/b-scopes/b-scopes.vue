<template>
	<view class="b-scope">
		
		<view @tap.stop="get()">
			<slot></slot>
		</view>
		
		<b-result 
			v-model="showResult"
			icon="bIcon-warnFill"
			color="#f69c00"
			:title="_title"
			:remark="_remark">

			<view class="text-center ptb40">
				<b-btn color="#f69c00" @tap="_openSetting" radius="40" ptb="8" width="110">
					打开设置
				</b-btn>
			</view>
			
		</b-result>
		
	</view>
</template>

<script>
	import permision from "./app-permission.js";
	/**
	* @description Scope 授权管理，完整的请求授权、授权拒绝处理、打开设置、系统权限API调用的处理逻辑，支持在小程序、APP中保存图片、保存视频、获取地理位置、选择地理位置、获取全局录音管理器、选取收货地址等业务场景。
	* @tutorial    https://base-view.cn/#/pages/doc/scope
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                   default                      默认插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}    success                      已获得授权或授权成功时触发，通过监听此事件，来调用相应的接口。 | 参数：( e )
	* @event    {Function}    fail                         授权失败、相关接口调用失败时触发，组件内部已有错误反馈处理逻辑，大多数情况下不需要自行处理。 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                 get()                        申请授权 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}      name                         接口名称，必填属性，详见可选值说明。
	*    @value               chooseAddress                选取收货地址
	*    @value               getLocation                  获取地理位置
	*    @value               chooseLocation               选取位置坐标
	*    @value               getRecorderManager           获取全局唯一的录音管理器
	*    @value               saveImageToPhotosAlbum       保存图片到相册
	*    @value               saveVideoToPhotosAlbum       保存视频到相册
	* @property {String}      title                        未授权弹窗的标题，默认：权限未授权
	* @property {String}      remark                       未授权弹窗的提示信息，默认：请打开设置界面授权后继续操作
	* 
	* @property {String}      ref                           获取组件对象，通常用于调用组件内置方法。
	* @property {String}      v-slot:default                默认插槽作用域变量
	*/
	export default {
		name:"b-scopes",
		props:{
			name : {
				type : String ,
				required : true
			},
			title : String,
			remark : String
		},
		data() {
			return {
				scopes:{
					"chooseAddress" : "scope.address" ,
					 //scope.userLocation 权限需要在 manifest.json 配置 permission
					"getLocation" : "scope.userLocation" ,
					"chooseLocation" : "scope.userLocation" ,
					"getRecorderManager" : "scope.record",
					// #ifdef MP-TOUTIAO
					"saveImageToPhotosAlbum" : "scope.album",
					"saveVideoToPhotosAlbum" : "scope.album",
					// #endif
					// #ifndef MP-TOUTIAO
					"saveImageToPhotosAlbum" : "scope.writePhotosAlbum",
					"saveVideoToPhotosAlbum" : "scope.writePhotosAlbum",
					// #endif
				},
				showResult : false 
			}
		},
		computed:{
			scope(){
				let scope = this.scopes[this.name];
				if(!scope && this.name){
					console.error(`the current name is not supported`)
				}
				return scope ;
			},
			
			_title(){
				return this.title ? this.title : uni.$b.localeB("scope.title") ;
			},
			
			_remark(){
				return this.remark ? this.remark : uni.$b.localeB("scope.remark") ;
			}
		},
		methods: {
			get(){
				console.log("get");
				// #ifdef H5
				this._authSuccess();
				// #endif
				
				let config = {
					scope : this.scope ,
					success: this._authSuccess ,
					fail: this._authFail
				};
				
				// #ifdef APP-PLUS
				permision.authorize(config);
				// #endif
				
				// #ifdef MP
				uni.authorize(config);
				// #endif
			},
			
			_authSuccess(){
				console.log("success");
				//获得对应权限
				this.$emit("success" , {[this.scope] : true });
			},
			
			_authFail(err){
				console.log("未授权" , JSON.stringify(err) , "+");
				//拒绝授权
				if (this._isDeny(err)) {
					this.$emit("fail" , err);
					this.showResult = true ;
					return ;
				}
				this._fail(err);
			},
			
			
			
			_openSetting(){
				this.showResult = false ;
				
				// #ifdef APP-PLUS
				permision.gotoAppPermissionSetting()
				// #endif
				
				// #ifdef MP
				uni.openSetting({
					success: ({authSetting}) => {
						if (authSetting[this.scope]) {
							//获得对应权限
							this._authSuccess();
							return ;
						}
						//用户未授权
						this.$emit("fail", {errMsg : authSetting});
					},
					fail: this._fail
				})
				// #endif
			},
			
			_getErrMsg(e){
				// #ifdef MP-WEIXIN
				return e.errMsg ;
				// #endif
				// #ifdef MP-ALIPAY
				return e.errorMessage ;
				// #endif
				// #ifdef APP-PLUS
				return e.hasAuth ;
				// #endif
			},
			
			_isDeny(e){
				// #ifdef APP-PLUS
				return !e.hasAuth ;
				// #endif
				
				// #ifdef MP-WEIXIN
				return errMsg.indexOf("auth deny") > -1 ;
				// #endif
				
				// #ifdef MP-ALIPAY
				return e.error === 4 ;
				// #endif
			},
			
			_fail(e){
				this.$emit("fail" , { ...e , errMsg : this._getErrMsg(e) }) ;
				uni.$b.showModal({
					content: JSON.stringify(e),
					showCancel:false 
				})
			}
		}
	}
</script>