<template>
	<view class="b-images father">
		
		<view class="_box grid" :style="gridStyle">
			
			
			<view :style="boxStyle" v-if="slots.prepend">
				<slot name="prepend"></slot>
			</view>
			
			
			<view class="_img" 
				:style="boxStyle"
				v-for="( item , index) in listSync" :key="item.key">
				
				<view class="father" :class="{ op0 : item.moving }">
					
					<b-image
						:loading-delay="loadingDelay"
						:src="item.src"
						:mode="mode"
						:preview="false"
						:img-class="imgClass"
						:lazyLoad="lazyLoad"
						:fadeShow="fadeShow && notInit"
						:pressSave="pressSave"
						:press-options="pressOptions"
						:height="_height"
						width="100%"
						@tap="previewImage(index)"
						@tapMenu="_tapMenu($event,index,item)"
						@saveSuccess="$emit('saveSuccess',$event)"
						@saveFail="$emit('saveFail',$event)">
					
					</b-image>
					
					
					<!-- 关闭按钮 -->
					<view class="abs top right blackBg op7 rdsBl7 z2 plr4 fz12 op7 pointer" 
						v-if="_removable"
						:style="closeStyle"
						@tap.stop="_remove(index,item.src)">
						<view class="bIcon-multiply" style="transform: scale(0.7);"></view>
					</view>
					
					
				</view>
					
			</view>
			
			
			<view class="father z3" :style="boxStyle" v-if="slots.append && _showAppend">
				<slot name="append"></slot>
			</view>
			
			
		</view>
		
		
		<!-- #ifndef MP-TOUTIAO -->
		
		<movable-area class="grid abs"
			:style="moveAreaStyle"
			v-if="_movable">
			
			<movable-view 
				direction="all"
				:class="item.className"
				:style="item.style"
				:x="item.x"
				:y="item.y"
				:damping="50"
				:friction="0.1"
				:animation="true"
				@touchstart.passive="_onMouseDown(index)"
				@touchend="_exchangePos"
				@mousedown.passive="_onMouseDown(index)"
				@mouseup="_exchangePos"
				@change="_onMoving"
				v-for="( item , index) in imgAreas" :key="index">
				
				<view class="father" @tap="previewImage(index)">
					
					<b-image
						:loading-delay="loadingDelay"
						:img-class="imgClass"
						:key="item.key"
						:src="item.src"
						:mode="mode"
						:preview="false"
						:lazyLoad="false"
						:fadeShow="false"
						:pressSave="pressSave"
						:press-options="pressOptions"
						:height="_height"
						width="100%"
						@tap.stop="previewImage(index)"
						@tapMenu="_tapMenu($event,index,item)"
						@saveSuccess="$emit('saveSuccess',$event)"
						@saveFail="$emit('saveFail',$event)">
						
					</b-image>
					
					
					<!-- 关闭按钮 -->
					<view class="abs top right blackBg op7 rdsBl7 z2 plr4 fz12 op7 pointer" 
						v-if="_removable"
						:style="closeStyle"
						@tap.stop="_remove(index,item.src)">
						
						<view class="bIcon-multiply" style="transform: scale(0.7);"></view>
						
					</view>
					
					
				</view>
				
			</movable-view>
			
			
		</movable-area>
		
		<!-- #endif -->

	</view>
</template>

