<template>
	<view class="b-slider form-item">
		
		<b-label
			:title="title" 
			:title-width="titleWidth"
			:title-style="_titleStyle"
			:title-class="titleClass"
			:position="position"
			:align="align"
			:requiredMark="false" 
			:required="false"
			:errorContent="errorTip">
			
			
			<view class="father unselect" :style="areaStyle">
				
				<view class="abs" :class="trackClass" :style="trackStyle">
					<view v-if="_showStops" class="abs left whiteBg rds" :style="item" v-for="(item,index) in dots" :key="index"></view>
					<view class="abs left" :style="trackActiveStyle"></view>
				</view>
				
				<movable-area id="area" :style="areaStyle" :class="{'w100p' : !_vertical}" class="father z1 h30">
					<movable-view 
						:style="viewStyle" 
						:x="_vertical ? 0 : start"
						:y="_vertical ? start : 0"
						:disabled="_disabled" 
						:out-of-bounds="false" 
						:direction="direction"
						:animation="false"
						@change="_onChange($event,'start')">
						
						<b-popover
							:exclusive="false"
							:placement="placement"
							:ptb="0"
							:plr="0"
							:show-delay="0"
							:hide-delay="1000"
							:trigger="_showTooltip?'hover':'none'"
							:bg-color="toolTipColor" 
							:border-color="toolTipBorderColor"
							:offset="offset"
							in-class="fadeIn"
							out-class="fadeOut">

							<slot v-if="slots.startBlock" name="startBlock"></slot>
							<view v-else :style="viewStyle" class="rds whiteBg shadow bd"></view>
							
							<template slot="content">
								
								<slot v-if="slots.startToolTip" name="startToolTip" :value="_startValue"></slot>
								<view v-else class="plr10 ptb3 white noBreak">
									{{_startValue}}
								</view>
								
							</template>
							
							
						</b-popover>
						
						
					</movable-view>
					
					<movable-view
						v-if="_range"
						:style="viewStyle"
						:x="_vertical ? 0 : end"
						:y="_vertical ? end : 0"
						:disabled="_disabled" 
						:out-of-bounds="false" 
						:direction="direction"
						:animation="false"
						@change="_onChange($event,'end')">
						
						
						<b-popover
							:exclusive="false"
							:placement="placement"
							:ptb="0"
							:plr="0"
							:offset="offset"
							:show-delay="0"
							:hide-delay="1000"
							:trigger="_showTooltip?'hover':'none'"
							:bg-color="toolTipColor"
							:border-color="toolTipBorderColor"
							in-class="fadeIn"
							out-class="fadeOut">
							
							<slot v-if="slots.endBlock" name="endBlock"></slot>
							<view v-else :style="viewStyle" class="rds whiteBg shadow bd"></view>
							
							<template slot="content">
								
								<slot v-if="slots.endToolTip" name="endToolTip" :value="_endValue"></slot>
								<view v-else class="plr10 ptb3 white noBreak">
									{{_endValue}}
								</view>
								
							</template>
							
						</b-popover>
						
						
						
					</movable-view>
				</movable-area>
			</view>
			
			
			<slot></slot>
			
		</b-label>
		
	</view>
</template>

