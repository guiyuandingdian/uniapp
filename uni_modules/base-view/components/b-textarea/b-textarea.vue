<template>
	<view class="b-textarea form-item">
		<b-label
			:title="title"
			:title-style="_titleStyle"
			:title-class="titleClass"
			:title-width="titleWidth"
			:position="position"
			:align="align"
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
			
			<view class="father hover-visiable">
				
				<!-- 文本框 -->
				<textarea
					id="formItem"
					class="textarea"
					:class="textClass"
					:style="textStyle"
					:value="valueSync"
					:name="name"
					:disabled="_disabled"
					:focus="focusSync"
					:auto-height="autoHeight"
					:selectionStart="selectionStart"
					:selection-end="selectionEnd"
					:adjust-position="adjustPosition"
					:hold-keyboard="holdKeyboard"
					:show-confirm-bar="showConfirmBar"
					:disable-default-padding="true"
					:placeholder="_placeholder"
					:maxlength="_maxlength"
					:placeholder-style="placeholderStyle"
					:placeholder-class="placeholderClass"
					:cursor-spacing="cursorSpacing"
					:confirm-type="_confirmType"
					:cursor="cursor"
					:fixed="fixed"
					:autoBlur="autoBlur"
					:show-count="false"
					
					@input="onInput"
					@focus="_onFocus"
					@blur="_onBlur"
					@confirm="$emit('confirm',$event)"
					@keyboardheightchange="$emit('keyboardheightchange',$event)"
					@linechange="$emit('linechange',$event)"/>
				
				
				<cover-view :class="bottomClass" class="fz12 gray abs bottom right flex rt rdsBr3 pb6" style="bottom: 1px;right: 1px;">
					
					<!-- 文字长度 -->
					<cover-view :class="lengthClass" class="pr9">
						{{length}}/{{_maxlength}}
					</cover-view>
					
					<!-- 清空 -->
					<cover-view  
						@tap="onClear" 
						:class="clearClass" 
						class="bIcon-closeFill pr9">
						
					</cover-view>
					
				</cover-view>
				
				
				<!-- 默认插槽 -->
				<slot></slot>
				
				
				<!-- #ifdef H5 -->  <!-- cursor:not-allowed -->
				<view class="not-allowed abs" v-if="_disabled"></view>
				<!-- #endif -->
				
				
				
			</view>
			
		</b-label>
	</view>
</template>

