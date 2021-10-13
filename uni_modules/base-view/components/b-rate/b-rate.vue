<template>
	<view class="b-rate form-item">
		<b-label
			:title="title" 
			:title-width="titleWidth"
			:title-style="_titleStyle"
			:title-class="titleClass"
			position="left"
			:align="align"
			:requiredMark="false" 
			:required="true"
			:errorContent="errorTip">
			

			<view class="flex lh1 h100p" :class="boxClass">
				<view class="father" id="formItem">
					
					<!-- 视图层 -->
					<view class="noBreak">
						<text :class="_unselectIcon" :style="item.style" v-for="( item , index) in list" :key="index"></text>
					</view>
					
					<view class="abs left noBreak hidden" :style="selectStyle">
						<text :class="_icon" :style="item.activeStyle" v-for="( item , index) in list" :key="index"></text>
					</view>
					
					<!-- 点击层 -->
					<view class="abs left noBreak op0" :class="{pointer : !_disabled }">
						<text class="_rate"
							@tap="_select($event,item)"
							@touchstart="_queryRect"
							@touchmove="_toSelect($event,item)"
							@mouseover="_onOver($event,item)" :class="_icon" :style="item.style" v-for="( item , index) in list" :key="index"></text>
					</view>
					
				</view>
				
				<slot v-if="slots.tip" name="tip" :value="$finalValue" :tip="_tips"></slot>
				<view v-else-if="!!_tips" :class="_tipClass">
					{{_tips}}
				</view>
				
			</view>
			
			<slot></slot>
			
		</b-label>
	</view>
</template>

