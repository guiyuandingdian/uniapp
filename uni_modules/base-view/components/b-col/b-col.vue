<template>
	<view class="b-col" v-if="visiableSync"  @tap="onTap" :style="colStyle" :class="classNameSync">
		<slot></slot>
	</view>
</template>

<script>
	/**
	* @description Col 响应式布局列，与`b-row`组件一起使用，可以在`手机`、`宽屏手机`、`ipad`、`窄屏PC`、`宽屏PC`等五种常见设备上，构建灵活多变的响应式布局，支持一行任意列布局方式，可以定义任意布局列大小噢。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/col
	* @version     1.0.0
	* 
	* @ ------------------------------------------
	* Slot 插槽
	* --------------------------------------------
	* @slot                                      default           默认插槽
	* 
	* @ ------------------------------------------
	* Events 事件
	* --------------------------------------------
	* @event    {Function}                       @click            点击时触发 ( event )
	* @property {String|Array}                   cname             【响应式属性】 样式类名
	* @property {String|Number|Array}            colspan           【响应式属性】 横跨的列数，默认占1列。
	* @property {String|Number|Array}            gutter            【响应式属性】 当前列的左右内边距，它会覆盖父级b-row组件统一设置的gutter值。
	* @property {String|Number|Array}            gutter-bottom     【响应式属性】 底部外边距，用于覆盖父级row组件统一设置的底部外边距。
	* @property {String|Number|Array}            height            【响应式属性】 高度
	* @property {Boolean|String|Number|Array}    visiable          【响应式属性】 可见性，1、true表示可见，0、false表示隐藏。
	* @property {String|Number|Array}            width             【响应式属性】 宽度。注意：b-row组件的cols属性用于定义一行均分为多少列，b-col的colspan属性用于定义子元素横跨多少列，当均分列或横跨份数均无法满足宽度需求时，可使用width属性为列定义任意宽度。
	*/
	export default {
		name:"b-col",
		// #ifdef MP-WEIXIN
		options: {
		   virtualHost: true
		},
		// #endif
		mixins:[uni.$b._mixins.family , uni.$b._mixins.media ] ,
		props:{
			// #ifdef MP-WEIXIN
			style:String,
			// #endif
			colspan:{
				type : [String , Number , Array],
				default(){
					return 1 ;
				}
			},
			width:[String , Number , Array],
			height:[String , Number , Array],
			cname:[Array,String] ,
			visiable:{
				type : [Array,Boolean,Number,String] ,
				default(){
					return 1 ;
				}
			},
			gutter : [Number,String,Array] ,
			gutterBottom : [Number,String,Array] 
		},
		
		created() {
			this.parent = this.getParent("b-row");
			if(!this.parent){
				throw new Error("b-col should use with b-row");
			}
		},
		
		computed:{
			
			colspanSync(){
				return parseFloat(this.getByDevice(this.colspan));
			},
			
			widthSync(){
				
				// #ifdef MP-TOUTIAO
				//头条的computed属性的计算时间早于created生命周期，注入一个响应式属性在created后重新计算computed属性
				if (this.baseComputedTime == 0) {
					return 0 ;
				}
				// #endif
				
				//自身定义宽度
				let width = this.getUnitValue(this.width);
				
				if (uni.$b.isNull(width)) {
					//自身定义的占比份数
					width = !this.parent ? '100%' : `${this.parent.childPercent * this.colspanSync}%` ;
				}
				
				// #ifdef MP-BAIDU || MP-TOUTIAO || MP-QQ  
				
				/* 这几家小程序会在根节点嵌套一层节点*/
				width = uni.$b.parsePx( width , this.parent ? this.parent.realWidth : null ) ;
				return `${width}px` ;
				
				// #endif
				
				return width ;
			},
			heightSync(){
				return this.getUnitValue(this.height);
			},
			classNameSync(){
				return this.getByDevice(this.cname) ;
			},
			visiableSync(){
				let visiable = this.getByDevice(this.visiable) ;
				return uni.$b.isNull(visiable) || uni.$b.isUnstrictTrue(visiable) ;
			},
			gutterSync(){
				return this.getUnitValue(this.extendProp("gutter" , "10rpx"));
			},
			gutterBottomSync(){
				return this.getUnitValue(this.extendProp("gutterBottom"));
			},
			colStyle(){
				let styles = uni.$b.getStyle({
					"width": this.widthSync ,
					"height": this.heightSync ,
					"padding-left": this.gutterSync ,
					"padding-right" : this.gutterSync ,
					"margin-bottom" : this.gutterBottomSync
				});
				
				// #ifdef MP-WEIXIN
				if (this.style) {
					styles += `;${this.style}` ;
				}
				// #endif
				
				return styles ;
			}
		},
		
		methods:{
			onTap(e){
				this.$emit("click" , e);
				this.parent = this.getParent("b-row");
			}
		}
	}
</script>