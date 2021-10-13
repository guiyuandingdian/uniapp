<template>
	<view class="b-btn" :class="outerClass" v-if="isShow">
		
		<view class="father noBreak">
			
			<button class="btn" :class="className" :style="style" :loading="showLoadingSync" @tap="onTap" hover-class="op9">
				
				<!-- loading状态 -->
				<block v-if="showLoadingSync && loadingTextSync">
					<view :class="{'clip' : !!uvs.width}">
						{{loadingTextSync}}
					</view>
				</block>
				<block v-else>
					
					
					<!-- 按钮提示文字 -->
					<b-animate 
						v-if="showCompleteStatus"
						in-class="fadeInDownSm" 
						out-class="fadeOutUpSm" 
						:stay-time="duration - 200" 
						:is-show="showCompleteStatus"
						@change="onCompleteChange">
						
						<text class="mr5" :class="state == 'ok' ? 'bIcon-okFill' : 'bIcon-warnFill'"></text>
						{{completeMsg}}
						
					</b-animate>
					
					
					<block v-else-if="showCounter">
						
						<b-countdown
							:deadline="deadline" 
							fields="second" 
							:second="countdownUnit" 
							@stop="_onCounterStop"></b-countdown>
						
					</block>
					
					
					<block v-else>
						
						<text class="mr5" :class="leftIcon" v-if="leftIcon"></text>
						<view :class="{'clip' : !!uvs.width}">
							<slot></slot>
						</view>
						<text class="ml5" :class="rightIcon" v-if="rightIcon"></text>
						
					</block>
					
					
				</block>
				
			</button>
			
			
			<!-- 原生属性插槽 -->
			<view class="abs op0" v-if="$slots.cover">
				<slot name="cover"></slot>
			</view>
			
			
		</view>
		
		
		
		<!-- 消息提示框 -->
		<b-message 
			:value="completed && _msgType == 'message' " 
			:duration="duration" 
			:show-close="showClose" 
			:content="completeMsg" 
			:type="state"
			@change="onCompleteChange"></b-message>
		
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	import familyMixins from "../../js_sdk/mixins/base-family-mixins.js";
	import requestMixins from "../../js_sdk/mixins/base-request-mixins.js";
	/**
	* @description Btn 按钮，可灵活自定义样式的按钮，在发送异步请求，提交表单等场景使用，开启权限验证后，无权限时将不展示给用户。可完成发送请求、loading状态、服务端响应反馈等交互流程。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/btn
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                                    default     默认插槽，定义按钮的文字等。
	* @slot                                    cover       完全覆盖在按钮上不可见的插槽，用于插入一个button，进而使用原生button的原生属性的场景。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                     click       点击事件 | 参数：( event )
	* @event    {Function}                     loading     开始发送异步请求 | 参数：--
	* @event    {Function}                     load        异步请求结束 | 参数：( res )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                                  loadData()  发送异步请求，配置url接口地址后有效。将触发@loading、@load事件。 ( data )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               disabled    按钮禁用状态，默认false。
	* @property {Boolean|String}               exclusive   当前按钮发送异步请求时，页面内的其他按钮将进入禁用状态直到本次请求结束，默认false，可通过修改配置文件配置components.btn.exclusive来修改默认值。
	* @property {String}                       form-type   操作表单类型
	*    @value                                submit      提交表单
	*    @value                                reset       重置表单，可搭配justForm属性使用。
	*    @value                                validate    校验表单
	*    @value                                clearError  清除表单校验提示信息
	* @property {String}                       left-icon   左侧图标类名，如bIcon-delete
	* @property {String}                       right-icon  右侧图标类名，如bIcon-editSquare
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 异步请求属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       auth-url    权限验证地址，无值时将使用url进行校验。
	* @property {Boolean|String}               check-auth  校验权限，无权限时不显示按钮，默认false，可通过配置文件配置checkAuth来修改默认值。
	* @property {String}                       confirm     发送异步请求之前的确认提示文字，为空时将不确认直接发送请求。
	* @property {Number}                       duration    按钮执行远程请求、提交表单操作，服务端返回ok状态后，按钮显示响应结果信息的持续时间，单位ms，默认2000，不显示响应结果信息时可设置为-1。
	* @property {Boolean|String}               handled     执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	* @property {String}                       loading-text 发送远程请求loading状态时显示的文字
	* @property {String|Array}                 loading-type 【响应式属性】 发送远程请求时显示loading状态的样式，默认icon，可通过配置文件配置components.btn.loadingType来修改默认值。
	*    @value                                icon        在按钮文字左侧显示loading图标
	*    @value                                toast       在页面中心位置显示loading toast。
	*    @value                                none        不显示loading状态
	* @property {String}                       method      请求方式，api-type为http时有效，默认get。
	*    @value                                get         GET请求
	*    @value                                post        POST请求
	* @property {String|Array}                 msg-type    【响应式属性】 请求成功结果反馈提示类型，当返回的msg信息为空时任何类型都不会提示，默认auto，可通过配置文件配置components.btn.msgType来修改默认值。
	*    @value                                toast       toast提示
	*    @value                                icon        结合icon图标在按钮上提示
	*    @value                                message     message提示框提示，超过15个字时message不会自动消失，需用户手动关闭。
	*    @value                                auto        4个字以内用icon，7个字以内用toast，其他用message
	*    @value                                none        不提示
	* @property {Boolean|String}               page-params 发送远程请求时，是否自动携带当前页面的参数，默认false。
	* @property {Object}                       params      发送远程请求时携带的参数，参数也可以自行追加到url参数中噢~
	* @property {String}                       result-icon 按钮执行远程请求、提交表单操作，服务端返回ok状态后，按钮显示响应结果时的左侧图标，默认为bIcon-ok。
	* @property {String}                       url         发送远程请求接口地址
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 跳转属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       href        跳转链接，应用内部链接需以/pages开头，外链需以http://、https://开头。
	*    @value                                /pages/     应用内部链接
	*    @value                                http://     外链
	*    @value                                https://    外链
	* @property {String}                       open-type   跳转链接打开方式，默认navigateTo。
	*    @value                                navigateTo  保留当前页，打开新页面。
	*    @value                                redirectTo  关闭当前页面，打开新页面。
	*    @value                                reLaunch    关闭全部页面，打开新页面。
	*    @value                                switchTab   跳转到tabbar页面
	*    @value                                navigateBack 关闭当前页面，返回上一页，此时href属性表示无法返回上一页时，跳转的页面。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       background-img 背景图或渐变背景色，is-plain为false时有效。
	*    @value                                linear-gradient() 渐变背景色，使用时需自行定义颜色、渐变方向
	*    @value                                url()       背景图，使用时需定义背景图片链接
	* @property {String}                       color       按钮的颜色，决定背景颜色、阴影颜色，默认为主题色，可通过配置文件配置components.mainColor修改默认值。
	*    @value                                #e1251b     红色
	*    @value                                #f69c00     黄色
	*    @value                                #FF6D8A     粉色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {Boolean|String}               is-plain    镂空按钮，默认false。
	* @property {String|Number|Array}          min-width   【响应式属性】 最小宽度
	* @property {String|Number|Array}          plr         【响应式属性】 按钮的左右内边距
	* @property {String|Number|Array}          ptb         【响应式属性】 按钮的上下内边距
	* @property {String|Number|Array}          radius      【响应式属性】 按钮的圆角
	* @property {Boolean|String}               shadow      显示阴影，默认true，阴影颜色由color属性定义。
	* @property {String}                       text-color  按钮文字颜色
	*    @value                                #fff        白色
	*    @value                                #000        黑色
	*    @value                                #e1251b     红色
	*    @value                                #f69c00     黄色
	*    @value                                #FF6D8A     粉色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String|Array}                 type        【响应式属性】 按钮样式类型，默认btn。
	*    @value                                btn         常规按钮，宽度随内容变化
	*    @value                                block       铺满的按钮，宽度铺满父级
	*    @value                                text        纯文字类型的按钮
	* @property {String|Number|Array}          width       【响应式属性】 宽度
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 倒计时属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               countdown   是否开启倒计时，默认false。
	* @property {String}                       countdown-key 倒计时时间本地存储的键名，默认sendSms。
	*    @value                                sendSms     发送短信
	*    @value                                sendLoginSms 发送登录短信
	*    @value                                sendRegistSms 发送注册短信
	*    @value                                sendPswSms  发送修改密码短信
	*    @value                                other       其他自定义的键名…
	* @property {String|Number}                countdown-time 倒计时时长，单位秒，默认60。
	* @property {String}                       countdown-unit 倒计时秒数后面的单位，默认s。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他交互属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       api-type    服务端接口类型，默认uniCloud，可通过配置文件配置request.apiType来修改默认值。
	*    @value                                uniCloud    云开发接口
	*    @value                                http        常规服务端接口，如java、php、python等语言开发的接口。
	* @property {Boolean|String}               cache       发送远程请求时进行本地缓存，默认false。
	* @property {Object}                       header      请求的header，header 中不能设置 Referer，App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Number}                       loading-delay 发送远程请求后多久没有收到响应结果时显示loading状态，loading-type为toast时有效。
	* @property {Boolean|String}               loading-mask loading状态时显示防止触摸穿透的遮罩层，loading-type为toast时有效。
	* @property {Number}                       rate        点击按钮发送远程请求后多长时间内不允许再次点击（计时结束前再次点击将重新计时），单位ms，默认1000。
	* @property {Boolean|String}               usable      发送远程请求接口是否可用，传入url属性后有效，默认true。
	* 
	* @property {String}                       ref          获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-btn",
		mixins:[ familyMixins , requestMixins , mediaMixins ] ,
		props:{
			type:{
				type : [String,Array] ,
				default : "btn"
			},
			color:{
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor") ;
				}
			},
			textColor:String,
			backgroundImg:String,
			width:[Number , String , Array],
			minWidth: {
				type : [Number , String , Array],
				default(){
					return uni.$b.getValue("components.btn.minWidth")
				}
			},
			radius:[Number , String , Array],
			ptb:[Number , String , Array],
			plr:[Number , String , Array],
			isPlain:[Boolean,String] ,
			href:String,
			openType:{
				type : String ,
				default : "navigateTo"
			},
			shadow:{
				type : [Boolean,String] ,
				default : true 
			},
			formType:{
				validator(v){
					return uni.$b.isOneOf("formType" , v , ["validate",'reset','submit','clearError',"loadData"]);
				}
			},
			rightIcon:String ,
			leftIcon:String ,
			rate:{
				type : [Number,String] ,
				default : 1000
			},
			countdownTime:{
				type : [Number,String] ,
				default : 60
			},
			countdown:[String,Boolean],
			countdownKey:{
				type : String ,
				default : "sendSms"
			},
			countdownUnit:{
				type : String ,
				default : "s"
			},
			loadingText: String ,
			loadingMask:{
				type : [Boolean,String] ,
				default : false
			},
			loadingDelay:{
				type : Number ,
				default(){
					return uni.$b.getValue("call.loading.time")
				}
			},
			loadingType: [String,Array] ,
			msgType : [String,Array] ,
			duration :{ //请求成功反馈结果持续时间
				type : Number ,
				default : 2000
			},
			disabled:{
				type : [Boolean,String] ,
				default : false
			},
			exclusive:{
				type : [Boolean,String] ,
				default(){
					return uni.$b.getValue("components.btn.exclusive")
				}
			},
			confirm:String 
		},
		data() {
			return {
				hangUp : false ,
				completed : false ,
				completeMsg : "" ,
				resultTimeout : null ,
				holdingTimeout : null ,
				holding : false ,
				textDuration : 0 ,
				state : 'ok' ,
				showCounter : false ,
				deadline : ""
			}
		},
		computed:{
			
			uvs(){
				return this.getUvs("minWidth","width","ptb","plr")
			},
			
			isShow(){
				let disabled = !!this.formType && this.parent && uni.$b.isTrue(this.parent.disabled) ;
				let noFormAuth = this.formType == 'submit' && this.parent && !this.parent.hasSubmitAuth ;
				return this.hasAuth && !disabled && !noFormAuth ;
			},
			
			_type(){
				return this.dv(this.type) ;
			},
			
			_textColor(){
				if (uni.$b.notNull(this.textColor)) {
					return this.textColor ;
				}
				return this.hasBg ? uni.$b.getValue("components.mainInverse") : this.color ;
			},
			
			outerClass(){
				return `b-btn-${this._type}` ;
			},
			
			loadingTextSync(){
				return uni.$b.isNull(this.loadingText) ? uni.$b.localeB("loadingText") : this.loadingText ;
			},
			
			isText(){
				return this._type == 'text' ;
			},
			
			hasBg(){
				return !this.isText && !uni.$b.isTrue(this.isPlain) ;
			},
			
			_loadingType(){
				let type = this.dv(this.loadingType) ;
				if (type) {
					return type ;
				}
				return this._type == 'block' ? 'icon' : 'toast' ;
			},
			
			_msgType(){
				let msg = this.completeMsg ;
				if ( uni.$b.isNull(msg) || this.duration <= 0 ) {
					return 'none' ;
				}
				let type = this.dv(this.msgType) ;
				if (type != 'auto') {
					return type || (this.isPc ? 'toast' : 'message') ;
				}
				if (msg.length <= 4) {
					return "icon" ;
				}
				if (msg.length <= 14) {
					return "toast" ;
				}
				return "message" ;
			},
			
			showLoadingSync(){
				return this._loadingType == 'icon' && ( this.isLoading || this.holding ) ;
			},
			
			shadowSync(){
				return uni.$b.isTrue(this.shadow) && !this.isText ;
			},
			
			className(){
				return uni.$b.getClassName({
					'btn-block' : this._type == 'block' ,
					'btn-text' : this._type == 'text' ,
					'disabled' : this._disabled 
				});
			},
			
			style(){
				let shadowOffset = !this.hasBg ? '0 0 9px -3px' : '0 5px 16px -9px' ;
				return uni.$b.getStyle({
					'background-color' : this.hasBg ? this.color : '' ,
					'background-image' : this.hasBg ? this.backgroundImg : '' ,
					'color' : this._textColor ,
					'padding-left' : this.uvs.plr ,
					'padding-right' : this.uvs.plr ,
					'padding-top' : this.uvs.ptb ,
					'padding-bottom' : this.uvs.ptb ,
					'border' : !this.isText && uni.$b.isTrue(this.isPlain) ? `1px solid ${this.color}` : '' ,
					'width' : this.uvs.width ,
					'min-width' : this.uvs.minWidth ,
					'border-radius' : this.uv(this.radius) ,
					'box-shadow' : this.shadowSync ? `${shadowOffset} ${this.color} ` : ''  
				});
			},
			
			isManualTrigger(){
				return true ;
			},
			
			loadDataOnCreated(){
				return false ;
			},
			
			isUsable(){ 
				return !!this.url && !this._disabled ;
			},
			
			$loading(){
				return {
					show : this._loadingType == 'toast' ,
					title : this.loadingText ,
					time : this.loadingDelay ,
					mask : this.loadingMask
				};
			},
			
			isApi(){
				return uni.$b.notNull(this.url) ;
			},
			
			isSubmit(){
				return this.formType === 'submit' ;
			},
			
			_disabled(){
				return uni.$b.isTrue(this.disabled) || this.isLoading || this.hangUp || this.showCounter ;
			},
			
			showClose(){
				return !!this.completeMsg && this.completeMsg.length > 14 ;
			},
			
			failSync(){
				return false ;
			},
			
			showCompleteStatus(){
				return this.completed && this._msgType == 'icon' ;
			},
			
			$handled(){
				return false ;
			}
		},
		
		created() {
			this.parent = this.getParent(/^b-.*?form$/) ;
			this.submitForm = uni.$b.once( this.submitForm , Number(this.rate) , true ) ;
			this.request = uni.$b.once( this.loadData , Number(this.rate) , true ) ;
			
			//倒计时
			this._startCounter();
			
			uni.$on("baseBtnHangUp", this._watchHangUp );
		},
		
		beforeDestroy() {
			uni.$off("baseBtnHangUp", this._watchHangUp );
		},
		
		methods: {
			
			_watchHangUp(){
				this.hangUp = hangUp ;
			},
			
			onTap(e){
				if (this._disabled) {
					return ;
				}
				this.$emit("click" , e);
				// #ifdef H5 || APP-PLUS
				this.$emit("tap" , e);
				// #endif
				//请求API接口
				if (this.isApi) {
					this.requestApi(e);
					return ;
				}
				//提交表单
				if (this.isSubmit) {
					this.submitForm(e);
					return ;
				}
				//重置表单、重置结果面板、校验表单、清空校验失败结果
				if (!uni.$b.isNull(this.formType)) {
					this.parent[this.formType]();
					return ;
				}
				if ( uni.$b.notNull(this.href) ) {
					uni.$b.open({
						url : this.href ,
						params : this.params ,
						openType : this.openType
					})
				}
			},
			
			async submitForm(){
				if (!this.parent) {
					throw new Error("b-btn组件应放置于b-form组件内");
				}
				let preRes = await this.parent._preSubmit() ;
				
				if (preRes.type != 'submiting') {
					return ;
				}
				this.isLoading = true ;
				this.holdLoading();
				await this.parent.submit({
					loading : this.$loading ,
					submitData : preRes.data 
				});
				this.isLoading = false ;
			},
			
			_showResult(data){
				//计算msg、state
				this.completeMsg = uni.$b._getMsg(data) ;
				let isOk = !uni.$b._isFailState(data) ;
				this.state = isOk ? 'ok' : 'fail' ;
				if(uni.$b.isFalse(this.handled)){
					return ;
				}
				
				//业务执行成功则返回success
				if(isOk){
					this.$emit("success" , data);
				}
				
				if ( this._msgType == 'none' ) {
					return  ;
				}
				
				if( this._msgType == 'message' ){
					this.completed = true ;
					return ;
				}
				
				uni.$b.showTips(this.completeMsg , isOk ? 'success' : 'none' ) ;
			},
			
			_startCounter(){
				if (!uni.$b.isTrue(this.countdown)) {
					return ;
				}
				let deadline = uni.getStorageSync(this.countdownKey) ;
				this.deadline = deadline ;
				this.showCounter = !!deadline ;
			},
			
			_onCounterStop(){
				this.showCounter = false ;
				uni.removeStorageSync(this.countdownKey);
			},
			
			onCompleteChange(isShow){
				if (!isShow) {
					this.completed = false ;
				}
			},
			
			/**
			 * 当显示loading图标时，如果请求响应速度较快会出现loading图标闪一下的问题
			 * 通过holdLoading来让loading状态持续至少400ms，避免闪一下的问题
			 */
			holdLoading(){
				if (this._loadingType != 'icon') {
					return ;
				}
				clearTimeout(this.holdingTimeout);
				this.holding = true ;
				this.holdingTimeout = setTimeout((res)=>{
					this.holding = false ;
				},400);
			},
			
			requestApi(e){
				if (!this.confirm) {
					this.request();
					return ;
				}
				this.$b.showModal({
					content: this.confirm ,
					success : (e)=>{
						if (e.confirm) {
							this.request() ;
						}
					}
				});
			},
			
			handleLoadData(){
				if(uni.$b.isTrue(this.exclusive)){
					uni.$emit("baseBtnHangUp" , true);
				}
				this.holdLoading();
			},
			
			//请求成功
			success(res){
				this._showResult(res);
				//开启计时器
				let isOk = uni.$b._isOkState(res) ;
				if (isOk && uni.$b.isTrue(this.countdown)) {
					let deadline = Date.now() + Number(this.countdownTime) * 1000 ;
					uni.setStorageSync(this.countdownKey , deadline );
					this._startCounter();
				}
			},
			
			complete(){
				if(uni.$b.isTrue(this.exclusive)){
					uni.$emit("baseBtnHangUp" , false);
				}
			}
		}
	}
</script>
<style lang="scss">
	
	/* #ifndef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU */
	.b-btn{
		 vertical-align: middle;
	}
	/* #endif */
	
</style>