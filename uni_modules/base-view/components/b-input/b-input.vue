<template>
	<view class="b-input" :class="{'form-item' : !_hidden}">
		<b-label
			v-if="!_hidden"
			:class="{'none' : _hidden}"
			:title="title" 
			:title-width="titleWidth" 
			:title-class="titleClass"
			:title-style="titleStyle"
			:position="position" 
			:align="align" 
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
			
			<view class="father hover-visiable" id="formItem">
				
				<view class="flex" :style="boxStyle" :class="boxClassName">
					
					
					<!-- 插槽 -->
					<view v-if="slots.prepend || !!prepend" class="plr noBreak grayBg h100p br rdsL3 father">
						<slot v-if="slots.prepend" name="prepend"></slot>
						<view v-else class="h100p flex ct">{{prepend}}</view>
					</view>
					
					
					
					<!-- 前缀图标 -->
					<view v-if="prefixIcon" @tap="_tapPrefixIcon" :class="prefixIcon" class="text-right op8 gray fz12 w25"></view>
					
					
					
					<!-- 前缀插槽 -->
					<view v-if="slots.prefix" class="pl10">
						<slot name="prefix"></slot>
					</view>
					
					
					
					<!-- 输入框 -->
					<input class="plr10 cover"
						:type="realType" 
						:value="valueSync+''"
						:name="name"
						:disabled="_disabled"
						:focus="focusSync"
						:maxlength="_maxlength"
						:placeholder="_placeholder"
						:placeholder-style="placeholderStyle"
						:placeholder-class="placeholderClass"
						:cursor-spacing="cursorSpacing"
						:confirm-type="confirmType"
						:confirm-hold="confirmHold"
						:cursor="cursor"
						:selectionStart="selectionStart"
						:selection-end="selectionEnd"
						:adjust-position="adjustPosition"
						:hold-keyboard="holdKeyboard"
						:auto-blur="autoBlur"
						:showConfirmBar="showConfirmBar"
						@input="_onInput"
						@focus="_onFocus"
						@blur="_onBlur"
						@confirm="_onConfirm"
						@keyboardheightchange="_onKeyboardheightchange"/>
					
					
					<!-- 清空插槽 -->
					<view v-if="slots.clear" class="pr10">
						<slot name="clear"></slot>
					</view>
					
					
					
					<!-- 清空 -->
					<view class="pr10 bIcon-closeFill gray fz12 "
						v-if="isShowClear" 
						:class="focusSync ? 'hover6' : 'hover-visiable-item op6'" 
						@tap="_onClear"></view>
					
					
					
					<!-- 切换显示与隐藏密码 -->
					<view v-if="_showPassword" class="pr10 " 
						:class="pswClassName" 
						@tap="_changeType"></view>
					
					
					
					<!-- 长度限制 -->
					<view v-if="isShowLength" class="pr10 gray op8 fz12"
						:class="focusSync ? '' : 'hover-visiable-item'">
						
						{{length}}/{{_maxlength}}
						
					</view>
					
					
					
					<!-- 后缀图标 -->
					<view v-if="suffixIcon" @tap="_tapSuffixIcon" :class="suffixIcon" class="pr10 op8 gray fz12"></view>
					
					
					<!-- 后缀插槽 -->
					<view v-if="slots.suffix">
						<slot name="suffix"></slot>
					</view>
					
					
					<!-- 追加元素 -->
					<view v-if="slots.append || !!append" class="plr noBreak grayBg bl h100p rdsR3 father">
						<slot v-if="slots.append" name="append"></slot>
						<view v-else class="h100p flex ct">{{append}}</view>
					</view>
					
				</view>
				
				
				<slot></slot>
				
			</view>
			
			
			<template v-if="slots.title" slot="title">
				<slot name="title"></slot>
			</template>
			
			
			<template v-if="slots.titleRight" slot="titleRight">
				<slot name="titleRight"></slot>
			</template>
			
			
		</b-label>
	</view>
</template>

