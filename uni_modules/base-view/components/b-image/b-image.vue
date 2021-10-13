<template>
	<view class="b-image" :style="boxStyle">
		
		<view id="observer" class="square" 
			:class="squareClassName"
			:style="squareStyle">
			
			
			<!-- 默认图片 -->
			<image  v-if="defaultSrc" :src="defaultSrc" mode="aspectFill" :class="imgClass"></image>
			<view v-else-if="!inView" :class="imgClass" class="flex ct fz40 grayBg op1">
				<view :class="defaultIcon"></view>
			</view>
			<!-- 默认图片  END-->
			
			<!-- 图片 START-->
			<image v-if="inView"
				id="img"
				:class="imgClass"
				:src="imgSrc" 
				:mode="mode" 
				:lazy-load="_lazyLoad"
				@tap="_onPreview()"
				@longpress="_onPress"
				@load="_onLoad"
				@error="_onError"></image>
			<!-- 图片 END-->
			
			
			<!-- 加载失败 -->
			<block v-if="loadFail">
				<image v-if="!!errorSrc" :src="errorSrc" mode="aspectFill" :class="imgClass"></image>
				<view v-else :class="imgClass" class="flex ct fz40 grayBg">
					<view :class="errorIcon"></view>
				</view>
			</block>
			<!-- 加载失败 -->
			
			
			<!-- 加载中 -->
			<block v-if="loading">
				
				<view v-if="slots.loading" :class="imgClass">
					<slot name="loading"></slot>
				</view>
				
				<block v-else-if="loadingType == 'light'">
					
					<view :class="imgClass" class="hidden wp1">
						<view class="light"></view>
					</view>
					 
				</block>
				<block v-else>
					
					<view :class="imgClass" class="flex ct wp1">
						<b-loading :type="loadingType" size="18" :duration="1000"></b-loading>
					</view>
					
				</block>
				
			</block>
			
				
		</view>
		
		
		<!-- 保存到相册 -->
		<b-scopes 
			:ref="scopeId"
			:title="scopeTitle"
			:remark="scopeRemark"
			name="saveImageToPhotosAlbum"
			@success="_save"></b-scopes>
		
	</view>
</template>

