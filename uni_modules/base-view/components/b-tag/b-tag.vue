<template>
	<view class="b-tag father">
		
		<view class="father inline fz12">
			
			<!-- 背景色 -->
			<view v-if="type == 'light'" :style="bgStyle" :class="_tagClass" class="abs"></view>
			
			<!-- 文字 -->
			<view class="flex lt father z1" :class="_tagClass" :style="_tagStyle">
			
				<view v-if="!!prefixIcon" @tap="_onTap('tapPrefix', $event)" :class="prefixIcon"></view>
				
				<slot></slot>
			
				<view v-if="suffixIcon" @tap="_onTap('tapSuffix', $event)" :class="suffixIcon"></view>
			
			</view>
			
		</view>

	</view>
</template>

<script>
	/**
	* @description Tag 标签，可灵活指定样式的标签标记。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/tag
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             用于放置标签内容
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             tapPrefix           点击左侧图标时触发 | 参数：( e )
	* @event    {Function}             tapSuffix           点击右侧图标时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               bag-img             背景图或渐变背景色
	*    @value                        linear-gradient(to right , #676FFC, #676FFC) 渐变背景色，使用时需自行定义颜色、渐变方向
	*    @value                        url()               背景图，使用时需定义背景图片链接
	* @property {String}               color               标签主体颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
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
	* @property {String|Number}        color-index         对应colors属性指定的备选颜色列表中的下标，用于生成标签主体颜色，指定下标后color属性将失效，通常用于传入多种状态时使用。
	* @property {String|Array}         colors              备选颜色列表，使用randomColor、colorIndex属性时的备选颜色列表，默认有8种颜色，["#F74F0E","#07c160","#FFC300","#e1251b","#FC5E9B","#0081ff","#6739b6","#8B4512"]，可通过配置文件配置components.tag.colors来修改默认值。若传入字符串，则组件内部将尝试使用英文逗号分割为数组。
	* @property {String|Number}        opacity             背景色的透明度，type为light时有效。
	* @property {String}               prefix-icon         前置图标类名
	* @property {Boolean|String}       random-color        标签主体颜色从备选颜色中随机选取，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       show-border         是否显示边线，默认false，type为light时有效。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               suffix-icon         后置图标类名
	*    @value                        bIcon-multiply      关闭
	*    @value                        bIcon-close         关闭
	*    @value                        bIcon-closeFill     关闭
	* @property {String|Array}         tag-class           【响应式属性】 标签样式类名，默认fz12 rds3 ptb2 plr3，可通过配置文件配置components.tag.tagClass来修改默认值，注意：定义tag-class后将覆盖默认值。
	* @property {String}               tag-style           标签样式，同css样式。
	* @property {String}               text-color          与标签主体颜色匹配的文字颜色。
	*    @value                        #fff                白色
	*    @value                        #000                黑色
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
	* @property {String}               type                标签样式类型，默认solid。
	*    @value                        solid               实心
	*    @value                        plain               镂空
	*    @value                        light               半透明
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name: "b-tag",
		mixins: [uni.$b._mixins.media],
		props: {
			color: {
				type: String,
				default: uni.$b.getValue("components.mainColor")
			},
			textColor: String,
			bagImg: String,
			prefixIcon: String,
			suffixIcon: String,
			type: {
				type: String,
				default: "solid"
			},
			showBorder:{
				type : [String,Boolean],
				default : true
			},
			tagClass: String,
			tagStyle: String,
			colors:{
				type : [String , Array],
				default(){
					return uni.$b.getValue("components.tag.colors");
				}
			},
			opacity:{
				type : [String , Number],
				default : 0.2
			},
			randomColor:[String,Boolean],
			colorIndex : [String,Number]
		},
		computed: {
			
			ts(){
				return uni.$b.getTrues.call(this , "showBorder" , "randomColor" ) ;
			},
			
			inverse(){
				return uni.$b.getValue("components.mainInverse") ;
			},
			
			_showBorder(){
				return this.type == 'plain' || this.ts.showBorder ;
			},
			
			_colors(){
				return uni.$b.parseArray(this.colors , ",");
			},
			
			_color(){
				if(this.ts.randomColor){
					return this._getRandomColor() ;
				}
				if(uni.$b.notNull(this.colorIndex)){
					return this._getColorByIndex(Number(this.colorIndex)) ;
				}
				return this.color ;
			},
			
			_textColor() {
				if (!!this.textColor) {
					return this.textColor;
				}
				return {
					'solid' : this.inverse ,
					'plain' : this._color ,
					'light' : this._color 
				}[this.type] ;
			},
			
			bgStyle(){
				return uni.$b.getStyle({
					'background-color': this._color ,
					'background-image': this.bagImg ,
					'opacity' : this.opacity
				})
			},
			
			_tagStyle() {
				return uni.$b.getStyle({
					'line-height' : 1 ,
					'background-color': this.type == 'solid' ? this._color: '',
					'background-image': this.type == 'solid' ? this.bagImg : '' ,
					'color': this._textColor ,
					'border' : this._showBorder ? `1px solid ${this._color}` : ''
				} , this.tagStyle );
			},
			
			_tagClass() {
				let tagClass = uni.$b.isNull(this.tagClass) ? uni.$b.getValue("components.tag.tagClass") : this.tagClass ;
				if( uni.$b.notNull(tagClass) ){
					return this.dv(tagClass) ;
				}
				return this.type == 'plain' ? 'rds3 ptb2 plr3' : 'rds3 pd3' ;
			},
		},
		methods: {
			_onTap(eventName , e){
				this.$emit(eventName , e);
				this.$emit(eventName , e);
			},
			_getRandomColor(){
				let min = 0 ;
				let max = this._colors.length - 1 ;
				let index = Math.floor( Math.random() * (max - min + 1) + min);
				return this._getColorByIndex(index) ;
			},
			_getColorByIndex(index){
				let colors = this._colors ;
				if(index < 0 || index > colors.length - 1){
					return "#777" ;
				}
				return colors[index] ;
			}
		}
	}
</script>
