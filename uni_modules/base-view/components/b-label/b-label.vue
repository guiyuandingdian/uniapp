<template>
	<view class="b-label form-item">
		
		<view :class="boxClass">
			
			<view class="flex" :class="_titleClass" :style="labelStyle" v-if="_width > 0">
				<block v-if="slots.title">
					<slot name="title"></slot>
				</block>
				
				
				<text v-else class="father" :class="{'pl8' : isLeft}">
					
					{{title?title:''}}
					
					<!-- 必填标记 -->
					<text class="red normal" :class="isLeft ? 'abs left' : 'plr2'" v-if="_requiredMark">*</text>
					
				</text>
				
				
				<view class="cover normal" v-if="slots.titleRight && !isLeft">
					<slot name="titleRight"></slot>
				</view>
				
			</view>
			
			<view class="cover break father" :class="contentClass">
				
				<slot></slot>
				
				<!-- 错误提示 -->
				<b-animate v-if="!!errorContent" in-class="slideDown">
					<view class="red abs top fz12" style="top: calc(100% + 1px);">
						{{errorContent}}
					</view>
				</b-animate>
				
			</view>
			
		</view>
	</view>
</template>

<script>
	import labelProps from "./label-props.js" ;
	/**
	* @description Label 表单标签，用于定义表单标题，或对齐其他表单的响应式布局容器。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/label
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                                    default               默认插槽，放置表单主体内容。
	* @slot                                    title                 标题插槽，当默认title属性不满足使用场景需求时，可使用title插槽覆盖默认标题区域内容。
	* @slot                                    titleRight            position为top时，位于标题文字右侧的位置。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       align                 标题对齐方式，默认left。position属性为left时有效。
	*    @value                                left                  左对齐
	*    @value                                center                居中对齐
	*    @value                                right                 右对齐
	* @property {String|Array}                 position              【响应式属性】 标题位置，默认left，可通过配置文件配置components.label.position来修改默认值。
	*    @value                                left                  左侧
	*    @value                                top                   顶部
	* @property {Boolean|String}               required              必填项，默认true，通常可以使用b-form组件的required属性来统一调控默认是否必填。
	* @property {Boolean|String}               required-mark         显示必填标识，默认true，通常通过b-form的required-mark属性统一调控。required为true时，配置required-mark方有效。
	* @property {String}                       title                 标题
	* @property {String|Array}                 title-class           【响应式属性】 标题的样式类名，默认"bold"，可通过配置文件配置components.label.titleClass来修改默认值。
	* @property {String}                       title-style           标题样式，同css的style。
	* @property {Number}                       title-width           标题的宽度，单位px，默认65，通过修改配置文件配置components.label.titleWidth来修改默认值。
	* 
	* @property {String}                       ref                    获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name : "b-label" ,
		mixins:[ labelProps , uni.$b._mixins.media , uni.$b._mixins.family ],
		computed:{
			
			slots(){
				return uni.$b.getSlots.call(this,"title","titleRight");
			},
			
			_width(){
				if(uni.$b.isNull(this.titleWidth) && !this.parent ){
					return 0 ;
				}
				let width = this.extendProp("titleWidth" , 65 , "components.label.titleWidth") ;
				return Number( width ) ;
			},
			
			_scale(){
				return Number(this.extendProp("scale" , 1 )) ;
			},
			
			_position(){
				return this.dv(this.extendProp("position" , 'left' , "components.label.position")) ;
			},
			
			isLeft(){
				return this._position == 'left' ;
			},
			
			_titleClass(){
				let titleClass = this.extendProp("titleClass" , "gray"  , "components.label.titleClass" );
				return uni.$b.getClassName({
					"rt" : this._align == "right" ,
					"lt" : this._align == "left" ,
					"ct" : this._align == "center"
				},titleClass);
			},
			
			_align(){
				return this.extendProp("align" , "left"  , "components.label.align") ;
			},
			
			_required(){
				return uni.$b.isTrue(this.extendProp("required" , false )) ;
			},
			
			_requiredMark(){
				let requiredMark = this.extendProp("requiredMark" , true , 'components.requiredMark') ;
				return uni.$b.isTrue(requiredMark) && this._required ;
			},
			
			_titleStyle(){
				return uni.$b.getStyle({
					'height' : `${this._scale * 80}rpx` 
				} , this.titleStyle ) ;
			},
			
			labelStyle(){
				if (this.isLeft) {
					return uni.$b.getStyle({
						"width" : `${this._width}px`
					},this._titleStyle);
				}
				return uni.$b.getStyle({
					"min-height" : `${this._scale * 80}rpx`
				},this._titleStyle);
			},
			
			contentClass(){
				return uni.$b.getClassName({
					'pl10' : this._width > 0 && this.isLeft 
				})
			},
			
			boxClass(){
				return uni.$b.getClassName({
					'flex t cv' : this.isLeft
				})
			}
		},
		
		created() {
			this.parent = this.getParent(/^b-.*?form$/);
		}
	}
</script>