<script>
	import formMixins from "../../js_sdk/mixins/base-form-mixins.js" ;
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description Silder 滑块，支持区间数值滑动选择的表单组件，支持横向、竖向两种布局，可灵活自定义滑块样式，该组件暂不支持头条小程序。
	* @tutorial    https://base-view.cn/#/pages/doc/slider
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            startBlock          用于覆盖左侧滑块内容的插槽，可自定义滑块样式。
	* @slot                            endBlock            区间选择时，用于覆盖右侧滑块内容的插槽，可自定义滑块内容样式。
	* @slot     {Scoped}               startToolTip        显示信息面板时，该插槽用于自定义信息内容，可使用作用域变量value。
	* @slot     {Scoped}               endToolTip          区间选择时，该插槽用于自定义右侧信息面板内容，可使用作用域变量value。
	* @slot                            default             默认插槽，位于滑块下方。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              当值发生变化后触发 | 参数：( e )
	* @event    {Function}             changing            滑块数值实时变动时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number}        min                 最小值，默认0。
	* @property {String|Number}        max                 最大值，默认100。
	* @property {String|Number}        step                步长，默认1，必须大于0，且可被（max-min）整除。
	* @property {Boolean|String}       range               启用区间选择，启用后将滑动两个滑块来选择一个范围值，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       vertical            启用竖向布局，默认false，为true时必须设置height属性。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       show-tooltip        显示进度信息面板，默认true。可通过样式类属性设置信息面板样式。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       show-stops          显示间断点，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       disabled            禁用，默认false。
	*    @value                        true                
	*    @value                        false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number}        size                滑块大小，默认20。
	* @property {String|Number}        track-size          滑动轨道的大小，默认2。
	* @property {String}               background-color    轨道背景颜色，默认#EBEBEB。
	* @property {String}               active-color        选中轨道前景色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
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
	* @property {String}               tool-tip-color      信息面板背景颜色，默认#000。
	* @property {String}               tool-tip-border-color 信息面板边线颜色，默认#000。
	* @property {String|Number|Array}  height              【响应式属性】 高度，vertical为true时有效，默认200px。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               title               标题
	* @property {String|Number}        title-width         标题宽度，默认0，在b-form组件中默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* @property {String|Array}         position            【响应式属性】 标题位置，默认left，可通过配置文件配置components.label.position来修改默认值。
	*    @value                        left                左侧
	*    @value                        top                 顶部
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
	* @property {String|Number|Array}  value               表单值，启用区间选择时，接受数组字符串、数组、可使用spliter属性分为为数组的字符串等三类值；未启用区间选择时，接受一个数值。可使用v-model双向绑定已选值，回填表单数据时，推荐使用b-form组件自动回填表单数据。
	* @property {String}               value-type          提交表单值类型，指定后在提交表单之前会先转为对应类型，区间选择时默认array，单值选择时默认number。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。也可以传入页面内在methods中声明的函数名称。在支付宝小程序、头条小程序内无法直接传入函数，可传入页面内的函数名。注意：在该函数内，this对象将始终指向当前页面对象。
	*    @value                        string              字符串
	*    @value                        float               浮点数
	*    @value                        int                 整数
	*    @value                        array               数组
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-slider",
		mixins:[formMixins , mediaMixins],
		props:{
			backgroundColor:{
				type : String ,
				default : "#EBEBEB"
			},
			activeColor:{
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor")
				}
			},
			range:{
				type : [String , Boolean],
				default : true 
			},
			showTooltip:{
				type : [String , Boolean],
				default : true 
			},
			toolTipColor:{
				type:String,
				default:"#000"
			},
			toolTipBorderColor:{
				type:String,
				default:"#000"
			},
			spliter:{
				type:String,
				default:","
			},
			showStops:{
				type : [String , Boolean],
				default : false 
			},
			vertical:{
				type : [String , Boolean],
				default : false 
			},
			height:{
				type : [String , Number,Array],
				default(){
					return 200 ;
				} 
			},
			size:{
				type : [Number,String] ,
				default : 20
			},
			trackSize:{
				type : [Number,String] ,
				default : 2
			},
			step:{
				type : [String,Number] ,
				default : 1
			},
			min:{
				type : [String,Number] ,
				default : 0
			},
			max:{
				type : [String,Number] ,
				default : 100
			}
		},
		computed: {
			slots(){
				return uni.$b.getSlots.call( this , "startBlock","endBlock","startToolTip","endToolTip") ;
			},
			_vertical(){
				return uni.$b.isTrue(this.vertical);
			},
			_showStops(){
				return uni.$b.isTrue(this.showStops);
			},
			_range(){
				return uni.$b.isTrue(this.range);
			},
			_showTooltip(){
				return uni.$b.isTrue(this.showTooltip);
			},
			_height(){
				return this.uv(this.height);
			},
			placement(){
				if (this._vertical) {
					let min = 100 ;
					// #ifdef H5
					min += parseFloat(uni.getLeftWindowStyle().width) ;
					// #endif
					return this.rect.left < min ? "right" : "left" ;
				}
				return this.rect.top < 100 ? 'bottom' : 'top' ;
			},
			direction(){
				return this._vertical ? "vertical" : "horizontal" ;
			},
			offset(){
				return this.placement == "bottom" ? -5 : 0 ;
			},
			_min(){
				return Number(this.min);
			},
			_max(){
				return Number(this.max);
			},
			_step(){
				return Number(this.step);
			},
			total(){
				return this._max - this._min ;
			},
			currentRange(){
				return this._range ? Math.abs(this.endValue - this.startValue) : (this.startValue - this._min) ;
			},
			trackClass(){
				return this._vertical ? "topCenter h100p" : "leftCenter w100p" ;
			},
			trackStyle() {
				if (this._vertical) {
					return uni.$b.getStyle({
						"border-left" : `${this.trackSize}px solid ${this.backgroundColor}` ,
						"width" : `${this.trackSize}px`
					});
				}
				return uni.$b.getStyle({
					"border-top" : `${this.trackSize}px solid ${this.backgroundColor}`,
					"height" : `${this.trackSize}px`
				});
			},
			trackActiveStyle() {
				let translate = this._range ? Math.min(this.start , this.end) + this.size / 2 : 0 ;
				let length = this.currentRange / this.total * this.totalWidth ;
				if (this._vertical) {
					return uni.$b.getStyle({
						"border-left" : `${this.trackSize}px solid ${this.activeColor}` ,
						"left" : `-${this.trackSize}px` ,
						"height" : `${length}px` ,
						"width" : `${this.trackSize}px` ,
						"transform" : `translateY(${translate}px)`
					});
				}
			 	return uni.$b.getStyle({
					"border-top" : `${this.trackSize}px solid ${this.activeColor}`,
					"top" : `-${this.trackSize}px` ,
					"height" : `${this.trackSize}px`,
					"width" : `${length}px`,
					"transform" : `translateX(${translate}px)`
				});
			},
			dots(){
				let length = this.total / this._step ;
				let size = (this.totalWidth + this.size) / length ;
				return Array.from({length}).map( (_,index) => {
					return uni.$b.getStyle({
						"left" : this._vertical ? "" :  `${index * size}px` , 
						"top" : this._vertical ? `${index * size}px` : "" , 
						"height" : `${this.trackSize}px` ,
						"width" : `${this.trackSize}px`
					})
				});
			},
			
			viewStyle(){
				return uni.$b.getStyle({
					"width" : `${this.size}px` ,
					"height" : `${this.size}px` 
				});
			},
			areaStyle(){
				return uni.$b.getStyle({
					"height" : this._vertical ? `${this._height}` : `${this.size}px` ,
					"width" : this._vertical ? `${this.size}px` : ""
				});
			},
			totalWidth() {
				return this._vertical ? this.rect.height - this.size : this.rect.width - this.size ;
			},
			
			_startValue(){
				return this._setValueByStep(this.startValue) ; 
			},
			_endValue(){
				return this._setValueByStep(this.endValue) ; 
			},
			$finalValue(){
				return this._range ? [this._startValue , this._endValue].sort() : this._startValue ;
			}
		},
		data() {
			return {
				valueSync:[],
				start : 0 ,
				end : 100 ,
				rect : {} ,
				startValue : 0 ,
				endValue : 100
			}
		},
		watch: {
			value(newValue, oldValue) {
				this._asyncMove();
			},
			min:{
				handler(){
					this._asyncMove();
				},
				immediate : true 
			},
			max:{
				handler(){
					this._asyncMove();
				},
				immediate : true 
			},
			step:{
				handler(){
					this._asyncMove();
				},
				immediate : true 
			}
		},
		created () {
			this._queryRectOnce = uni.$b.once(this._queryRect , 100 , true );
			this._adjustMove = uni.$b.once(this._adjustMove , 200 );
			
			//响应窗口变化
			uni.onWindowResize(async ()=>{
				await this._queryRect();
				this._asyncMove();
			});
		},
		async mounted () {
			await this._queryRect();
			//初始化value
			this.valueSync = this._handleValueSet(this.value);
			this._asyncMove();
			
			setTimeout( this._queryRect , 200);
		},
		methods: {
			_asyncMove(){
				if (this._range) {
					let [startValue , endValue] = this.valueSync ;
					this._moveByValue(startValue);
					this._moveByEndValue(endValue);
					// if (this._startValue !== startValue || this._endValue !== endValue) {
					// 	this._emitChange();
					// }
				}else{
					this._moveByValue(this.valueSync);
					// if (this._startValue !== this.valueSync) {
					// 	this._emitChange();
					// }
				}
			},
			_setValueByStep(value){
				let remainder = value % this._step ;
				value -= remainder ;
				if(remainder >= this._step / 2 ) value += this._step ;
				return value ;
			},
			_handleValueSet(value){
				let array = uni.$b.parseArray(value , this.spliter) ;
				array.sort();
				if (this._range) {
					return array ;
				}
				return array.length > 0 ? array[0] : this._min ;
			},
			_moveByValue(v){
				let value = Number(v) ;
				if ( isNaN(value) ) {
					value = this._min ;
				}
				this.startValue = value ;
				this.start = (value - this._min) / this.total * this.totalWidth ;
			},
			_moveByEndValue(v){
				if (!this._range) {
					return ;
				}
				let value = Number(v) ;
				if ( isNaN(value) ) {
					value = this._max ;
				}
				this.endValue = value ;
				this.end = (value - this._min) / this.total * this.totalWidth ;
			},
			_onChange(e , name){
				this._queryRectOnce();
				let {source,x,y} = e.detail ;
				if ( source != 'touch') {
					return ;
				}
				let offset = this._vertical ? y : x ;
				this[name] = offset ;
				let value =  offset / this.totalWidth * this.total + this._min ;
				if (name == "start") {
					this.startValue = value ;
					this._adjustMove(value,"_moveByValue");
				}else{
					this.endValue = value ;
					this._adjustMove(value,"_moveByEndValue");
				}
				this.$emit("changing" , {detail:{value:this.$finalValue}}) ;
			},
			async _queryRect(){
				this.rect = await uni.$b.select("#area",this);
			},
			_adjustMove(value , fnName) {
				this.$nextTick(()=>{
					value = this._setValueByStep(value) ;
					this[fnName](value);
					this._emitChange();
				})
			},
			_emitChange(){
				let detail = { value : this.$finalValue };
				this.$changeValue({detail})
			}
		}
	}
</script>

<style>
.unselect{
	user-select: none;
}
</style>
