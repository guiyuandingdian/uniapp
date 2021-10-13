<template>
	<view class="b-input-number form-item">
		<b-label
			:title="title"
			:title-width="titleWidth"
			:title-class="titleClass"
			:title-style="titleStyle"
			:position="position"
			:align="align"
			:requiredMark="_requiredMark"
			:required="_required"
			:errorContent="errorTip">
			<view class="flex" :class="boxClass" id="formItem">
				<view
					:class="subtractClass"
					@touchstart.stop.prevent="_startChange('subtract')"
					@mousedown.stop.prevent="_startChange('subtract')"
					@mouseup.stop.prevent="_stopChange"
					@touchend.stop.prevent="_stopChange">
					<slot v-if="slots.subtract" name="subtract"></slot>
					<view v-else class="bIcon-subtract grayBg rdsL4 ptb7 plr10 br"></view>
				</view>

				<view class="cover">
					<input
						:class="inputClass"
						:type="type"
						:name="name"
						:value="$finalValue"
						:disabled="_disabled"
						:focus="focusSync"
						:placeholder="_placeholder"
						:placeholder-style="placeholderStyle"
						:placeholder-class="placeholderClass"
						:cursor-spacing="cursorSpacing"
						:showConfirmBar="false"
						@input="_onInput"
						@focus="_onFocus"
						@blur="_onBlur"/>
				</view>

				<view
					:class="addClass"
					@touchstart.stop.prevent="_startChange('add')"
					@mousedown.stop.prevent="_startChange('add')"
					@mouseup.stop.prevent="_stopChange"
					@touchend.stop.prevent="_stopChange">
					<slot v-if="slots.add" name="add"></slot>
					<view v-else class="bIcon-add grayBg rdsR4 ptb7 plr10 bl"></view>
				</view>
			</view>

			<slot></slot>
			
		</b-label>
	</view>
</template>