<script>
	import imgProps from "../b-image/b-image-props.js" ;
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	// #ifndef MP-TOUTIAO
	import movableMixins from "./movable.js" ;
	// #endif
	/**
	* @description Images 图片组，基于`b-image`组件拓展的具有相同宽高的图片组，可预览，可拖动排序。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/images
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             tapMenu             配置press-options属性后，长按图片可显示菜单，点击菜单后触发。 | 参数：( e )
	* @event    {Function}             saveSuccess         保存图片到相册后触发 | 参数：( e )
	* @event    {Function}             saveFail            保存图片失败时触发，组件已做错误反馈提示，通常无需自行处理。 | 参数：( e )
	* @event    {Function}             change              拖动图片排序结束后触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          previewImage()      预览图片 ( index )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}         src                 图片链接，若为字符串时，则尝试通过spliter属性分割为表示多张图片的数组。
	* @property {String}               spliter             用于将String类型的src属性分割为数组的分隔符，默认为英文逗号。
	* @property {String|Number|Array}  width               【响应式属性】 单张图片的宽度，默认"25%,20%,80"，即：手机端一行4张，ipad一行5张，pc端每张图片宽度固定80px。
	* @property {String|Number|Array}  gutter              【响应式属性】 每张图片的外边距，默认5px。
	* @property {String|Number|Array}  height              【响应式属性】 单张图片的高度
	* @property {Boolean|String}       lazy-load           懒加载，默认true。全平台兼容。
	*    @value                        true                
	*    @value                        false               
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
	* @property {Boolean|String}       fade-show           启用淡入动画，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       press-save          长按图片保存到相册，默认true，H5端不支持。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         press-options       长按唤起的菜单列表，此处传入一个或多个菜单名称，多个菜单名称可以是数组，也可以是用英文逗号连接的字符串。而后在@tapMenu事件中处理自定义业务逻辑。
	* @property {Boolean|String}       preview             点击图片是否可预览，可配置预览大图链接，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         preview-src         预览大图的链接，若为字符串时，则尝试通过spliter属性分割为表示多张图片的数组。
	* @property {String}               img-class           图片样式类名
	*    @value                        rds                 圆形图片
	*    @value                        rds4                4px圆角
	*    @value                        bd                  边线
	* @property {Boolean|String}       keep-loading        保持loading状态，测试使用。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       movable             启用拖拽排序，默认false。头条小程序不支持。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               loading-type        图片加载状态样式类型，默认flower，可通过配置文件配置components.image.loadingType来修改默认值。
	*    @value                        flower              菊花
	*    @value                        circle              圆圈
	*    @value                        light               光影
	* @property {String|Number}        loading-delay       开始加载图片后多久显示loading状态，单位ms，默认300。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-images",
		mixins:[ 
			imgProps , 
			mediaMixins
			// #ifndef MP-TOUTIAO
			, movableMixins
			// #endif
		],
		props:{
			src:[String,Array],
			srcKey:{
				type : String ,
				default : "url"
			},
			previewSrc:[String,Array],
			spliter: {
				type : String ,
				default : ","
			},
			gutter:{
				type : [String,Number,Array],
				default(){
					return 5 ;
				}
			},
			preview :{
				type : [String , Boolean] ,
				default : true 
			},
			border:{
				type : String,
				default : "1px solid #e0e0e0" 
			},
			removable:[String,Boolean],
			showAppend:{
				type : [String,Boolean],
				default : true 
			}
		},
		data() {
			return {
				list : [] ,
				movingIdxs : [] ,
				notInit : true 
			}
		},
		computed:{
			
			_radius(){
				return this.uv(this.radius) ;
			},
			
			_removable(){
				return uni.$b.isTrue(this.removable);
			},
			
			_showAppend(){
				return uni.$b.isTrue(this.showAppend);
			},
			
			slots(){
				return uni.$b.getSlots.call(this,"prepend","append") ;
			},
			
			_width(){
				return this.uv(this.width) ; 
			},
			
			_height(){
				return this.uv(this.height) ;
			},
			
			_gutter(){
				return this.uv(this.gutter) ;
			},
			
			gridStyle(){
				return this.showMoveView ? uni.$b.getStyle({
					"height" : `${this.boxRect.height}px`,
					"margin-left" : `-${this.gutter}px`,
					"margin-right" : `-${this.gutter}px`
				}) : '' ;
			},
			
			boxStyle(){
				return uni.$b.getStyle({
					"width" : `calc(${this._width} + ${this._gutter} + ${this._gutter})` ,
					"padding" : this._gutter
				})
			},
			
			closeStyle(){
				return uni.$b.getStyle({
					'border-top-right-radius' : this._radius
				});
			},
			
			listSync(){
				let list = this.list.map( item => uni.$b.isObject(item) ? item : {[this.srcKey] : item} ) ;
				return list.map((item,i)=>{
					let src = item[this.srcKey] ;
					//使用src作为key对图片进行缓存，重复图片则添加下标
					let key = list.findIndex(c => c[this.srcKey] === src) == i ? src : src + i ;
					return {
						moving : this.movingIdxs.includes(i) ,
						keepLoading : item.keepLoading ,
						key ,
						src 
					} ;
				});
			}
		},
		
		watch:{
			src(n,o){
				this.list = uni.$b.parseArray(this.src , this.spliter);
				// #ifndef MP-TOUTIAO
				this._queryRects();
				// #endif
			}
		},
		
		created() {
			this.list = uni.$b.parseArray( this.src , this.spliter);
		},
		
		methods: {
			
			previewImage(index){
				if (!uni.$b.isTrue(this.preview) || this.movingPoint.x !== undefined ) {
					return ;
				}
				let urls = uni.$b.parseArray(this.previewSrc , this.spliter) ;
				if (urls.length == 0 || urls[index] === undefined ) {
					urls = this.list ;
				}
				let current = urls[index] ;
				uni.previewImage({
					current ,
					urls ,
					complete:()=>{
						console.log("complete");
					}
				})
			},
			
			_tapMenu(e,index,item){
				this.$emit("tapMenu" , {...e , index , src : item.src }) ;
			},
			
			_remove(index,src){
				this.$emit("remove" , {index , src});
			}
		}
	}
</script>
<style>
	movable-area.abs{
		position: absolute!important;
	}
	movable-view{
		box-sizing: border-box;
		position: absolute!important;
	}
</style>