<script>
	/**
	* @description Textarea 文本框，内置清空文本、字数统计等常用功能，拓展了原生文本框的最大高度属性，使得根据内容自增高的同时，可以控制最大高度。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/textarea
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                                    default     默认插槽，位于文本框下方位置。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                     focus       聚焦时触发 | 参数：( event )
	* @event    {Function}                     blur        失去焦点时触发 | 参数：( event )
	* @event    {Function}                     linechange  输入框行数变化时触发，字节跳动小程序不支持 | 参数：{ detail : {height , heightRpx , lineCount } }
	* @event    {Function}                     input       输入文字时触发 | 参数：{ detail : { value } }
	* @event    {Function}                     confirm     聚焦时PC端按回车键，移动端按键盘的确认键时触发 | 参数：{ detail : { value } }
	* @event    {Function}                     keyboardheightchange 键盘高度发生变化的时候触发，键盘高度发生变化的时候触发此事件，仅微信小程序2.7.0+支持 | 参数：{ detail :  { height , duration } }
	* @event    {Function}                     clear       清空文本框的值时触发 | 参数：--
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 常用属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               auto-placeholder placeholder为空时，自动显示占位符，自动占位符为：请输入${title}，title为表单标题。默认true，可通过components.autoPlaceholder配置默认值。
	* @property {Boolean|String}               clearable   开启清空功能，默认true，可通过components.textarea.clearable配置默认值。
	* @property {Boolean|String}               disabled    禁止用户输入，有name时会正常提交表单值，默认false。
	* @property {Boolean|String}               focus       失去焦点状态时，获取焦点，默认false。使用时注意保证输入框是失去焦点状态，否则不会触发@focus事件。
	* @property {String}                       name        表单的key，缺省时将不参与表单校验与提交。
	* @property {Boolean|String}               show-length 显示已输入字符长度，设置maxlength属性后有效，默认true。
	* @property {String}                       value       表单值，可使用v-model双向绑定文本框的值，回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Array}          height      【响应式属性】 高度。不设置固定高度时，会根据内容自增高，可通过min-height设置最小高度，max-height设置最大高度。
	* @property {String|Number|Array}          max-height  【响应式属性】 最大高度，默认400rpx，可通过配置文件配置components.textarea.maxHeight来修改默认值。未设置固定高度，文本框将随内容自动增高，可通过设置max-height限制最大高度。
	* @property {String|Number|Array}          min-height  【响应式属性】 文本框的最小高度，未设置高度时默认100px。
	* @property {String|Array}                 textarea-class 【响应式属性】 设置文本框的样式类名，可用于覆盖默认样式，可通过配置文件配置components.textarea.textareaClass来修改全局配置。
	* @property {String}                       textarea-style 设置文本框的样式
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       align       标题对齐方式，默认left。
	*    @value                                left        左对齐
	*    @value                                center      居中对齐
	*    @value                                right       右对齐
	* @property {String}                       position    标题位置，默认auto。
	*    @value                                left        左侧
	*    @value                                top         顶部
	*    @value                                auto        宽屏左侧，窄屏顶部
	* @property {String}                       title       标题
	* @property {Number}                       title-width 标题的宽度，单位px，默认65，通过修改配置文件配置components.label.titleWidth来修改默认值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               blur-check  失去焦点时触发表单校验，默认false，通过components.blurCheck来配置默认值。
	* @property {String}                       confirm-name 比对相等的表单的name，通常用于输入值的再次确认场景。
	* @property {String}                       empty-prefix 非空验证未通过时，提示语的前缀，默认为：请输入。
	* @property {String|Object}                error-msg   表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语，类型为object时，可定义多个校验提示。
	* @property {String}                       error-type  校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。
	*    @value                                toast       消息提示框显示提示文字，大于15字时为模态弹窗
	*    @value                                underline   输入框的下方红字提示
	* @property {Number}                       maxlength   最大输入字符长度，超出后不可输入，-1为不限，默认-1。
	* @property {Number}                       minlength   最小输入字符长度，用于表单校验，-1为不限，默认-1。
	* @property {RegExp}                       pattern     表单校验正则表达式
	* @property {Boolean|String}               required    必填项，默认true
	* @property {Boolean|String}               required-mark 显示必填标识，默认true
	* @property {String}                       validate-title 校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
	* @property {Function}                     validator   表单校验函数，接收表单值value作为参数，若校验未通过需返回错误提示信息，校验通过时不返回任何信息。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 原生属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean}                      adjust-position 键盘弹起时，是否自动上推页面，默认true。
	* @property {Boolean}                      confirm-hold 点击键盘右下角按钮时是否保持键盘不收起，默认false
	* @property {String}                       confirm-type 键盘右下角确认按钮的文字
	*    @value                                send        发送
	*    @value                                search      搜索
	*    @value                                next        下一个
	*    @value                                go          前往
	*    @value                                done        完成
	* @property {Number}                       cursor      focus时的光标位置
	* @property {Number}                       cursor-spacing 指定光标与键盘的距离，单位 px 。仅App、微信小程序、百度小程序、QQ小程序支持。
	* @property {Boolean}                      fixed       在微信小程序、百度小程序、字节跳动小程序、QQ小程序上，如果 textarea 是在一个 position:fixed 的区域，需要指定属性 fixed 为 true。
	* @property {Boolean}                      hold-keyboard	 focus时，点击页面的时候不收起键盘，默认false，仅微信小程序2.8.2支持。
	* @property {String}                       placeholder 占位符
	* @property {String}                       placeholder-class 指定 placeholder 的样式类
	* @property {String}                       placeholder-style 指定 placeholder 的样式
	* @property {Number}                       selection-end	 光标结束位置，自动聚集时有效，需与selection-start搭配使用，仅微信小程序、App、H5、百度小程序、字节跳动小程序、QQ小程序支持。
	* @property {Number}                       selection-start 光标起始位置，自动聚集时有效，需与selection-end搭配使用，仅微信小程序、App、H5、百度小程序、字节跳动小程序、QQ小程序支持。
	* @property {Boolean}                      show-confirm-bar 是否显示键盘上方带有”完成“按钮那一栏，默认false，仅微信小程序、百度小程序、QQ小程序支持。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               sign        对数据进行加密后提交，默认false。通过components.input.sign配置默认值，可通过components.input.getSignStr配置加密算法。
	* @property {String|Function}              value-type  提交表单值类型，指定后在提交表单之前会先转为对应类型。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。注意：在该函数内，this对象将始终指向当前页面对象。
	*    @value                                float       带小数点的浮点数
	*    @value                                int         整数
	*    @value                                string      字符串
	*    @value                                boolean     布尔值
	*    @value                                bool        布尔值
	*    @value                                object      JSON对象
	*    @value                                array       数组
	*    @value                                timestamp   时间戳
	* 
	* @property {String}                       ref          获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-textarea",
		mixins:[ uni.$b._mixins.form , uni.$b._mixins.media ],
		props:{
			textareaClass:{
				type : [String,Array],
				default : uni.$b.getValue("components.textarea.textareaClass")  
			},
			textareaStyle:String,
			clearable:{
				type : [Boolean,String],
				default : true 
			},
			fixed:Boolean ,
			autoBlur:Boolean ,
			cursor : Number ,
			maxlength : {
				type : [String,Number],
				default : -1
			} ,
			minlength : {
				type : [String,Number],
				default : -1
			} ,
			showCount : {
				type : [String , Boolean],
				default : true
			} ,
			confirmType : {
				type : String ,
				default : "done"
			} ,
			confirmHold : {
				type : Boolean ,
				default : false
			},
			selectionStart :{
				type : Number ,
				default : -1
			},
			selectionEnd:{
				type : Number ,
				default : -1
			},
			adjustPosition:{
				type : Boolean ,
				default : true
			},
			holdKeyboard:{
				type : Boolean ,
				default : false
			},
			showConfirmBar:{
				type : Boolean ,
				default : false
			},
			height:[Number,String,Array],
			minHeight : [Number,String,Array] ,
			maxHeight : {
				type : [Number,String,Array] ,
				default(){
					return uni.$b.getValue("components.textarea.maxHeight")
				}
			},
			cursorSpacing: Number
		},
		data(){
			return {
				areaRect : { height : 0}
			}
		},
		computed:{
			_maxlength(){
				return parseFloat(this.maxlength) || '' ;
			},
			
			_minlength(){
				return parseFloat(this.minlength) || '' ;
			},
			
			showLength(){
				return uni.$b.isTrue(this.showCount) && this._maxlength > 0 && !this._disabled ;
			},
			
			showClear(){
				return uni.$b.isTrue(this.clearable) && !this._disabled && this.hasValue ;
			},
			
			_titleStyle(){
				return uni.$b.getStyle({
					'height' : `${this._scale * 80}rpx` 
				} , this.titleStyle ) ;
			},
			
			_confirmType(){
				//PC端设置confirmType后回车会失去焦点而不会正常换行
				return this.isPc ? "" : this.confirmType ;
			},
			
			_height(){
				return this.pv(this.height) ;
			},
			
			fixedHeight(){
				return uni.$b.notNull(this._height) ;
			},
			
			_maxHeight(){
				return this.fixedHeight ? '' : this.pv(this.maxHeight) ;
			},
			
			_minHeight(){
				if (this.fixedHeight) {
					return '' ;
				}
				let height = this.pv(this.minHeight) ;
				if (uni.$b.notNull(height)) {
					return height ;
				}
				let scale = this.extendProp("scale" , 1 ) ;
				return `${scale * 100}px` ;
			},
			
			reachMaxHeight(){
				return this.areaRect.height >= parseFloat(this._maxHeight) ;
			},
			
			autoHeight(){
				//达到最大高度或固定高度时，则为固定高度，不自增。
				return !this.fixedHeight && !this.reachMaxHeight ;
			},
			
			textStyle(){
				return uni.$b.getStyle({
					'height' : this._height ? `calc(${this._height} + 40rpx)` : '',
					'min-height' : this._minHeight ? `calc(${this._minHeight} + 40rpx)` : '' ,
					'max-height' : this._maxHeight ? `calc(${this._maxHeight} + 40rpx)` : '' 
				} , this.textareaStyle);
			},
			
			_textareaClass(){
				return this.dv(this.textareaClass) ;
			},
			
			_showAssist(){
				return (this.showClear || this.showLength)  ;
			},
			
			textClass(){
				return uni.$b.getClassName({
					'focus' : this.focusSync , 
					'disabled' : this._disabled , 
					'error' : !!this.errorTip ,
					'pd10' : !this._showAssist ,
					'plr10 pt10 pb20' : this._showAssist
				}, this._textareaClass );
			},
			lengthClass(){
				return uni.$b.getClassName({
					'none' : !this.showLength
				});
			},
			clearClass(){
				return uni.$b.getClassName({
					'hover-visiable-item op6' : !this.focusSync ,
					'hover6' : this.focusSync,
					'none' : !this.showClear
				});
			},
			bottomClass(){
				return uni.$b.getClassName({
					'hover-visiable-item' : !this.focusSync ,
					'none' : !this.showLength && !this.showClear
				});
			}
		},
		
		watch:{
			value:{
				handler(value){
					if (!!value && this._maxlength > 0 && value.length > this._maxlength) {
						this.valueSync = value.substr(0,this._maxlength);
					}
					this._queryRect();
				},
				immediate : true 
			}
		},
		
		mounted() {
			this._queryRect();
		},
		
		methods: {
			
			onInput(e){
				this.$changeValue(e);
				this._queryRect();
			},
			
			async _queryRect(){
				this.areaRect = await uni.$b.select("#formItem",this);
			},
			
			onClear(e){
				//取消blur引起的表单校验、notFocus值的改变
				clearTimeout(this.delayTimer) ;
				e.detail.value = "" ;
				this.$changeValue(e);
				this.$emit("clear" , e);
				this.$nextTick(()=>{
					this.focusSync = true ;
					this._queryRect();
				});
			}
		}
	}
</script>

<style lang="scss">
	.textarea{
		cursor: text;
		transition:border-color 0.4s ;
		&:hover,&:visited,&:focus,&:active{
			border-color: $activeColor;
		}
	}
	.focus{
		border-color: $activeColor;
	}
	.disabled{
		background-color: #e8e8e8;
		color: #000;
		opacity: 0.6;
		&:hover,&:visited,&:focus,&:active{
			border-color: $borderColor;
		}
	}
	.error{
		border-color: $red;
		&:hover,&:visited,&:focus,&:active{
			border-color: $red;
		}
	}
</style>
