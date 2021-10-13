<template>
	<view class="b-title">
		<view class="flex plr ptb10">
			<view class="cover flex lt">
				<view v-if="showBar" class="bar" :class="dvs.barClass" :style="barStyle"></view>
				<view>
					<slot></slot>
				</view>
			</view>
			<view v-if="slots.more">
				<slot name="more"></slot>
			</view>
			<view v-else-if="showMore" class="flex rt hover8" :class="dvs.moreClass" @tap="open">
				{{_moreText}}
				<view class="pl10" :class="_icon"></view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	* @description Title 标题，一个超级简单的用于分区的标题组件，暂时只实现了一个修饰条的标题效果，如果有其他的想法，欢迎提需求。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/title
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，用于放置标题内容。
	* @slot                            more                用于替换右侧更多按钮的插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             tapMore             点击右侧更多按钮时触发 | 参数：--
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}         bar-class           左侧修饰条样式类名，默认pr。
	*    @value                        none                隐藏
	*    @value                        pr                  右边距15px，可调整与标题的距离。
	* @property {String}               bar-color           左侧修饰条颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #FF6D8A             粉色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String|Number|Array}  bar-height          【响应式属性】 左侧修饰条高度，默认15px。
	* @property {String|Number|Array}  bar-width           【响应式属性】 左侧修饰条宽度，默认4px。
	* @property {String}               icon                右侧图标，默认bIcon-arrowRight。
	*    @value                        none                不显示图标
	*    @value                        bIcon-refresh       刷新
	*    @value                        bIcon-arrowRight    右箭头
	* @property {String}               more-class          右侧更多的样式类名，默认gray fz12。
	*    @value                        gray fz12           灰色12px
	*    @value                        none                隐藏更多按钮
	* @property {String}               more-text           右侧更多文字，默认：更多。
	*    @value                        全部                  全部
	*    @value                        换一批                 刷新
	*    @value                        查看更多                更多
	* @property {String}               open-type           跳转链接打开方式，默认navigateTo。
	*    @value                        navigateTo          保留当前页，打开新页面。
	*    @value                        redirectTo          关闭当前页面，打开新页面。
	*    @value                        reLaunch            关闭全部页面，打开新页面。
	*    @value                        switchTab           跳转到tabbar页面
	*    @value                        navigateBack        关闭当前页面，返回上一页，此时href属性表示无法返回上一页时，跳转的页面。
	*    @value                        _blank              打开新标签页，仅H5支持。
	* @property {String}               url                 点击右侧更多按钮跳转页面的链接，支持站内、站外链接。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-title",
		mixins:[uni.$b._mixins.media],
		props:{
			showBar : {
				type : Boolean ,
				default :true 
			},
			showMore : {
				type : Boolean ,
				default :true 
			},
			type : {
				type : String ,
				default(){
					return uni.$b.getValue("components.title.type")
				}
			},
			barHeight:{
				type : [String , Number , Array],
				default : 15
			},
			barWidth:{
				type : [String , Number , Array],
				default : 4
			},
			barColor : {
				type : String ,
				default : uni.$b.getValue("components.mainColor")
			}, 
			barClass : {
				type : [String,Array],
				default(){
					return "mr10 rds10" ;
				}
			} ,
			moreText : String ,
			moreClass : {
				type : String ,
				default : "gray fz12"
			},
			icon : {
				type : String ,
				default : "bIcon-arrowRight"
			},
			url : String ,
			openType : String ,
			params : {
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
		data() {
			return {
				
			}
		},
		computed:{
			slots(){
				return uni.$b.getSlots.call(this,"more");
			},
			dvs(){
				return this.getDvs("barClass","titleClass","moreClass");
			},
			barStyle(){
				return uni.$b.getStyle({
					"width" : this.pv(this.barWidth),
					"height" : this.pv(this.barHeight),
					"background-color" : this.barColor
				})
			},
			_moreText(){
				return this.moreText || uni.$b.localeB("title.more") ;
			},
			_icon(){
				return uni.$b.isNull(this.icon) || uni.$b.isFalse(this.icon) ? 'none' : this.icon ;
			}
		},
		methods: {
			open(){
				this.$emit("tapMore");
				uni.$b.open({
					url : this.url ,
					params : this.params ,
					openType : this.openType 
				})
			}
		}
	}
</script>