<script>
	import inputProps from "./input-props.js" ;
	/**
	* @description Input  输入框，提供表单标题、清空、密码显示切换、限制长度等常用辅助功能，内置使用便捷、易于灵活拓展的表单校验功能。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/input
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                          default               默认插槽，位于输入框底部
	* @slot                          prepend               输入框左侧插槽，会带有灰色背景色和右边线。
	* @slot                          append                输入框右侧插槽，会带有灰色背景色和左边线。
	* @slot                          prefix                输入框左侧插槽，不带有任何默认样式，一般用于插入自定义样式的图标元素。
	* @slot                          suffix                输入框右侧插槽，不带有任何默认样式，一般用于插入自定义样式的图标元素。
	* @slot                          clear                 位于清除图标左侧的插槽
	* @slot                          title                 覆盖表单标题的插槽
	* @slot                          titleRight            位于表单标题右侧位置，position属性为top时有效。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}           input                 值发生变化时触发 | 参数：( value )
	* @event    {Function}           change                值发生变化时触发 | 参数：（e）
	* @event    {Function}           confirm               输入框聚焦时，按下回车键或手机键盘右下角确认键时触发 | 参数：（e）
	* @event    {Function}           focus                 输入框聚焦时触发 | 参数：（e）
	* @event    {Function}           blur                  输入框失去焦点事件 | 参数：（e）
	* @event    {Function}           keyboardheightchange  键盘高度发生变化的时候触发此事件，仅微信小程序2.7.0+支持 | 参数：（e）
	* @event    {Function}           clear                 输入框内的值被清空时触发 | 参数：（e）
	* @event    {Function}           tapPrefixIcon         点击自定义的prefix-icon时触发 | 参数：( e )
	* @event    {Function}           tapSuffixIcon         点击自定义的suffix-icon时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                        validate()            校验表单数据，返回{valid , msg}，valid表示校验是否通过，msg为校验提示信息。 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}     disabled              禁止用户输入，有name时会正常提交表单值，默认false。
	* @property {Boolean|String}     focus                 失去焦点状态时，获取焦点，默认false。使用时注意保证输入框是失去焦点状态，否则不会触发@focus事件。
	* @property {Boolean|String}     hidden                隐藏输入框对用户不可见，重置表单将不会重置其值。如需重置其值，可使用样式类名.none替代。
	* @property {String|Array}       input-class           【响应式属性】 自定义输入框样式类名，默认"whiteBg bd rds3"，可通过配置文件配置components.input.inputClass来修改默认值。
	*    @value                      whiteBg bd rds3       白色背景、圆角3px、带边线
	*    @value                      whiteBg bb            白色背景、下边线
	*    @value                      grayBg bd rds3        灰色背景、圆角3px、带边线
	* @property {String}             input-style           自定义输入框的样式，同css的style。
	* @property {String}             name                  表单的key，缺省时将不参与表单校验与提交。
	* @property {String}             v-model               双向绑定输入框的值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
	* @property {String}             value                 表单值，可使用v-model双向绑定文本框的值，回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 辅助功能属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}     clearable             开启清空功能，默认true，可通过components.input.clearable配置默认值。
	* @property {String}             prefix-icon           输入框左侧字体图标类名
	* @property {Boolean|String}     show-count            显示字数统计，设置maxlength属性后有效，默认true。
	* @property {Boolean|String}     show-password         开启查看密码功能，type为密码类型时有效，默认true，可通过components.input.showPassword配置默认值。
	* @property {String}             suffix-icon           输入框右侧字体图标类名
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}             align                 标题对齐方式，默认left。
	*    @value                      left                  左对齐
	*    @value                      center                居中对齐
	*    @value                      right                 右对齐
	* @property {String}             position              【响应式属性】 标题位置，默认left。
	*    @value                      left                  左侧
	*    @value                      top                   顶部
	* @property {String}             title                 标题
	* @property {String|Array}       title-class           【响应式属性】 标题的样式类名，默认"bold"，可通过配置文件配置components.label.titleClass来修改默认值。
	* @property {String}             title-style           标题样式，同css的style。如需改变输入框的高度，推荐使用scale属性。
	* @property {String|Number}      title-width           标题宽度，默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}             confirm-name          比对相等的表单的name，通常用于确认密码、确认邮箱等验证场景。
	* @property {String|Number}      max                   最大值，用于数字类表单校验。
	* @property {String|Number}      maxlength             最大输入字符长度，超出后不可输入，-1为不限，默认-1。
	* @property {String|Number}      min                   最小值，用于数字类表单校验。
	* @property {String|Number}      minlength             最小输入字符长度，用于表单校验，-1为不限，默认-1。
	* @property {String|RegExp}      pattern               表单校验正则表达式，type属性无法满足校验需求时传入。若为字符串类型，表示页面内的正则变量的变量名。在支付宝小程序、头条小程序中仅支持传入字符串类型。
	* @property {Boolean|String}     required              必填项，默认true，通常可以使用b-form组件的required属性来统一调控默认是否必填。
	* @property {String}             type                  表单类型，用于限制用户输入以及表单校验，默认text。
	*    @value                      text                  文本，原生类型
	*    @value                      number                数字，原生类型
	*    @value                      digist                带小数点的数字，原生类型
	*    @value                      idcard                身份证，原生类型，表单校验类型
	*    @value                      int                   整数，表单校验类型
	*    @value                      amount                金额，大于等于0，表单校验类型
	*    @value                      landline              座机，表单校验类型
	*    @value                      mobile                手机，表单校验类型
	*    @value                      telephone             座机或手机，表单校验类型
	*    @value                      email                 邮箱，表单校验类型
	*    @value                      url                   http、https链接，表单校验类型
	*    @value                      carNo                 车牌号，表单校验类型
	*    @value                      password              密码，原生类型无校验规则
	*    @value                      weekPassword          弱密码，表单校验类型，密码中必须包含字母、数字，至少6个字符，最多22个字符。
	*    @value                      mediumPassword        中等强度密码，表单校验类型，密码中必须包含字母、数字、特殊字符，至少8个字符，最多32个字符。
	*    @value                      strongPassword        强密码，表单校验类型，密码中必须包含大小字母、数字、特殊字符4种字符，至少8个字符，最多32个字符。
	* @property {String}             validator             表单校验函数，接收表单值value作为参数，若校验未通过需返回错误提示信息，校验通过时不返回任何信息。若传入字符串类型属性值，则表示在页面methods中声明的一个函数名。在支付宝小程序、头条小程序中仅支持字符串类型属性值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 校验提示属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}     blur-check            失去焦点时触发表单校验，默认false，通过components.blurCheck来配置默认值。
	* @property {String}             empty-prefix          非空验证未通过时，提示语的前缀，默认为：请输入。
	* @property {String|Object}      error-msg             表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语，类型为object时，可定义多个校验提示。
	* @property {String}             error-type            校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。通常通过b-form组件的error-type属性统一调控。
	*    @value                      toast                 消息提示框显示提示文字，大于15字时为模态弹窗
	*    @value                      underline             输入框的下方红字提示
	* @property {Boolean|String}     required-mark         显示必填标识，默认true，通常通过b-form的required-mark属性统一调控。
	* @property {String}             validate-title        校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 原生属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean}            adjust-position       键盘弹起时，是否自动上推页面，默认true。
	* @property {Boolean}            autoBlur              键盘收起时，是否自动失去焦点，默认false，仅App 3.0.0+支持。
	* @property {Boolean}            confirm-hold          点击键盘右下角按钮时是否保持键盘不收起，默认false
	* @property {String}             confirm-type          键盘右下角确认按钮的文字
	*    @value                      send                  发送
	*    @value                      search                搜索
	*    @value                      next                  下一个
	*    @value                      go                    前往
	*    @value                      done                  完成
	* @property {Number}             cursor                focus时的光标位置
	* @property {Number}             cursor-spacing        指定光标与键盘的距离，单位 px 。仅App、微信小程序、百度小程序、QQ小程序支持。
	* @property {Boolean}            hold-keyboard	        focus时，点击页面的时候不收起键盘，默认false。
	* @property {String}             placeholder           占位符
	* @property {String}             placeholder-class     指定 placeholder 的样式类
	* @property {String}             placeholder-style     指定 placeholder 的样式
	* @property {Number}             selection-end	        光标结束位置，自动聚集时有效，需与selection-start搭配使用
	* @property {Number}             selection-start       光标起始位置，自动聚集时有效，需与selection-end搭配使用
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}     auto-placeholder      placeholder为空时，自动显示占位符，自动占位文字为：请输入${title}，${title}为表单标题。默认true，可通过components.autoPlaceholder配置默认值。通常使用b-form组件的auto-placeholder属性来统一调控。
	* @property {String|Number}      scale                 尺寸缩放比例，默认1。
	* @property {Boolean|String}     sign                  对数据进行加密后提交，默认false。通过components.input.sign配置默认值，可通过components.input.getSignStr配置加密算法。常用于密码客户端加密后提交等场景。
	* @property {Boolean|String}     trim                  失去焦点时自动去除前后空格，默认false。
	* @property {String}             value-type            提交表单值类型，指定后在提交表单之前会先转为对应类型。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。若传入字符串不是默认的类型字符，则可以是页面内在methods中声明的函数名称。在支付宝小程序、头条小程序内无法直接传入函数，可传入页面内的函数名。注意：在该函数内，this对象将始终指向当前页面对象。
	*    @value                      float                 带小数点的浮点数
	*    @value                      int                   整数
	*    @value                      string                字符串
	*    @value                      boolean               布尔值
	*    @value                      bool                  布尔值
	*    @value                      object                JSON对象
	*    @value                      array                 数组
	*    @value                      timestamp             时间戳
	* 
	* @property {String}             ref                    获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-input",
		mixins:[ inputProps , uni.$b._mixins.form , uni.$b._mixins.media ],
		props:{
			hidden:[Boolean,String]
		},
		data() {
			return {
				pswNotInit : false ,
				keepFocus : false ,
				isPsw : true 
			}
		},
		computed:{
			
			slots(){
				return uni.$b.getSlots.call( this , "title","titleRight","append","prepend","suffix","prefix","clear") ;
			},
			
			isPasswordType(){
				return ['password','weekPassword','mediumPassword','strongPassword'].includes(this.type) ;
			},
			
			originType(){
				if ( this.isPasswordType ) {
					return 'password' ;
				}
				
				let basicTypes = ["text","number","idcard","digist"] ;
				let textTypes = ["landline","telephone","email","url","carNo","password","weekPassword","mediumPassword","strongPassword"] ;
				let numberTypes = ["mobile","int"] ;
				let digistTypes = ["amount"] ;
				
				if (basicTypes.indexOf(this.type) > -1) {
					return this.type ;
				}
				if (textTypes.indexOf(this.type) > -1) {
					return "text" ;
				}
				if (numberTypes.indexOf(this.type) > -1) {
					return "number" ;
				}
				if (digistTypes.indexOf(this.type) > -1) {
					return "digist" ;
				}
				return "text" ;
			},
			
			realType(){
				if (this.originType == 'password') {
					return this.isPsw && !this.pswNotInit ? 'password' : "text" ;
				}
				return this.originType ;
			},
			
			_inputClass(){
				return this.dv(this.inputClass) ;
			},
			
			boxStyle(){
				return uni.$b.getStyle({
					"height" : `${this._scale*80}rpx` 
				} , this.inputStyle);
			},
			
			boxClassName(){
				return uni.$b.getClassName({
					'focus' : this.focusSync , 
					'disabled' : this._disabled , 
					'error' : !!this.errorTip  , 
					'visitedStatus' : true
				} , this._inputClass );
			},
			
			pswClassName(){
				return uni.$b.getClassName({
					'bIcon-psw' : this.isPsw , 
					'bIcon-hidePsw' : !this.isPsw , 
					'hover6' : this.focusSync , 
					'hover-visiable-item op6' : !this.focusSync
				});
			},
			
			isShowLength(){
				return uni.$b.isTrue(this.showCount) && this._maxlength > -1 ;
			},
			
			isShowClear(){
				return uni.$b.isTrue(this.clearable) && !this._disabled && this.hasValue ;
			},
			
			_hidden(){
				return uni.$b.isTrue(this.hidden) ;
			},
			
			_showPassword(){
				let isShowPassword = uni.$b.isTrue(this.showPassword) ;
				return this.isPasswordType && isShowPassword && this.hasValue ;
			},
			
			_maxlength(){
				return uni.$b.isNumber(this.maxlength) ? parseFloat(this.maxlength) : '' ;
			},
			
			_minlength(){
				return uni.$b.isNumber(this.minlength) ? parseFloat(this.minlength) : '' ;
			}
			
		},
		watch:{
			value:{
				handler(value){
					if (!!value && this._maxlength > 0 && value.length > this._maxlength) {
						this.valueSync = value.substr(0,this._maxlength);
					}
				},
				immediate : true 
			},
			errorContent(){ //同步引用该组件的组件传入的错误提示信息
				this.errorTip = this.errorContent ;
			}
		},
		
		created() {
			// #ifdef H5
			this.pswNotInit = this.isPasswordType ;
			// #endif
		},
		
		methods: {
			
			_handleFocus(e){
				
				// #ifdef H5
				
				//禁止密码自动填充
				if (this.pswNotInit) {
					this.pswNotInit = false ;
					
					//H5不支持动态切换，故而会触发blur，在blur时依据keepFocus来重新focus。
					this.keepFocus = true ;
				}
				
				// #endif
			},
			
			_handleBlur(e = {detail:{}}){
				
				// #ifdef H5
				
				//H5不支持动态切换，故而会触发blur，在blur时依据keepFocus来重新focus。
				if (this.keepFocus) {
					this.keepFocus = false ;
					this.$nextTick(()=>{
						this.focusSync = true ;
					});
					return false ;
				}
				
				// #endif
				
				let value = this.valueSync ;
				if (uni.$b.isTrue(this.trim) && uni.$b.notNull(value)) {
					value = value.trim();
					this.valueSync = value ;
					this._bindModel(value);
					e.detail.value = value ;
				}
			},
			
			//切换密码显示状态
			_changeType(){
				
				//取消blur引起的表单校验
				clearTimeout(this.delayTimer) ;
				
				this.isPsw = !this.isPsw ;
				
				//点击输入框外部会触发blur，重新将焦点聚焦
				this.$nextTick(()=>{
					this.focusSync = true ;
				});
			},
			
			_onInput(e){
				this.$changeValue(e);
			},
			
			_onClear(e){
				//取消blur引起的表单校验
				clearTimeout(this.delayTimer) ;
				e.detail.value = "" ;
				e.type = "clear" ;
				this.$changeValue(e);
				this.$emit("clear" , e);
				this.$nextTick(()=>{
					this.focusSync = true ;
				});
			},
			
			_onConfirm(e){
				e.detail.value = this.$finalValue ;
				this.$emit("confirm",e);
			},
			
			_onKeyboardheightchange(e){
				e.detail.value = this.$finalValue ;
				this.$emit("keyboardheightchange",e);
			},
			
			_tapSuffixIcon(e){
				this.$emit("tapSuffixIcon" , e) ;
				this.$nextTick(()=>{
					this.focusSync = true ;
				});
			},
			
			_tapPrefixIcon(e){
				this.$emit("tapPrefixIcon" , e) ;
				this.$nextTick(()=>{
					this.focusSync = true ;
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "./b-input.scss";
</style>
