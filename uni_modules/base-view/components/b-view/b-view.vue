<template>
	<view class="b-view" v-if="visiableSync" @tap="onTap" :style="styleSync" :class="classNameSync">
		<slot></slot>
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description View 响应式视图容器，针对手机、宽屏手机、ipad、窄屏PC、宽屏PC等五种常见设备进行响应式布局，`b-view`组件的所有属性均为响应式属性，支持在不同的设备上配置不同的属性值。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/view
	* @version     1.0.2
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                                    default        默认插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                     click          点击事件 | 参数：( event )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}                 cname          【响应式属性】 样式类名
	* @property {String|Number|Array}          height         【响应式属性】 高度
	* @property {String|Number|Array}          max-height     【响应式属性】 最大高度
	* @property {String|Number|Array}          max-width      【响应式属性】 最大宽度
	* @property {String|Number|Array}          min-height     【响应式属性】 最小高度
	* @property {String|Number|Array}          min-width      【响应式属性】 最小宽度
	* @property {Boolean|String|Number|Array}  visiable       【响应式属性】 可见性，1、true表示可见，0、false表示隐藏。
	* @property {String|Number|Array}          width          【响应式属性】 宽度
	* 
	* @property {String}                       ref             获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-view" ,
		mixins:[mediaMixins],
		props:{
			// #ifdef MP-ALIPAY
			style:String ,
			// #endif
			minWidth:[String , Number , Array],
			maxWidth:[String , Number , Array],
			width:[String , Number , Array],
			height:[String , Number , Array],
			minHeight:[String , Number , Array],
			maxHeight:[String , Number , Array],
			cname:[Array,String] ,
			visiable: {
				type : [Array,Boolean,Number,String] ,
				default(){
					return 1 ;
				}
			}
		},
		computed:{
			widthSync(){
				return this.getUnitValue(this.width);
			},
			minWidthSync(){
				return this.getUnitValue(this.minWidth);
			},
			maxWidthSync(){
				return this.getUnitValue(this.maxWidth);
			},
			minHeightSync(){
				return this.getUnitValue(this.minHeight);
			},
			maxHeightSync(){
				return this.getUnitValue(this.maxHeight);
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
			styleSync(){
				return uni.$b.getStyle({
					'width' : this.widthSync ,
					'height' : this.heightSync ,
					'min-width' : this.minWidthSync ,
					'max-width' : this.maxWidthSync ,
					'min-height' : this.minHeightSync ,
					'max-height' : this.maxHeightSync
				} , this.style ) ;
			}
		},
		methods:{
			onTap(e){
				this.$emit("click" , e) ;
			}
		}
	}
</script>