<script>
import formMixins from "../../js_sdk/mixins/base-form-mixins.js";
/**
* @description Number 步进器，控制数字输入的表单组件，可严格控制数字变动的步长，长按可持续改变数字，允许设置数字最大、最小值范围。
* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/number
* @version     1.0.0
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @slot                            subtract            用于替代减号按钮的插槽，用于自定义按钮样式。
* @slot                            add                 用于替代加号按钮的插槽，用于自定义按钮样式。
* @slot                            default             默认插槽，位于步进器下方。
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @event    {Function}             change              数字改变时触发 | 参数：( e )
* @event    {Function}             blur                输入框失去焦点时触发 | 参数：( e )
* @event    {Function}             focus               输入框聚焦时触发 | 参数：( e )
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @method                          add()               按步长增加值 --
* @method                          subtract()          按步长减少值 --
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @property {String}               type                表单类型，默认number。
*    @value                        number              数字
*    @value                        digit               带小数的数字，h5不支持
* @property {String|Number}        min                 最小值，默认不限制。
* @property {String|Number}        max                 最大值，默认不限制。
* @property {String|Number}        step                步长，默认1。
* @property {Boolean|String}       strictly            只允许输入步长的整数倍的数字，默认true。
*    @value                        true                
*    @value                        false               
* @property {String|Number}        fixed               保留小数的位数，默认不限制。
* @property {Boolean|String}       disabled            禁止用户输入，此时只能通过步进器来增减数字，默认false。
*    @value                        true                
*    @value                        false               
* @property {Boolean|String}       long-press          开启长按持续改变数字，默认true。
*    @value                        true                
*    @value                        false               
* @property {Boolean|String}       interval            持续改变数字的时间间隔，单位ms，默认200。
*    @value                        true                
*    @value                        false               
* @property {String}               box-class           步进器样式类名，默认"rds4 bd"，传值后将覆盖默认值。
* @property {String}               input-class         输入框样式类名，默认“text-center block”，传值后将覆盖默认值。
* @property {String|Number}        cursor-spacing      指定光标与键盘的距离，默认100px 。
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @property {String}               title               标题
* @property {String|Number}        title-width         标题宽度，默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
* @property {String}               align               标题对齐方式，默认left。
*    @value                        left                左对齐
*    @value                        center              居中对齐
*    @value                        right               右对齐
* @property {String|Array}         position            【响应式属性】 标题位置，默认left，可通过配置文件配置components.label.position来修改默认值。
*    @value                        left                左侧
*    @value                        top                 顶部
* @property {String|Array}         title-class         【响应式属性】 标题的样式类名，默认"bold"，可通过配置文件配置components.label.titleClass来修改默认值。
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @property {String}               name                表单的key，缺省时将不参与表单校验与提交。
* @property {String}               set-name            b-form组件自动回填表单时，回填数据的键名与自身的name不一致时，可使用set-name单独指定回填表单的键名。
* @property {String|Array}         value               表单值，可使用v-model双向绑定单选框的值。回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
* @property {String}               v-model             双向绑定输入框的值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
* @property {Boolean|String}       focus               自动获取焦点，默认false。
*    @value                        true                
*    @value                        false               
* @property {String}               value-type          提交表单值类型，指定后在提交表单之前会先转为对应类型。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。若传入字符串不是默认的类型字符，则可以是页面内在methods中声明的函数名称。在支付宝小程序、头条小程序内无法直接传入函数，可传入页面内的函数名。注意：在该函数内，this对象将始终指向当前页面对象。
*    @value                        float               带小数点的浮点数
*    @value                        int                 整数
*    @value                        string              字符串
* @property {Boolean|String}       auto-placeholder    placeholder为空时，自动显示占位符，自动占位文字为：请输入${title}，${title}为表单标题。默认true，可通过components.autoPlaceholder配置默认值。通常使用b-form组件的auto-placeholder属性来统一调控。
*    @value                        true                
*    @value                        false               
* @property {String}               placeholder         占位符
* @property {String}               placeholder-style   指定 placeholder 的样式
* @property {String}               placeholder-class   指定 placeholder 的样式类
* 
* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* 
* @property {Boolean|String}       required            必填项，默认true，可通过配置文件配置components.required来修改默认值，通常可以使用b-form组件的required属性来统一调控默认是否必填。
*    @value                        true                
*    @value                        false               
* @property {Boolean|String}       required-mark       显示必填标识，默认true，通常通过b-form的required-mark属性统一调控。
*    @value                        true                
*    @value                        false               
* @property {Boolean|String}       blur-check          失去焦点时触发表单校验，默认false，通过components.blurCheck来配置默认值。
*    @value                        true                
*    @value                        false               
* @property {String}               error-type          校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。通常通过b-form组件的error-type属性统一调控。
*    @value                        toast               消息提示框显示提示文字，大于15字时为模态弹窗
*    @value                        underline           输入框的下方红字提示
* @property {String}               empty-prefix        非空验证未通过时，提示语的前缀，默认为：请输入。
* @property {String}               error-msg           表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语。
* @property {String}               validate-title      校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
* 
* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
* @property {String}               v-slot:default       默认插槽作用域变量
*/
export default {
	name: "b-number",
	mixins: [formMixins],
	props: {
		type: {
			type: String,
			default: "number"
		},
		min: [Number, String],
		max: [Number, String],
		step: {
			type: [Number, String],
			default: 1
		},
		strictly: {
			type: [Boolean, String],
			default: true
		},
		fixed: [Number, String],
		boxClass: {
			type: String,
			default: "bd rds4"
		},
		inputClass:{
			type: String,
			default: "text-center block"
		},
		longPress: {
			type: [Boolean, String],
			default: true
		},
		interval: {
			type: [String, Number],
			default: 200
		},
		cursorSpacing:{
			type : String ,
			default : "100px"
		}
	},
	
	computed: {
		slots() {
			return uni.$b.getSlots.call(this, "subtract", "add");
		},
		_max() {
			return uni.$b.isNumber(this.max) ? parseFloat(this.max) : Infinity ;
		},
		_min() {
			return uni.$b.isNumber(this.min) ? parseFloat(this.min): -Infinity ;
		},
		_step() {
			return parseFloat(this.step);
		},
		_longPress() {
			return uni.$b.isTrue(this.longPress);
		},
		_strictly() {
			return uni.$b.isTrue(this.strictly);
		},
		_defaultValue() {
			return -Infinity === this._min ? this._step : this._min;
		},
		$finalValue() {
			return uni.$b.isNull(this.valueSync)
				? this._defaultValue
				: parseFloat(this.valueSync);
		},
		isMax() {
			return this._max === this.$finalValue;
		},
		isMin() {
			return this._min === this.$finalValue;
		},
		addClass() {
			return this.isMax ? "disabled" : "hover8";
		},
		subtractClass() {
			return this.isMin ? "disabled" : "hover8";
		}
	},
	data(){
		return  {
			timer : null 
		}
	},

	methods: {
		add() {
			let value = this._parse(this.$finalValue + this._step);
			this._onChange(value);
		},
		subtract() {
			let value = this._parse(this.$finalValue - this._step);
			this._onChange(value);
		},
		_onInput(e) {
			this.$changeValue(e);
		},
		_handleBlur(e) {
			let value = this._parse(e.detail.value);
			this._onChange(value);
		},
		_onChange(value) {
			this.$changeValue({ detail: { value } });
		},
		_parse(value) {
			value = this._checkedValue(value);
			return uni.$b.isNumber(this.fixed) ? value.toFixed(this.fixed) : value ;
		},
		_checkedValue(value) {
			value = parseFloat(value);
			if (value < this._min) {
				return this._min;
			}
			if (value > this._max) {
				return this._max;
			}
			if (this._strictly && value % this._step > 0) {
				return value - (value % this._step);
			}
			return value;
		},
		_startChange(fnName) {
			this[fnName]();
			if (!this._longPress) {
				return;
			}
			this.timer = setInterval(()=>{
				this[fnName]();
				if (this.isMax || this.isMin) {
					this._stopChange();
				}
			} , parseFloat(this.interval));
		},
		_stopChange() {
			clearInterval(this.timer);
		}
	}
};
</script>
