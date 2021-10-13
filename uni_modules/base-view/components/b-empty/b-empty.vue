<template>
	<view class="b-empty flex ct" :style="myStyle">
		
		
		<view class="text-center pt20">
			
			<!-- 图标插槽 -->
			<slot v-if="hasIconSlot" name="icon"></slot>
			
			
			
			<!-- 图标 -->
			<view v-else :class="icon" class="_icon fz40"></view>
			
			
			
			<!-- 提示信息 -->
			<view class="_tips ptb20">
				{{_tips}}
			</view>
			
			
			
			<!-- 默认插槽 -->
			<slot></slot>
			
			
		</view>
	</view>
</template>

<script>
	import media from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description Empty 无数据，列表、分页列表无数据时展示，可根据场景定义无数据图标、图片、提示文字。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/empty
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，位于提示文字下方，通常用于插入一个按钮。
	* @slot                            icon                替代图标的插槽，通常用于插入自定义图片。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              显示状态发生变化时触发 | 参数：( isShow )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          show()              显示组件 --
	* @method                          hide()              隐藏组件 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               color               图标、文字颜色，默认#a0adb4。
	* @property {String}               icon                图标类名，支持自定义图标类名，默认bIcon-noData。
	*    @value                        bIcon-noData        暂无数据
	*    @value                        bIcon-cart          空购物车
	*    @value                        bIcon-postCar       物流信息
	*    @value                        bIcon-order         订单
	*    @value                        bIcon-msg           信息
	*    @value                        bIcon-collect       收藏
	*    @value                        bIcon-shop          店铺
	*    @value                        bIcon-pic           图片
	*    @value                        bIcon-locationPoint 地址、位置
	*    @value                        bIcon-search        搜索
	*    @value                        bIcon-comment       评论
	*    @value                        bIcon-videoRecorder 视频
	* @property {Boolean|String|Array} is-show             是否显示，默认false。若传入空数组时，则视为true。
	* @property {String|Number|Array}  ptb                 【响应式属性】 上下内边距，默认200。
	* @property {String}               tips                提示信息，默认：抱歉，暂无数据~
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name: "b-empty",
		mixins:[media],
		props: {
			tips: String ,
			color:{
				type : String ,
				default : "#a0adb4"
			},
			icon:{
				type : String ,
				default : "bIcon-noData"
			},
			ptb:{
				type : [String,Number,Array],
				default(){
					return 200
				}
			},
			isShow:{
				type : [String,Boolean,Array],
				default : true
			}
		},
		data(){
			return {
				isShowSync : false 
			}
		},
		computed:{
			hasIconSlot(){
				return uni.$b.hasSlots.call(this,"icon");
			},
			
			_ptb(){
				return this.uv(this.ptb) ;
			},
			_tips(){
				return this.tips ? this.tips : uni.$b.localeB("empty.tips") ;
			},
			myStyle(){
				return uni.$b.getStyle({
					'padding-top' : this._ptb ,
					'padding-bottom' : this._ptb ,
					'color' : this.color ,
					'display' : this.isShowSync ? '' : 'none'
				})
			}
		},
		watch:{
			isShow:{
				handler(isShow){
					isShow = uni.$b.isTrue(isShow) ;
					/* APP-PLUS 同步会渲染失败 */
					this.$nextTick(()=>{
						this.isShowSync = isShow ;
					});
				},
				immediate : true 
			}
		},
		methods:{
			show(){
				this.isShowSync = true ;
				this.$emit("change" , true);
			},
			hide(){
				this.isShowSync = false ;
				this.$emit("change" , false);
			}
		}
	}
</script>