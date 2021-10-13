<template>
	<view class="b-container" :style="boxStyle">
		<slot></slot>
	</view>
</template>

<script>
	/**
	* @description Container 安全区域布局容器，用于在不同设备安全区域内布局的响应式容器。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/container
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @slot                                 default        默认插槽
	* 
	* @property {String|Number|Array}       gutter         【响应式属性】 左右两侧内边距，默认["30rpx","30rpx","0"]，可通过配置文件配置components.container.gutter来修改默认配置。
	* @property {String|Array}              placement      【响应式属性】 容器的位置，默认center。
	*    @value                             left           居左
	*    @value                             center         居中
	*    @value                             right          居右
	* @property {String|Number|Array}       width          【响应式属性】 宽度，默认["100%","440px","720px","960px","1140px"]，可通过配置文件配置components.container.width来修改默认配置。
	* 
	* @property {String}                    ref             获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-container" ,
		mixins:[uni.$b._mixins.media],
		props:{
			width:{
				type : [String , Number , Array],
				default(){
					return uni.$b.getValue("components.container.width") ;
				}
			},
			
			gutter:{
				type : [String , Number , Array],
				default(){
					return uni.$b.getValue("components.container.gutter") ;
				}
			},
			placement:{
				type : [String,Array],
				default(){
					return "center" ;
				}
			}
		},
		computed:{
			_width(){
				return this.uv(this.width);
			},
			_gutter(){
				return this.uv(this.gutter);
			},
			_placement(){
				return this.dv(this.placement) ;
			},
			boxStyle(){
				return uni.$b.getStyle({
					'width': this._width,
					'padding-left': this._gutter,
					'padding-right': this._gutter ,
					'margin' : `0 ${this._placement == 'right' ? 0 : 'auto'} 0 ${this._placement == 'left' ? 0 : 'auto'}`
				})
			}
		}
	}
</script>
<style>
	.b-container{
		max-width: 100%;
	}
</style>