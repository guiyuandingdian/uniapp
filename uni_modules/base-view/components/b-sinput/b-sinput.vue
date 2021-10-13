<template>
	<view class="b-sinput form-item">
		<view id="formItem">
			<b-input
				:type="type"
				:title="title"
				:title-width="titleWidth" 
				:required="_required"
				:requiredMark="_requiredMark"
				:position="position"
				:align="align" 
				:showPassword="showPassword"
				:clearable="clearable"
				:maxlength="maxlength"
				:minlength="minlength"
				:showCount="showCount"
				:min="min"
				:max="max"
				:confirmType="confirmType"
				:confirmHold="confirmHold"
				:selectionStart="selectionStart"
				:selectionEnd="selectionEnd"
				:adjustPosition="adjustPosition"
				:holdKeyboard="holdKeyboard"
				:autoBlur="autoBlur"
				:cursorSpacing="cursorSpacing"
				:cursor="cursor"
				:prefixIcon="prefixIcon"
				:suffixIcon="suffixIcon"
				:name="name"
				:value="valueSync"
				:disabled="disabled"
				:focus="focusSync"
				:valueType="valueType"
				:scale="_scale"
				:validateTitle="validateTitle"
				:pattern="pattern"
				:validator="validator"
				:confirmName="confirmName"
				:blurCheck="_blurCheck"
				:error-type="_errorType"
				:emptyPrefix="emptyPrefix"
				:errorMsg="errorMsg"
				:placeholder="_placeholder"
				:autoPlaceholder="autoPlaceholder"
				:placeholderStyle="placeholderStyle"
				:placeholderClass="placeholderClass"
				:sign="sign"
				:trim="trim"
				:readonly="readonly"
				:inputClass="inputClass"
				:inputStyle="inputStyle"
				
				@change="_onInput"
				@blur="_onBlur"
				@focus="_onFocus"
				@clear="_onClear"
				@confirm="_onConfirm"
				@keyboardheightchange="_onKeyboardheightchange">
			
				<!-- 后缀图标 -->
				<view class="flex" slot="clear">
					
					<!-- 搜索状态 -->
					<view v-if="searching">
						<text class="uni-icon_toast uni-loading"></text>
					</view>
					
					<slot name="clear"></slot>
					
				</view>
				
				
				<template slot="suffix" v-if="$slots.suffix">
					<slot name="suffix"></slot>
				</template>
				
				
				<template slot="prefix" v-if="$slots.prefix">
					<slot name="prefix"></slot>
				</template>
				
				
				<template slot="prepend" v-if="$slots.prepend">
					<slot name="prepend"></slot>
				</template>
				
				<template slot="append" v-if="$slots.append">
					<slot name="append"></slot>
				</template>
				
				<!-- 输入框的默认插槽 -->
				<slot></slot>
				
			
				<!-- 搜索建议 -->
				<b-animate class="abs z3 top suggestions-box"
					ref="searchList" 
					:inClass="isBottom ? 'fadeInDownSm':'fadeInUpSm'" 
					:outClass="isBottom ? 'fadeOutUpSm' : 'fadeOutDownSm'" 
					:class="{isBottom : isBottom , 'none' : listData.length == 0}"
					:value="false" 
					:duration="200">
					
					<view class="rds4  whiteBg suggestions" :style="{'max-height' : maxHeightSync}">
						
						<view id="header">
							<slot name="header"></slot>
						</view>
						
						<view class="autoY ptb10 pointer" :style="{'max-height' : bodyMaxHeight}">
							
							<view class="ptb7 plr20 suggestions-item "
								v-for="( item , index) in listData" :key="index"
								:class="{'not-allowed op5' : item.disabled }" 
								@tap="choose(item,index)">
								
								<block v-if="!$scopedSlots.bodyItem">
									<view class="fz14">
										<rich-text :nodes="item.richValue"></rich-text>
									</view>
									<view class="fz12 gray" v-if="item.richRemark">
										<rich-text :nodes="item.richRemark"></rich-text>
									</view>
								</block>
								<block v-else>
									<slot name="bodyItem" :item="item.data" :index="index" :isFirst="index == 0" :isLast="index == listData.length - 1"></slot>
								</block>
								
							</view>
							
						</view>
						
						<view id="footer">
							<slot name="footer"></slot>
						</view>
						
					</view>
					
				</b-animate>
				
			</b-input>
		</view>
	</view>