<script>
	import imgProps from "../b-image/b-image-props.js" ;
	import lazyLoad from "./b-image-lazyload-app-h5.js" ;
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description Image 图片，内置图片待加载、加载中、加载完成、加载失败的状态管理逻辑，相比原生image组件，将懒加载特性平台兼容性拓展至全平台兼容。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/image
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            loading             加载状态插槽，用于覆盖内置加载状态内容，图片加载时显示。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             load                图片加载成功，可获取图片的宽度、高度。 | 参数：( e )
	* @event    {Function}             error               图片加载失败时触发 | 参数：( e )
	* @event    {Function}             lazyLoad            图片进入视图区域触发懒加载时触发，若图片在首屏则会直接触发，仅H5、APP支持。 | 参数：--
	* @event    {Function}             tapMenu             点击自定义的长按菜单时触发 | 参数：( e )
	* @event    {Function}             saveSuccess         保存图片到相册后触发 | 参数：( e )
	* @event    {Function}             saveFail            保存图片失败时触发，组件已做错误反馈提示，通常无需自行处理。 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          save()              保存图片到相册，H5不支持。 --
	* @method                          previewImage()      预览图片 ( urls )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               src                 图片地址，本地图片路径请使用“/static”的路径开头。
	*    @value                        /uni_modules/baker-admin/static/            本地图片路径
	*    @value                        item.               本地变量
	*    @value                        data.               本地变量
	* @property {String|Number|Array}  width               【响应式属性】 图片宽度，默认"25%,20%,16.666%,80"。
	* @property {String|Number|Array}  height              【响应式属性】 图片高度，若设置为百分比，则表示占【图片宽度】的百分比，默认100%。当图片宽度不固定时，可利用该特性构建具有固定宽高比例的图片，例如设置为100%时即可得到一个正方形图片。
	* @property {String}               mode                图片裁剪模式，默认aspectFill。
	*    @value                        scaleToFill         不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
	*    @value                        aspectFit           保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
	*    @value                        aspectFill          保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
	*    @value                        widthFix            宽度不变，高度自动变化，保持原图宽高比不变
	*    @value                        heightFix           高度不变，宽度自动变化，保持原图宽高比不变 App 和 H5 平台 HBuilderX 2.9.3+ 支持、微信小程序需要基础库 2.10.3
	*    @value                        top                 不缩放图片，只显示图片的顶部区域
	*    @value                        bottom              不缩放图片，只显示图片的底部区域
	*    @value                        center              不缩放图片，只显示图片的中间区域
	*    @value                        left                不缩放图片，只显示图片的左边区域
	*    @value                        right               不缩放图片，只显示图片的右边区域
	*    @value                        top left            不缩放图片，只显示图片的左上边区域
	*    @value                        top right           不缩放图片，只显示图片的右上边区域
	*    @value                        bottom left         不缩放图片，只显示图片的左下边区域
	*    @value                        bottom right        不缩放图片，只显示图片的右下边区域
	* @property {Boolean|String}       lazy-load           懒加载，全平台兼容，默认true，可通过配置文件配置components.image.lazyLoad来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       fade-show           启用淡入动画，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       press-save          长按图片保存到相册，默认false，也可调用save()方法保存到相册。H5不支持。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         press-options       长按唤起的菜单列表，此处传入一个或多个菜单名称，多个菜单名称可以是数组，也可以是用英文逗号连接的字符串。而后在@tapMenu事件中处理自定义业务逻辑。
	* @property {Boolean|String}       preview             点击图片是否可预览，可配置预览大图链接，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         preview-src         预览大图的链接，未传入时使用src
	* @property {String}               img-class           图片样式类名
	*    @value                        rds                 圆形图片
	*    @value                        rds4                4px圆角
	*    @value                        bd                  边线
	* @property {String}               loading-type        图片加载状态样式类型，默认circle，可通过配置文件配置components.image.loadingType来修改默认值。
	*    @value                        flower              菊花
	*    @value                        circle              圆圈
	*    @value                        light               光影
	* @property {String|Number}        loading-delay       开始加载图片后多久显示loading状态，单位ms，默认300。
	* @property {String}               default-src         图片加载时的默认图片地址。使用本地图片地址时，需使用以“/uni_modules/baker-admin/static/”开头的绝对路径，如："/uni_modules/baker-admin/static/default.png"。可通过配置文件配置components.image.defaultSrc来修改默认值。未配置default-src时，将使用default-icon属性设置的图标来代替。
	*    @value                        /uni_modules/baker-admin/static/            本地图片以/uni_modules/baker-admin/static/开头
	*    @value                        http://             http
	*    @value                        https://            https
	*    @value                        item.               本地变量
	*    @value                        data.               本地变量
	* @property {String}               default-icon        图片加载中，未配置default-src属性时显示的默认图标类名，默认bIcon-pic。
	* @property {String}               error-src           图片加载失败时的失败图片地址。使用本地图片地址时，需使用以“/uni_modules/baker-admin/static/”开头的绝对路径，如："/uni_modules/baker-admin/static/error.png"。可通过配置文件配置components.image.errorSrc来修改默认值。未配置error-src时，将使用error-icon属性设置的图标来代替。
	* @property {String}               error-icon          图片加载失败，且未配置error-src属性时显示的图标类名，默认bIcon-loadFail。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-image",
		mixins:[ imgProps , mediaMixins ,lazyLoad ],
		data() {
			return {
				srcSync : "" ,
				list : "" ,
				loadFail : false ,
				loading : false ,
				imgRect : {} ,
				pressTimer : '' ,
				loadingTimer : null ,
				// #ifndef APP-PLUS || H5
				inView : true , 
				// #endif
				// #ifdef MP-TOUTIAO
				scopeId : uni.$b.buuid()
				// #endif
				// #ifndef MP-TOUTIAO
				scopeId : "imgScoper"
				// #endif
			}
		},
		computed:{
			
			slots(){
				return uni.$b.getSlots.call( this , "loading") ;
			},
			
			_fadeShow(){
				return uni.$b.isTrue(this.fadeShow) ;
			},
			
			_width(){
				return this.uv(this.width) ;
			},
			
			_height(){
				return this.uv(this.height) ;
			},
			
			_radius(){
				return this.uv(this.radius) ;
			},
			
			_pressSave(){
				return uni.$b.isTrue(this.pressSave) ;
			},
			
			_pressOptions(){
				let options = uni.$b.parseArray(this.pressOptions , ",");
				if (this._pressSave) {
					options.push("保存至相册");
				}
				return options ;
			},
			
			isFixMode(){
				return this.mode && this.mode.indexOf("Fix") > -1 ;
			},
			
			imgSrc(){
				return this.inView && !!this.srcSync ? this.srcSync : '' ;
			},
			
			boxStyle(){
				return uni.$b.getStyle({
					"width" : this.imgRect.width ? `${this.imgRect.width}px` : this._width
				})
			},
			
			squareClassName(){
				return this.inView && this._fadeShow && !this.loading ? "animate fadeIn" : '';
			},
			
			squareStyle(){
				return uni.$b.getStyle({
					"padding-top" : this.imgRect.height ? `${this.imgRect.height}px` : this._height ,
					"animation-duration" : this.inView && this._fadeShow ? '1s' : ''
				});
			}
		},
		watch:{
			src:{
				async handler(src){
					//腾讯云云存储图片
					this.srcSync = await uni.$b.getTempFileURL(src);
					if (this.srcSync) {
						this.loading = true ;
					}
				},
				immediate : true 
			},
			imgSrc:{
				handler(){
					this.loadFail = false ;
					if (!this.loading && !!this.imgSrc) {
						this._startLoading();
					}
				},
				immediate : true 
			}
		},
		methods: {
			
			_startLoading(){
				this.loadingTimer = setTimeout(()=>{
					this.loading = true ;
				} , this.loadingDelay );
			},
			
			_onLoad(e){
				clearTimeout(this.loadingTimer);
				this.loading = false ;
				//根据图片的宽高来调整自定义图片组件的宽高
				if (this.isFixMode) {
					this.$nextTick(()=>{
						uni.$b.select("#img",this).then(rect=>{
							this.imgRect = rect ;
						});
					})
				}
				this.$emit("load" , e);
			},
			
			_onError(e){
				clearTimeout(this.loadingTimer);
				this.loading = false ;
				this.loadFail = true ;
				this.$emit("error" , e);
			},
			
			_onPress(){
				uni.showActionSheet({
					itemList: this._pressOptions,
					success: ({tapIndex}) => {
						if (this._pressSave && tapIndex == this._pressOptions.length - 1) {
							this.save();
							return ;
						}
						this.$emit("tapMenu" , {tapIndex , menu : this._pressOptions[tapIndex]} );
					}
				})
			},
			
			save(){
				// #ifdef APP-PLUS
				this._save();
				// #endif
				
				// #ifndef APP-PLUS
				this.$refs[this.scopeId].get() ;
				// #endif
			},
			
			_save(){
				
				uni.showLoading({
					title:"保存中...",
					mask:true 
				})
				
				let downloadTask = uni.downloadFile({
					url : this.imgSrc ,
					success : ({tempFilePath})=>{
						let data = {filePath:tempFilePath} ;
						uni.saveImageToPhotosAlbum({
							...data ,
							success: (e) => {
								uni.showToast({
									title: '已保存到相册',
									icon : 'success'
								});
								this.$emit("saveSuccess" , data );
							},
							fail:(err)=>{
								// #ifndef APP-PLUS
								this._saveImageFail(err);
								// #endif
								
								// #ifdef APP-PLUS
								this.$refs[this.scopeId].get() ;
								// #endif
							}
						})
					},
					fail : this._saveImageFail 
				});
				
				downloadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: `${res.progress}%`
					});
				    if (res.progress >= 100) {
				        uni.hideLoading();
				    }
				});
			},
			
			_saveImageFail(e){
				uni.$b.showModal({
					content:JSON.stringify(e),
					showCancel:false
				})
				this.$emit("saveFail" , e);
			},
			
			_onPreview(e){
				this.$emit("click",e);
				if (!uni.$b.isTrue(this.preview)) {
					return ;
				}
				this.previewImage();
			},
			
			previewImage(urls){
				let current = this.previewSrc || this.imgSrc ;
				urls = uni.$b.isArray(urls) ? urls : [current] ;
				uni.previewImage({
					current,
					urls
				})
			}
		}
	}
</script>

<style>
	image{will-change: transform}
	@keyframes move{
		from{
			transform: translateX(-1000%) translateY(-50%) rotate(-30deg);
		}
		to{
			transform: translateX(1000%) translateY(-50%) rotate(-30deg);
		}
	}
	.light{
		transform: translateY(-50%);
		width: 30%;
		height: 300%;
		background-image: linear-gradient(to right , rgba(255,255,255,0.05) , rgba(255,255,255,0.2), rgba(255,255,255,0.05));
		animation: move 2.5s infinite ease-in-out;
	}
</style>
