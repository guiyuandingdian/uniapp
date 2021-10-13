<template>
	<view>
		<block v-if="type == 'circle'">
			<view class="b-loading animate circle rds"  :style="myStyle"></view>
		</block>
		<block v-else>
			<view class="b-loadings animate circle rds" :style="flowerStyle"></view>
		</block>
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description Loading 加载状态，可自定义颜色、旋转速度、大小的加载状态组件。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/loading
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Array}          border-width 【响应式属性】 边线的宽度，默认1
	* @property {String}                       color       颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                                #e1251b     红色
	*    @value                                #e1251b     黄色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String|Number}                duration    转一圈的时长，单位ms，默认800，时长越大速度越慢。
	* @property {String|Number|Array}          size        【响应式属性】 大小，默认12
	* @property {String}                       track-color 轨道颜色，默认#e9ecef
	* @property {String}                       type        类型，默认circle。
	*    @value                                circle      圆圈
	*    @value                                flower      菊花
	* 
	* @property {String}                       ref          获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name: "b-loading",
		mixins: [mediaMixins],
		props: {
			type : {
				type : String ,
				default : "circle"
			},
			size: {
				type: [String, Number, Array],
				default () {
					return 12;
				}
			},
			borderWidth: {
				type: [String, Number, Array],
				default () {
					return 1;
				}
			},
			duration: {
				type: [String, Number],
				default: 600
			},
			trackColor: {
				type: String,
				default: "#e9ecef"
			},
			color: {
				type: String,
				default(){
					return uni.$b.getValue("components.mainColor");
				}
			}
		},
		computed: {
			_size() {
				return this.pv(this.size) || "15px";
			},
			_borderWidth() {
				return this.pv(this.borderWidth) || "2px" ;
			},
			flowerStyle(){
				return uni.$b.getStyle({
					"width": this._size,
					"height": this._size ,
					"animation-duration": `${this.duration}ms`
				});
			},
			myStyle() {
				return uni.$b.getStyle({
					"border-top": `${this._borderWidth} solid ${this.trackColor}`,
					"border-right": `${this._borderWidth} solid ${this.trackColor}`,
					"border-bottom": `${this._borderWidth} solid ${this.trackColor}`,
					"border-left": `${this._borderWidth} solid ${this.color}`
				} , this.flowerStyle );
			}
		}
	}
</script>

<style lang="scss">
	.b-loadings{
		background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=);
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}
	.animate {
		animation-iteration-count: infinite;
	}
</style>