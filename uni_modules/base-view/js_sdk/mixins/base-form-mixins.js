import baseFamilyMixins from "./base-family-mixins.js" ;
import labelProps from "../../components/b-label/label-props.js" ;

export default {
	mixins:[baseFamilyMixins , labelProps],
	props:{
		name : String ,
		setName : String ,
		value : {
			type : [String , Boolean , Number , Object , Array]  ,
			default : "" 
		},
		disabled:{
			type : [Boolean,String],
			default : undefined 
		},
		focus:{
			type : [Boolean,String],
			default : false 
		},
		valueType : [String , Function ] ,
		scale: [String , Number] ,
		validateTitle: String ,
		pattern: [String , RegExp] ,
		validator : [String , Function] ,
		confirmName: String ,
		blurCheck:{
			type : [String,Boolean] ,
			default : undefined
		},
		errorType:{//错误提示方式
			type : String ,
			validator(v){
				return uni.$b.isOneOf("error" , v , ['toast','underline']);
			}
		},
		emptyPrefix : String , //值为空时，提示信息的前缀
		errorMsg : [String,Object] , //校验失败时的提示语
		autoPlaceholder:{
			type : [String , Boolean],
			default : undefined
		},
		placeholderStyle: String ,
		placeholderClass: String ,
		placeholder: String ,
		sign:{
			type : [Boolean,String] ,
			default(){
				return uni.$b.getValue("components.form.sign" , false )
			}  
		}
	},
	data(){
		return {
			valueSync : "" ,
			errorTip : "" ,
			focusError : true , //聚焦输入框
			focusSync : false ,
			//blur时触发校验
			checkTimeout : null ,
			delayTimer : null 
		}
	},
	computed:{
		
		_titleWidth(){
			if(uni.$b.isNull(this.titleWidth) && !this.parent ){
				return 0 ;
			}
			let width = this.extendProp("titleWidth" , 65 , "components.label.titleWidth") ;
			return Number( width ) ;
		},
		
		_titleStyle(){
			return uni.$b.getStyle({
				'height' : `${this._scale * 80}rpx` 
			} , this.titleStyle ) ;
		},
		
		async _pattern(){
			let root = await uni.$b.getRoot() ;
			if ( uni.$b.notNull(this.pattern) && uni.$b.isString(this.pattern) ) {
				let pattern = root[this.pattern] ;
				if (uni.$b.isReg(pattern)) {
					return pattern ;
				}
				//自动将其转为正则
				return new RegExp( this.pattern , "g" ) ;
			}
			
			return this.pattern ;
		},
		
		async _validator(){
			let validator = this.validator ;
			let root = await uni.$b.getRoot() ;
			if (uni.$b.notNull(validator) && uni.$b.isString(validator)) {
				validator = root[validator] ;
			}
			if (uni.$b.isFn(validator)) {
				//绑定为当前页面的对象
				return validator.bind(root) ;
			}
		},
		
		//是否禁用
		_disabled(){
			return uni.$b.isTrue(this.extendProp("disabled" , false )) ;
		},
		
		//是否有值
		hasValue(){
			return !uni.$b.isEmpty(this.valueSync) ;
		},
		
		//是否必填
		_required(){
			return !this.disabled && uni.$b.isTrue(this.extendProp("required" , true , "components.required")) ;
		},
		//是否显示必填标识
		_requiredMark(){
			return !this.disabled && uni.$b.isTrue(this.extendProp("requiredMark" , true , "components.requiredMark")) ;
		},
		//是否blur时校验
		_blurCheck(){
			return uni.$b.isTrue(this.extendProp("blurCheck" , true , "components.blurCheck")) ;
		},
		//值为空时校验提示语前缀
		_emptyPrefix(){
			return this.emptyPrefix || uni.$b.localeB("validate.prefix") ; //供其他组件覆盖
		},
		//自动占位提示
		_placeholder(){
			let {isTrue,isNull} = uni.$b ;
			let autoPlaceholder = this.extendProp("autoPlaceholder" , true , "components.autoPlaceholder") ;
			let prefix = this._emptyPrefix ;
			return isTrue(autoPlaceholder) && isNull(this.placeholder) && !isNull(this.title) ? `${prefix}${this.title}` : this.placeholder ;
		},
		//尺寸比例大小
		_scale(){
			return Number(this.extendProp("scale" , 1 )) ;
		},
		//表单类型（校验类型）
		_type(){
			return this.type ; //供子组件覆盖
		},
		_errorMsg(){
			return this.errorMsg ;
		},
		//校验失败提示方式
		_errorType(){
			return this.extendProp("errorType" , "totast" , "components.errorType") ;
		},
		//值的长度
		length(){
			return uni.$b.isNull(this.valueSync) ? 0 : (this.valueSync+'').length ;
		},
		//值类型
		_valueType(){
			let valueType = this.valueType ;
			return this._parseValueType(valueType);
		},
		$finalValue(){
			return this.valueSync ;
		}
	},
	watch:{
		
		/**
		 * @description 监听传入的value，赋值给valueSync，并上报给form组件
		 */
		value:{
			handler(value , oldValue){
				if(this.valueSync !== this.value){
					this.valueSync = this._handleValueSet(this.value);
					this.setFormData();
				}
			},
			immediate : true 
		},
		
		/**
		 * 外部传入的focus，是否聚焦，进行同步更新
		 */
		focus:{
			handler(){
				this.focusSync = uni.$b.isTrue(this.focus) ;
			},
			immediate : true 
		}
	},
	
	async created(){
		this.parent = this.getParent(/^b-.*?form$/) ;
		this.parent && this.parent._setDataByName(this);
		
		this.validate = uni.$b.once( this.validate , 100 ) ;
		
		this.pageVm = await uni.$b.getRoot() ;
	},
	
	methods: {
		
		_parseValueType(valueType){
			let types = ["float","int","string",'boolean','bool','object','json','timestamp','startTimestamp','endTimestamp','startTime','endTime','array','joinString'] ;
			if ( uni.$b.isNull(valueType) || types.indexOf( valueType ) > -1 ) {
				return valueType ;
			}
			//获取页面对象
			if (uni.$b.isString(valueType)) {
				//获取页面内的转换函数
				valueType = this.pageVm[valueType] ;
			}
			return valueType ;
		},
		
		_bindModel(value){
			this.$emit("input" , value);
		},
		
		$changeValue(e , fillDataDelay){
			let value = e.detail.value ;
			this.valueSync = value ;
			this._bindModel(this.valueSync);
			e.detail.finalValue = this.$finalValue ;
			this.handleValueChange(e);
			this.$emit("change" , e);
			//向父级form传值
			let datas = this.setFormData();
			if (this.errorTip) {
				this.validate(datas);
			}
		},
		
		/**
		 * @description 子组件覆盖使用
		 * @param {Object} e
		 */
		handleValueChange(e){},
		
		_setValue(value){
			value = this._handleValueSet(value);
			this.$changeValue({detail:{value}});
		},
		
		/**
		 * @description 在form组件设置value之前的处理动作
		 * @return value
		 */
		_handleValueSet(value){ 
			return value ;
		},
		
		_handleFocus(e){},
		
		_onFocus(e){
			let isContinue = this._handleFocus(e);
			if (isContinue === false) {
				return ;
			}
			this.focusSync = true ;
			e.detail.value = this.$finalValue ;
			this.$emit("focus" , e) ;
		},
		
		_handleBlur(e){},
		
		_onBlur(e){
			let isContinue = this._handleBlur(e);
			if (isContinue === false) {
				return ;
			}
			this.focusSync = false ;
			e.detail.value = this.$finalValue ;
			this.$emit("blur",e);
			//向父级form传值
			let datas = this.setFormData();
			
			this.delayTimer = setTimeout(e => {
				//触发校验时留有一定时间，某些场景可用以取消校验
				if (this._blurCheck){
					this.validate(datas);
				}
				this.$onDelayBlur();
			} , 200);
		},
		
		$onDelayBlur(){},
		
		validate(datas){
			let formDatas = datas ;
			if (!datas) {
				formDatas = {
					[this.name] : this.getFormData()
				};
			}
			let {valid , msg} = uni.$b.validate( formDatas , this.name ) ;
			if (valid){
				this.errorTip = '' ;
				return {valid , msg};
			}
			this.showError(msg);
			return {valid , msg};
		},
		
		/**
		 * @description 显示校验结果错误提示信息
		 * @param {String} msg 校验错误提示
		 * @param {Boolean} focus 是否滚动聚焦到当前表单，提供给父级form组件使用
		 */
		showError(msg , focus){
			if (this._errorType === 'toast') {
				uni.$b.showTips(msg);
			}else{
				this.errorTip = msg ;
			}
			if (!focus) return ;
			if (this.focusError) {
				this.focusSync = false ;
				this.$nextTick(()=>{
					this.focusSync = true ;
				});
			}
			// uni.$b.scrollTo({
			// 	selector : "#formItem" , 
			// 	top : uni.$b.getSafeArea().height/3 , 
			// 	duration : 100 
			// }, this) ;
		},
		
		setFormData(){
			if (!this.parent || !this.name) return ;
			return this.parent._setValue({
				name : this.name ,
				value : this.$finalValue
			});
		},
		
		getFormData(){
			return {
				_uid : this._uid , //排序使用
				componentName : this.$options.name ,
				name:this.name , 
				setName:this.setName , 
				value:this.$finalValue , 
				type: this._type ,
				valueType : this._valueType ,
				required:this._required,
				title: this.validateTitle || this.title , 
				prefix: this._emptyPrefix , 
				pattern:this._pattern , 
				validator:this._validator , 
				valueFilter:this.valueFilter , 
				minlength:this._minlength , 
				maxlength:this._maxlength , 
				min: uni.$b.isNumber(this.min) ? parseFloat(this.min) : '' ,
				max: uni.$b.isNumber(this.max) ? parseFloat(this.max) : '' ,
				errorMsg : this._errorMsg ,
				confirmName : this.confirmName ,
				sign : uni.$b.isTrue(this.sign) 
			};
		}
	}
}