<script>
	import formMixins from "../../js_sdk/mixins/base-form-mixins.js" ;
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js";
	/**
	* @description Rate 评分，支持滑动选择的评分组件，可将带小数分数显示为残缺星，最大分数、评分图标可自定义。另外，它可根据评分展现不同的评语、评分图标。
	* @tutorial    https://base-view.cn/#/pages/doc/rate
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，位于下方。
	* @slot     {Scoped}               tip                 提示语插槽，用于覆盖默认提示语，可使用作用域变量。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              当评分变化时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number}        max                 最大分数，应为整数，默认5。
	*    @value                        5                   5分制
	*    @value                        10                  10分制
	* @property {String|Number}        value               当前分数，表单值。
	* @property {String|Number}        v-model             双向绑定表单值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
	* @property {String|Number}        default-value       value值为空时的默认值。
	* @property {Boolean|String}       disabled            禁止修改评分。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               color               未选中图标的颜色，默认#e6e6e6
	*    @value                        #e1251b             红色
	*    @value                        #FFC300             黄色
	*    @value                        #FC5E9B             粉色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String}               active-color        选中评分图标颜色，默认#f6bd16。
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
	* @property {String|Number|Array}  margin              【响应式属性】 评分图标间距，默认5。
	* @property {String|Number|Array}  size                【响应式属性】 评分图标大小，默认16。
	* @property {String|Array}         icon                选中图标样式类名，为数组时表示对应评分展现的图标类名，默认bIcon-starFill。
	*    @value                        bIcon-star          星星
	*    @value                        bIcon-starFill      实心星星
	* @property {String|Array}         unselect-icon       未选中图标样式类名，为数组时表示对应评分展现的图标类名，默认bIcon-starFill。特别注意，当未选中图标与选中图标设置为不同图标时，应保证两个图标是一样的尺寸大小，否则将造成无法对齐的问题。
	*    @value                        bIcon-starFill      实心星星
	*    @value                        bIcon-star          空心星星
	* @property {String|Array}         tips                评分对应的提示信息，为数组时表示每个评分对应的提示信息。
	* @property {String|Array}         tip-class           【响应式属性】 提示信息样式类名，默认ml5。
	* @property {Boolean|String}       touchable           启用滑动选择，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         position            【响应式属性】 评分的对齐方式，默认：“right,left”。
	*    @value                        left                左侧对齐
	*    @value                        center              居中对齐
	*    @value                        right               右对齐
	* @property {String|Number}        scale               一颗星星代表的分数，默认1。比如需要使用五星来展现十分制时，可以将该属性设置为2，即一颗星星代表2分。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               title               表单标题
	* @property {String|Number}        title-width         标题宽度，默认0，在b-form组件中默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* @property {String}               align               标题对齐方式，默认left。
	*    @value                        left                左对齐
	*    @value                        center              居中对齐
	*    @value                        right               右对齐
	* @property {String|Array}         title-class         【响应式属性】 标题的样式类名，默认"bold"，可通过配置文件配置components.label.titleClass来修改默认值。
	* @property {String}               title-style         标题样式，同css的style。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               name                表单的key，缺省时将不参与表单校验与提交。
	* @property {String}               set-name            使用b-form组件回填表单时的键名，默认与name一致。
	* @property {String}               value-type          提交表单值类型，指定后在提交表单之前会先转为对应类型，默认float。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。若传入字符串不是默认的类型字符，则可以是页面内在methods中声明的函数名称。在支付宝小程序、头条小程序内无法直接传入函数，可传入页面内的函数名。注意：在该函数内，this对象将始终指向当前页面对象。
	*    @value                        float               带小数点的浮点数
	*    @value                        int                 整数
	*    @value                        string              字符串
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name : "b-rate" ,
		mixins:[formMixins,mediaMixins],
		props: {
			touchable:{
				type: [Boolean,String],
				default: true
			},
			defaultValue: {
				type: [Number,String],
				default: 5
			},
			max: {
				type: [Number,String],
				default : 5 ,
				validator(v){
					return parseInt(v) > 0 ;
				}
			},
			scale: {
				type: [Number,String],
				default : 1
			},
			icon:{
				type : [String,Array] ,
				default : "bIcon-starFill"
			},
			unselectIcon:{
				type : [String,Array] ,
				default : "bIcon-starFill"
			},
			color:{
				type : String ,
				default : "#e6e6e6"
			},
			activeColor:{
				type : String ,
				default : "#f6bd16"
			},
			margin:{
				type : [Number,String,Array] ,
				default : 5
			},
			size:{
				type : [Number,String,Array] ,
				default : 16
			},
			tips:{
				type : [String,Array] ,
				default(){
					return []
				}
			},
			tipClass:{
				type : [String,Array] ,
				default : "ml5"
			},
			position:{
				type : [String,Array] ,
				default(){
					return "left";
				}
			},
			valueType : {
				type : [String , Function ],
				default : "float"
			}
		},
		computed: {
			slots(){
				return uni.$b.getSlots.call(this,"tip");
			},
			_touchable(){
				return uni.$b.isTrue(this.touchable);
			},
			_scale(){
				return Number(this.scale) ;
			},
			_max(){
				return Number(this.max);
			},
			_margin(){
				return this.uv(this.margin);
			},
			_size(){
				return this.uv(this.size);
			},
			_tipClass(){
				return this.dv(this.tipClass);
			},
			_position(){
				return this.dv(this.position);
			},
			_icon(){
				return this._getValueByRate(this.icon , "bIcon-starFill") ;
			},
			_unselectIcon(){
				return this._getValueByRate(this.unselectIcon , "bIcon-starFill") ;
			},
			_tips(){
				return this._getValueByRate(this.tips , "") ;
			},
			boxClass(){
				return uni.$b.getClassName({
					"lt" : this._position == "left" ,
					"ct" : this._position == "center" ,
					"rt" : this._position == "right"
				})
			},
			$finalValue(){
				let value = uni.$b.isNull(this.valueSync) ? Number(this.defaultValue) : Number(this.valueSync) ;
				return value < 1 ? 1 : value ;
			},
			width(){
				let percent = this.$finalValue / (this._max * this._scale) * 100 ;
				if (percent < 0) percent = 0 ;
				if (percent > 100) percent = 100 ;
				return `${percent}%` ;
			},
			selectStyle(){
				return uni.$b.getStyle({
					"width" : `${this.width}`
				});
			},
			list() {
				let list = Array.from({length: this._max }, (_, i) => i + 1 )
				return list.map( item => {
					let style = uni.$b.getStyle({
						"margin-left" : item > 1 ? this._margin : "" ,
						"font-size" : this._size
					});
					return {
						value : item ,
						style : uni.$b.getStyle({
							"color" : this.color
						} , style ) ,
						activeStyle : uni.$b.getStyle({
							"color" : this.activeColor
						}, style )
					}
				})
			}
		},
		data() {
			return {
				rateRects : []
			}
		},

		mounted () {
			this._queryRect();
		},
		
		methods: {
			_getValueByRate(prop , defaultValue) {
				prop = uni.$b.isString(prop) ? prop.replace(new RegExp("，","g"),",") : prop ;
				let list = uni.$b.parseArray(prop) ;
				if (list.length == 0) {
					return defaultValue ;
				}
				let lastIndex = list.length - 1 ;
				let index = Math.ceil(this.$finalValue - 1);
				index = index > lastIndex ? lastIndex : index ;
				return list[index] || defaultValue ;
			},
			_select(e , {value}) {
				if (this._disabled) {
					return ;
				}
				e.detail.value = value * this._scale ;
				this.$changeValue(e);
			},
			_onOver(e , item) {
				if (!this._touchable) {
					return ;
				}
				this._select(e , item);
			},
			_toSelect(e) {
				if (e.changedTouches.length == 0 || !this._touchable) {
					return ;
				}
				let {clientX} = e.changedTouches[0] ;
				let value = this.rateRects.findIndex(item => clientX < item.left ) ;
				if (value <= 0) {
					value = clientX > this.rateRects[0].left ? this._max : 1 ;
				}
				this._select(e , {value});
			},
			async _queryRect(){
				if (!this._touchable) {
					return ;
				}
				this.rateRects = await uni.$b.selectAll("._rate",this);
			}
		}
	}
</script>
