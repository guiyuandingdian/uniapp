<template>
	<view class="b-sticky">
		
		<!-- 顶部测量点 -->
		<view class="fixed top" :style="{top : _top}" id="stickyTop"></view>
		
		
		<!-- 吸附点 -->
		<view id="sticky" :style="myStyle">
			<view :class="_stickyClass" :style="stickyStyle">
				<view :style="innerStyle">
					<slot></slot>
				</view>
			</view>
		</view>
		
		
		<!-- 底部测量点 -->
		<view class="fixed bottom" :style="{bottom : _bottom}" id="stickyBottom"></view>
		
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	import watcherMixins from "../../js_sdk/mixins/base-watcher-mixins.js" ;
	/**
	* @description Sticky 粘性布局，用于构建元素吸顶、吸底的粘性布局。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/sticky
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，用于放置需要吸顶的元素。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              当吸顶、吸底状态发生变化时触发 | 参数：( sticky )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Array}  bottom              【响应式属性】 距离底部多远时吸附在底部
	* @property {String}               sticky-class        当吸顶、吸底时追加的样式类名
	* @property {String|Number|Array}  top                 【响应式属性】 距离顶部多远时吸附在顶部，未定义时默认0。
	* @property {Number}               z-index             定位层级，默认16。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name : "b-sticky" ,
		mixins:[  mediaMixins , watcherMixins ],
		props:{
			top : [Number,String,Array] ,
			bottom : [Number,String,Array],
			stickyClass : {
				type : [String,Array],
				default : "whiteBg"
			} ,
			zIndex : {
				type: [Number,String] ,
				default : 16 
			}
		},
		data() {
			return {
				sticky : "" ,
				rect : {} , //吸顶元素布局信息
				bottomRect : {} ,
				topRect : {} 
			}
		},
		
		computed:{
			
			_top(){
				return this.uv(this.top) || 0 ;
			},
			
			_bottom(){
				return this.uv(this.bottom) ;
			},
			
			_stickyClass(){
				return this.sticky ? this.dv(this.stickyClass) : '' ;
			},
			
			topValue(){
				return this.topRect.top || 0 ;
			},
			
			bottomValue(){
				return this.bottomRect.bottom || uni.$b.getSafeArea().height;
			},
			
			//覆盖父级组件
			marginTop(){
				return this.topValue ? - this.topValue : 0 ;
			},
			
			marginBottom(){
				let bottom = uni.$b.parsePx( this._bottom , uni.$b.getSafeArea().height ) ;
				return bottom ? - bottom : 0 ;
			},
			
			myStyle(){
				return uni.$b.getStyle({
					"height" : this.sticky ? `${this.rect.height}px` : '' 
				});
			},
			
			stickyStyle(){
				if (!this.sticky) {
					return '' ;
				}
				return uni.$b.getStyle({
					"position" : "fixed" ,
					"z-index" : this.zIndex ,
					"height" : `${this.rect.height}px`,
					"top" : this.sticky == 'top' ? this._top : '' ,
					"bottom" : this.sticky == 'bottom' ? this._bottom : '',
					"left" : 0 ,
					"right" : 0
				}) ;
			},
			innerStyle(){
				if (!this.sticky) {
					return '';
				}
				return uni.$b.getStyle({
					"position" : "fixed" ,
					"z-index" : this.zIndex ,
					"height" : `${this.rect.height}px`,
					"top" : this.sticky == 'top' ? this._top : '' ,
					"bottom" : this.sticky == 'bottom' ? this._bottom : '',
					"left" : `${this.rect.left}px` ,
					"width" : `${this.rect.width}px`
				}) ;
			}
		},
		
		watch:{
			sticky(){
				this.$emit("change" , { sticky : this.sticky });
			}
		},
		
		methods: {
			
			_beforeCreate(){
				uni.$b.selectAll("#stickyTop,#sticky,#stickyBottom" , this).then(rect=>{
					this.topRect = rect[0] ;
					this.rect = rect[1] ;
					this.bottomRect = rect[2] ;
					this._createObserver("#sticky");
				});
			},
			
			_$watch(rect){
				let {top , bottom} = rect ;
				if (uni.$b.notNull(this.topValue)) {
					let isOverTop =  this.topValue >= top ;
					if (this.sticky == '' && isOverTop) {
						this.sticky = 'top' ;
						this.rect = rect ;
						return ;
					}
					if ( this.sticky == 'top' && !isOverTop ) {
						this.sticky = '' ;
						this.rect = rect ;
						return ;
					}
				}
				if (uni.$b.notNull(this.bottomValue)) {
					let isOverBottom = this.bottomValue <= bottom ;
					if (this.sticky == '' && isOverBottom) {
						this.sticky = 'bottom' ;
						this.rect = rect ;
						return ;
					}
					if ( this.sticky == 'bottom' && !isOverBottom ) {
						this.sticky = '' ;
					}
				}
			}
			
		}
	}
</script>