</template>

<script>
	import inputProps from "../b-input/input-props.js" ;
	/**
	* @description Sinput 远程搜索输入框，拓展b-input组件的远程数据搜索推荐和本地数据筛选推荐能力，只需配置远程搜索接口地址即可实现搜索推荐输入功能，支持接口权限验证，无接口权限时将不会进行远程搜索推荐。
	
	本组件支持b-input输入框组件的所有属性、插槽、事件，不再在此赘述。
	
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/sinput
	* @version     1.0.0
	* 
	* @ ------------------------------------------
	* Slot 插槽
	* --------------------------------------------
	* @slot bodyItem                                       搜索结果面板自定义每一条数据的展示方式插槽，这是一个私域插槽，可使用私域变量。
	* @slot header                                         搜索推荐面板顶部插槽
	* @slot footer                                         搜索面板底部插槽
	* 
	* @ ------------------------------------------
	* Events 事件
	* --------------------------------------------
	* @event    {Function} load                            远程搜索结果加载完成时触发 { state:'ok' , list : [] }
	* @event    {Function} choose                          从推荐面板选中推荐项时触发 { data , index , value }
	* @event    {Function} error                           远程接口请求失败，通常是网络故障、服务端异常等原因 ( err )
	* @event    {Function} loading                         开始请求远程数据 --
	* 
	* @ ------------------------------------------
	* Methods 方法
	* --------------------------------------------
	* @method   loadData()                                 用于主动加载url参数对应的接口数据，会触发@load事件，获取响应结果。 --
	* @method   remove()                                   从当前推荐列表数据中删除指定的数据 (index , count)
	* 
	* @ ------------------------------------------
	* Props 基础属性
	* --------------------------------------------
	* @property {String}               disabled-key        推荐列表数据中字段禁用状态的键名，默认disabled，在配置文件中，通过配置components.disabledKey来修改默认值。
	* @property {Boolean|String}       hide-onblur         输入框失去焦点时隐藏推荐列表，默认true。
	* @property {Boolean|String}       highlight           开启文字高亮，默认true
	* @property {String}               highlight-color     高亮文字颜色，默认#e1251b，可在配置文件中配置highlightColor来修改默认值。
	* @property {Array}                list                本地数据列表，本地输入推荐模式下有效
	* @property {String|Number|Array}  max-height          搜索列表面板的最大高度，默认280。
	* @property {String}               mode                输入推荐模式，默认remote
	*    @value                        local               本地数据推荐
	*    @value                        remote              远程搜索推荐
	* @property {String}               remark-key          推荐列表数据中副标题字段的键名（推荐数据中有副标题时展示），默认remark，在配置文件中，通过配置components.remarkKey来修改默认值。
	* @property {String}               rich-remark-key     推荐列表数据中自定义高亮副标题富文本的键名，默认richRemark。
	* @property {String}               rich-value-key      推荐列表数据中自定义高亮标题富文本的键名，默认richValue。
	* @property {String}               value-key           推荐列表数据中标题字段的键名，默认value，在配置文件中，通过配置components.valueKey来修改默认值。
	* 
	* @ ------------------------------------------
	* Props 常用交互属性
	* --------------------------------------------
	* @property {String}               auth-url            权限验证url，authUrl如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}       cache               启用客户端本地缓存，默认false。
	* @property {Boolean|String}       check-auth          校验搜索接口调用权限，无权限时不会触发远程搜索，默认false，可在配置文件中配置checkAuth修改默认值。
	* @property {Boolean|String}       empty-search        搜索关键字为空时，亦触发远程搜索，默认false。
	* @property {Object}               params              远程搜索时携带的自定义参数
	* @property {String}               search-key          远程搜索关键字的key，在服务端可通过这个key获取到搜索关键字内容，默认searchKey。
	* @property {String}               url                 远程搜索接口地址，开启权限验证后，若authUrl为空，则使用url进行权限验证。
	* @property {Boolean|String}       usable              远程搜索是否可用，默认true。
	* 
	* @ ------------------------------------------
	* Props 其他交互属性
	* --------------------------------------------
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Boolean|String}       debug               开发阶段在浏览器控制台打印日志，默认true，可在配置文件中配置call.debug来修改默认值。
	* @property {Boolean|String}       fail                服务端未返回请求成功状态时，进行默认处理，默认true。
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。
	* @property {String}               method              请求方式，api-type为http时有效。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Boolean|String}       search-status       远程请求时，显示远程搜索状态图标，默认true。
	*
	* 
	* 
    * @description Input  输入框，提供表单标题、清空、密码显示切换、限制长度等常用辅助功能，内置使用便捷、易于灵活拓展的表单校验功能。
    * @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/input
    * @version     1.0.0
    * 
    * @ ------------------------------------------
    * Slot 插槽
    * --------------------------------------------
    * @slot default                                        默认插槽，位于输入框底部
    * @slot prepend                                        输入框左侧插槽，会带有灰色背景色和右边线。
    * @slot append                                         输入框右侧插槽，会带有灰色背景色和左边线。
    * @slot prefix                                         输入框左侧插槽，不带有任何默认样式，一般用于插入自定义样式的图标元素。
    * @slot suffix                                         输入框右侧插槽，不带有任何默认样式，一般用于插入自定义样式的图标元素。
    * @slot clear                                          位于清除图标左侧的插槽
    * 
    * @ ------------------------------------------
    * Events 事件
    * --------------------------------------------
    * @event    {Function} input                           键盘输入事件 { detail : { value } }
    * @event    {Function} confirm                         输入框聚焦时，按下回车键或手机键盘右下角确认键时触发 { detail : { value } }
    * @event    {Function} focus                           输入框聚焦时触发 { detail : { value } }
    * @event    {Function} blur                            输入框失去焦点事件 { detail : { value } }
    * @event    {Function} keyboardheightchange            键盘高度发生变化的时候触发此事件，仅微信小程序2.7.0+支持 { detail : {height, duration} }
    * @event    {Function} clear                           输入框内的值被清空时触发 --
    * 
    * @ ------------------------------------------
    * Props 常用属性
    * --------------------------------------------
    * @property {Boolean|String}       auto-placeholder    placeholder为空时，自动显示占位符，自动占位符为：请输入${title}，title为表单标题。默认true，可通过components.autoPlaceholder配置默认值。
    * @property {Boolean|String}       clearable           开启清空功能，默认true，可通过components.input.clearable配置默认值。
    * @property {Boolean|String}       disabled            禁止用户输入，有name时会正常提交表单值，默认false。
    * @property {Boolean|String}       focus               失去焦点状态时，获取焦点，默认false。使用时注意保证输入框是失去焦点状态，否则不会触发@focus事件。
    * @property {Boolean|String}       hidden              隐藏输入框对用户不可见，重置表单将不会重置其值。如需重置其值，可使用样式类名.none替代。
    * @property {String}               name                表单的key，缺省时将不参与表单校验与提交。
    * @property {Boolean|String}       show-password       开启查看密码功能，type为密码类型时有效，默认true，可通过components.input.showPassword配置默认值。
    * @property {String}               title               标题
    * @property {Number}               title-width         标题宽度，默认90，为0时隐藏标题。
    * @property {String}               v-model             双向绑定输入框的值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
    * @property {String}               value               表单值，可使用v-model双向绑定输入框的值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
    * 
    * @ ------------------------------------------
    * Props 其他属性
    * --------------------------------------------
    * @property {String}               align               标题对齐方式，默认left。
    *    @value                        left                左对齐
    *    @value                        center              居中对齐
    *    @value                        right               右对齐
    * @property {String}               position            标题位置，默认auto。
    *    @value                        left                左侧
    *    @value                        top                 顶部
    *    @value                        auto                宽屏左侧，窄屏顶部
    * @property {String}               prefix-icon         输入框左侧字体图标类名
    * @property {String|Number}        scale               尺寸缩放比例，默认1。
    * @property {Boolean|String}       show-length         显示已输入字符长度，设置maxlength属性后有效，默认true。
    * @property {Boolean|String}       sign                对数据进行加密后提交，type为密码类型时有效，默认false。通过components.input.sign配置默认值，可通过components.input.getSignStr配置加密算法。
    * @property {String}               suffix-icon         输入框右侧字体图标类名
    * @property {Boolean|String}       trim                失去焦点时自动去除前后空格，默认false。
    * @property {String|Function}      value-type          提交表单值类型，指定后在提交表单之前会先转为对应类型。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。注意：在该函数内，this对象将始终指向当前页面对象。
    *    @value                        float               带小数点的浮点数
    *    @value                        int                 整数
    *    @value                        string              字符串
    *    @value                        boolean | bool      布尔值
    *    @value                        object              JSON对象
    *    @value                        array               数组
    *    @value                        timestamp           时间戳
    * 
    * @ ------------------------------------------
    * Props 表单校验属性
    * --------------------------------------------
    * @property {Boolean|String}       blur-check          失去焦点时触发表单校验，默认false，通过components.blurCheck来配置默认值。
    * @property {String}               confirm-name        比对相等的表单的name，通常用于确认密码、确认邮箱等验证场景。
    * @property {String}               empty-prefix        非空验证未通过时，提示语的前缀，默认为：请输入。
    * @property {String|Object}        error-msg           表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语，类型为object时，可定义多个校验提示。
    * @property {String}               error-type          校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。
    *    @value                        toast               消息提示框显示提示文字，大于15字时为模态弹窗
    *    @value                        underline           输入框的下方红字提示
    * @property {Number}               max                 最大值，用于数字类表单校验。
    * @property {Number}               maxlength           最大输入字符长度，超出后不可输入，-1为不限，默认-1。
    * @property {Number}               min                 最小值，用于数字类表单校验。
    * @property {Number}               minlength           最小输入字符长度，用于表单校验，-1为不限，默认-1。
    * @property {RegExp}               pattern             表单校验正则表达式，type属性无法满足校验需求时传入。
    * @property {Boolean|String}       required            必填项，默认true
    * @property {Boolean|String}       required-mark       显示必填标识，默认true
    * @property {String}               type                表单类型，用于限制用户输入以及表单校验，默认text。
    *    @value                        text                文本，原生类型
    *    @value                        number              数字，原生类型
    *    @value                        digist              带小数点的数字，原生类型
    *    @value                        idcard              身份证，原生类型，表单校验类型
    *    @value                        int                 整数，表单校验类型
    *    @value                        amount              金额，大于等于0，表单校验类型
    *    @value                        landline            座机，表单校验类型
    *    @value                        mobile              手机，表单校验类型
    *    @value                        telephone           座机或手机，表单校验类型
    *    @value                        email               邮箱，表单校验类型
    *    @value                        url                 http、https链接，表单校验类型
    *    @value                        carNo               车牌号，表单校验类型
    *    @value                        password            密码，原生类型
    *    @value                        weekPassword        弱密码，表单校验类型
    *    @value                        mediumPassword      中等强度密码，表单校验类型
    *    @value                        strongPassword      强密码，表单校验类型
    * @property {String}               validate-title      校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
    * @property {Function}             validator           表单校验函数，接收表单值value作为参数，若校验未通过需返回错误提示信息，校验通过时不返回任何信息。
    * 
    * @ ------------------------------------------
    * Props 原生属性
    * --------------------------------------------
    * @property {Boolean}              adjust-position     键盘弹起时，是否自动上推页面，默认true。
    * @property {Boolean}              autoBlur            键盘收起时，是否自动失去焦点，默认false，仅App 3.0.0+支持。
    * @property {Boolean}              confirm-hold        点击键盘右下角按钮时是否保持键盘不收起，默认false
    * @property {String}               confirm-type        键盘右下角确认按钮的文字
    *    @value                        send                发送
    *    @value                        search              搜索
    *    @value                        next                下一个
    *    @value                        go                  前往
    *    @value                        done                完成
    * @property {Number}               cursor              focus时的光标位置
    * @property {Number}               cursor-spacing      指定光标与键盘的距离，单位 px 。仅App、微信小程序、百度小程序、QQ小程序支持。
    * @property {Boolean}              hold-keyboard	      focus时，点击页面的时候不收起键盘，默认false。
    * @property {String}               placeholder         占位符
    * @property {String}               placeholder-class   指定 placeholder 的样式类
    * @property {String}               placeholder-style   指定 placeholder 的样式
    * @property {Number}               selection-end	      光标结束位置，自动聚集时有效，需与selection-start搭配使用
    * @property {Number}               selection-start     光标起始位置，自动聚集时有效，需与selection-end搭配使用
    */
	export default {
		name : "b-sinput" ,
		mixins:[ inputProps , uni.$b._mixins.form , uni.$b._mixins.requestList , uni.$b._mixins.media ] ,
		props:{
			hideOnblur : {
				type : [Boolean,String] ,
				default : true
			},
			searchKey :{
				type : String ,
				default : "keywords"
			},
			richValueKey:{
				type : String ,
				default : "richValue"
			},
			richRemarkKey :{
				type : String ,
				default : "richRemark"
			},
			emptySearch:{
				type : [Boolean,String] ,
				default : false
			},
			searchStatus:{
				type : [Boolean,String] ,
				default : true
			},
			maxHeight:{
				type : [Number , String , Array] ,
				default (){
					return 280 ;
				}
			},
			highlight:{
				type : [Boolean,String] ,
				default : true 
			},
			highlightColor:{
				type : String ,
				default : uni.$b.getValue("highlightColor" , "#e1251b")
			},
		},
		data() {
			return {
				rect : {} ,
				isKeepFocus : false ,
				searching : false ,
				timeout : null ,
				//顶部布局信息
				headerRect: {height:0},
				//底部布局信息
				footerRect:{height:0} 
			}
		},
		
		computed:{
			
			maxHeightSync(){
				return this.getUnitValue(this.maxHeight) ;
			},
			
			bodyMaxHeight(){
				let maxHeight = this.$b.parsePx(this.maxHeight) ;
				let bodyMaxHeight = maxHeight - this.headerRect.height - this.footerRect.height ;
				return  `${bodyMaxHeight}px` ;
			},
			
			loadDataOnCreated(){
				return false ;
			},
			
			highlightSync(){
				return uni.$b.isTrue(this.highlight) ;
			},
			
			searchStatusSync(){
				return uni.$b.isTrue(this.searchStatus) ;
			},
			
			emptySearchSync(){
				return uni.$b.isTrue(this.emptySearch) ;
			},
			
			isUsable(){
				return !!this.url && uni.$b.isTrue(this.usable) && this.isRemoteMode ;
			},
			
			/**
			 * 输入框是否处于屏幕下方
			 */
			isBottom(){
				return this.rect.bottom > uni.getSystemInfoSync().windowHeight - 290 ;
			},
			
			keywords(){
				// return this.parseByValueType() ;
				return this.$finalValue ;
			},
			
			listData(){
				let list = this.listSync.map((item,index)=>{
					item = uni.$b.isObject(item) ? item : {[this.valueKey] : item} ;
					let value = item[this.valueKey] ;
					let remark = item[this.remarkKey] ;
					let richValue = item[this.richValueKey] ;
					richValue = this.highlightSync ? this.getHighlightStr( value , this.keywords , richValue) : value ;
					let richRemark = item[this.richRemarkKey] ;
					richRemark = this.highlightSync ? this.getHighlightStr( remark , this.keywords , richRemark) : remark ;
					return { data: item , value , remark , richValue , richRemark , realIndex: index } ;
				}); 
				if (this.isLocalMode) {
					return list.filter(item=>{
						if(uni.$b.isNull(this.valueSync)){
							return true ;
						}
						let value = item[this.valueKey] ;
						let remark = item[this.remarkKey] ;
						return (value && value.toString().indexOf(this.valueSync) > -1 ) || (remark && remark.toString().indexOf(this.valueSync) > -1 ) ;
					}) ;
				}
				
				return list ;
			},
			
			finalParams(){
				let data = this.paramsSync;
				if (this.searchKey) {
					data[this.searchKey] = uni.$b.isNull(this.keywords) ? '' : this.keywords ;
				}
				return data ;
			},
			
			loadingSync(){ //不显示默认的loading状态
				return { show : false } ;
			},
			
		},
		
		
		methods: {
			
			_onInput(e){
				this.$changeValue(e);
				//过滤自动填充表单时触发的输入事件
				if (!this.focusSync) {
					return ;
				}
				//远程搜索
				this.loadDataOnce();
				//显示列表
				if (this.isLocalMode && this.listData.length > 0) {
					this.showPanel();
				}
			},
			
			/**
			 * 覆盖混入的changeValue()
			 */
			$changeValue(e){
				let value = e.detail.value ;
				this.valueSync = value ;
				this.$emit("input" , value);
				this.$emit("change" , e) ;
			},
			
			_onBlur(e){
				this.focusSync = false ;
				this.$emit("blur",e);
				if(uni.$b.isTrue(this.hideOnblur)){ //搜索列表淡出
					this.timeout = setTimeout( () => {
						this.$refs.searchList.hide();
					},200);
				}
			},
			
			choose( item , index ){
				clearTimeout(this.timeout) ;
				if (item.disabled === true) {
					this.keepFocus();
					return ;
				}
				this.$refs.searchList.hide( () => {
					let e = { detail : { data : item.data , index , value : item.value } } ;
					this.$changeValue(e);
					this.$emit("choose" , e );
				});
			},
			
			/**
			 * 当失去焦点时，强制保持焦点，而不触发其他任何聚焦行为
			 */
			keepFocus(){
				this.isKeepFocus = true ;
				this.focusSync = true ;
			},
			
			_onFocus(e){
				this.focusSync = true ;
				this.$emit("focus" , e) ;
				if (this.isKeepFocus) {
					this.isKeepFocus = false ;
					return ;
				}
				
				//若搜索结果列表为空，则不展示推荐面板
				if (this.listData.length == 0) {
					//若开启空值搜索，则进行远程搜索
					if (this.emptySearchSync) {
						this.loadDataOnce();
					}
					return ;
				}
				
				this.showPanel();
			},
			
			showPanel(){
				this.$refs.searchList.show(()=>{
					uni.$b.select("#header", this).then(rect=>{
						this.headerRect = rect ;
					})
					uni.$b.select("#footer", this).then(rect=>{
						this.footerRect = rect ;
					})
				});
			},
			
			_onClear(e){
				clearTimeout(this.timeout) ;
				this.$emit("clear");
			},
			
			_onConfirm(e){
				this.$emit("confirm",e);
			},
			
			_onKeyboardheightchange(e){
				this.$emit("keyboardheightchange",e);
			},
			
			//显示静态列表
			showStaticList(){
				if(!this.isLocalMode){
					return ;
				}
				this.showPanel();
			},
			
			handleLoadData(){
				if ( uni.$b.isNull(this.valueSync) && !this.emptySearchSync ) {
					this.$refs.searchList && this.$refs.searchList.hide();
					return false ;
				}
				
				if (this.searchStatusSync) {
					this.searching = true ;
				}
				
				//查询节点信息，计算列表面板的位置
				uni.$b.select( "#formItem" , this).then(res=>{
					this.rect = res ;
				});
			},
			
			success(res){
				this.listSync = uni.$b.getDeepVal( res , this.listKey , [] ) ;
				if(this.listSync.length > 0 && this.focusSync ){
					this.showPanel();
				}
			},
			
			complete(){
				this.searching = false ;
			},
			
			getHighlightStr(str , keywords , richText ){
				if (uni.$b.isNull(str) || !this.highlightSync ) {
					return str ;
				}
				if (uni.$b.notNull(richText)) {
					return richText ;
				}
				return str.toString().split(keywords).join(`<span style="color:${this.highlightColor};">${keywords}</span>`)  ;
			},
			
			//从推荐列表中删除数据
			remove( index , count = 1){
				clearTimeout(this.timeout);
				this.focusSync = true ;
				//删除全部
				if (count === -1) {
					this.listSync = [] ;
					return ;
				}
				//删除指定条数
				let realIndex = this.listData[index].realIndex ;
				this.listSync.splice(realIndex , count) ;
			}
		}
	}
</script>

<style lang="scss">
	.suggestions-box{
		margin-top: 5px;
		top: 100%;
		.suggestions{
			max-height: 280px;
			box-shadow: 0 3px 11px rgba(0,0,0,.1);
			color: #292827;
			border: 1px solid #e5e9f1;
			.suggestions-item{
				&.active{
					background-color: #f5f7fa;
					opacity: 1!important;
				}
			}
		}
		&.isBottom{
			margin-top: 0;
			margin-bottom: 5px;
			top: auto;
			bottom: 100%;
			.suggestions{
				box-shadow: 0 -3px 11px rgba(0,0,0,.1);
			}
		}
	}
	
	
	
	/* #ifdef H5 */
	.suggestions{
		.suggestions-item{
			&:hover{
				opacity: 0.9;
			}
			&.not-allowed{
				background-color: transparent ;
			}
		}
	}
	/* #endif */
</style>