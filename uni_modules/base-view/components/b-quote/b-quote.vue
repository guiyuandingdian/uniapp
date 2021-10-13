<template>
	<view class="b-quote father">
		
		<!-- 背景色 -->
		<view class="abs" :style="bgStyle"></view>
		
		<!-- 内容 -->
		<view class="father z1 pd" :style="style">
			<view class="pb10 bold fz14" v-if="title">{{title}}</view>
			<slot></slot>
		</view>
		
	</view>
</template>

<script>
	/**
	* @description Quote 引用段落，通常用于醒目的提示语、引用段落文字等场景。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/quote
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               bg-color            背景色，默认是color的0.1透明色。
	* @property {String|Number|Array}  border-width        【响应式属性】 左侧边线宽度，默认5
	* @property {String}               color               颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String|Number|Array}  radius              圆角大小，默认4。
	* @property {String}               title               标题
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-quote",
		mixins:[uni.$b._mixins.media],
		props:{
			color : {
				type : String ,
				default : uni.$b.getValue("components.mainColor")
			},
			bgColor: String ,
			borderWidth:{
				type : [Number,String,Array] ,
				default(){
					return 5 ;
				}
			},
			radius:{
				type : [Number,String,Array] ,
				default(){
					return 4 ;
				}
			},
			title : String 
		},
		computed:{
			
			radiusSync(){
				return this.getUnitValue(this.radius) ;
			},
			
			style(){
				return uni.$b.getStyle({
					'color' : this.color ,
					'border-radius' : this.radiusSync ,
					'border-left' : `${this.getUnitValue(this.borderWidth)} solid ${this.color}`
				});
			},
			
			bgStyle(){
				return uni.$b.getStyle({
					'background-color' : this.bgColor || this.color ,
					'opacity' : this.bgColor ? '' : '0.1' ,
					'border-radius' : this.radiusSync 
				})
			}
		}
	}
</script>
