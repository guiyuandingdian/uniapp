const formElements = [
	"b-input","b-sinput","b-radio","b-checkbox","b-select","b-datepicker","b-selects",
	"b-textarea","b-switch","b-maker","b-img-upload","b-number","b-picker","b-rate","b-transfer"
];
import baseFamilyMixins from "../../js_sdk/mixins/base-family-mixins.js" ;
import requestDataMixins from "../../js_sdk/mixins/base-request-data-mixins.js" ;

export default {
	mixins:[ requestDataMixins , baseFamilyMixins ],
	props:{
		action:{
			type : String 
		},
		focusError:{ //提交表单校验错误时，是否将页面滑动并聚焦到该表单
			type : [String,Boolean] ,
			default : true 
		},
		blurCheck:{ //表单失去焦点时校验
			type : [String,Boolean] ,
			default : undefined
		},
		errorType: String ,
		autoReset:{ //提交表单成功后是否自动清空表单"all","justForm","none"
			type : String ,
			default : "none"
		},
		titleClass : [String,Array] ,
		titleWidth : [String , Number] ,
		requiredMark: {
			type : [String,Boolean] ,
			default : undefined
		},
		required: {
			type : [String,Boolean] ,
			default : undefined
		},
		align: String,
		position:[String,Array],
		autoPlaceholder:{
			type : [String , Boolean],
			default : undefined
		},
		disabled:{
			type : [Boolean,String],
			default : undefined 
		},
		scale:{
			type : [String , Number],
			default : 1 
		},
		extraData : {
			type :  [String , Boolean] ,
			default : false 
		},
		next : String,
		confirm : String
	},
	data() {
		return {
			valueSync : {} ,
			dataToSet : {} ,
			childrenData : {} ,
			res : {} ,
			setNames : {}
		}
	},
	
	computed:{
		hasSubmitAuth(){
			return !uni.$b.isTrue(this.checkAuth) || uni.$b.hasAuth( this.authUrl || this.action) ;
		},
		canSubmit(){
			return !!this.action && this.hasSubmitAuth ;
		},
		_extraData(){
			return uni.$b.isTrue(this.extraData) ;
		}
	},
	
	async created(){
		this.rootVm = await uni.$b.getRoot();
	},
	
	methods: {
		
		/**
		 * 子组件值发生变化时调用该方法，将值同步给父级
		 * @param {Object} data 表单数据
		 */
		_setValue(data){
			let {name,value} = data ;
			if (!name) return ;
			this.$set( this.valueSync , name , value ) ;
			this._onDataChange(name , value);
		},
		
		_onDataChange(name , value){
			this.$emit("change" , { name , value , formData : uni.$b.clone(this.valueSync) }) ;
		},
		
		/**
		 * @description 赋值给form组件以及name对应的子表单组件
		 */
		setData( data ){
			if (!uni.$b.isObject(data) || uni.$b.isEmptyObject(data) ) {
				return ;
			}
			let datas = uni.$b.clone(data) ; //深度拷贝
			this.dataToSet = uni.$b.deepMerge( {} , this.dataToSet , datas) ;
			
			//表单元素赋值
			this._getChildren().forEach(child =>{
				this._setDataByName(child , datas);
			})
			
			//收集其他未被填入valueSync中的表单数据
			this._getFormData();
			
			//额外表单值
			if (this._extraData) {
				//将所有的数据暂存
				this.valueSync = uni.$b.deepMerge( {} , this.valueSync , datas ) ;
			}
			
			this._onDataChange() ;
		},
		
		_setDataByName(child , datas){
			let name = child.setName || child.name ;
			let value = uni.$b.getDeepVal( datas , name ) ;
			if (undefined !== value) {
				child._setValue(value) ;
				this._onDataChange(name , value) ;
			}
		},
		
		$handleSuccess(res){
			this.reset();
			this.setData(this.data);
			this.$emit("dataLoad" , res );
		},
		
		/**
		 * @description 清空表单
		 */
		reset(){
			this._getChildren().forEach(child => {
				if (!uni.$b.isTrue(child.hidden)) {
					child._setValue("");
				}
			});
			this.dataToSet = {} ;
			this.valueSync = {} ;
			this._getFormData();
			this.$emit("reset" , this.valueSync );
		},
		
		/**
		 * @description 清空错误信息
		 */
		clearError(){
			let children = this._getChildren();
			children.forEach(child=>{
				child.errorTip = "" ;
			});
		},
		
		
		/**
		 * @description 表单校验
		 * @return {Object} res
		 *     @value  valid  是否校验成功
		 * 	   @value  msg    提示信息	
		 * 	   @value  name   表单的name	
		 */
		validate(theName){
			//重新收集表单数据【childData、valueSync】
			this._getFormData();
			this._parseChildValue();
			let { valid , msg , name } = uni.$b.validate( this.childrenData , theName) ;
			if (!valid) {
				let child = this._getChildByName({name}) ;
				child && child.showError( msg , uni.$b.isTrue(this.focusError) );
			}
			return { valid , msg , name } ;
		},
		
		_transByValueType(key){
			let originValue = this.valueSync[key] ;
			let childData = this.childrenData[key] ;
			if (!childData) {
				return originValue ;
			}
			
			let value = uni.$b.isObject(originValue) || uni.$b.isArray(originValue) ? uni.$b.clone(originValue) : originValue ;
			
			//数据类型
			let valueType = childData.valueType ;
			let theValue = this.parseByType( key , value , valueType ) ;
			
			//数据加密
			let sign = uni.$b.getValue("components.form.getSignStr") ;
			if ( uni.$b.notNull(theValue) && childData.sign && uni.$b.isFn(sign)) {
				theValue = sign( theValue , key) ;
			}
			
			return theValue ;
		},
		
		parseByType( key , value , valueType ){
			if (uni.$b.isNull(valueType)) {
				return value ;
			}
			
			//转换函数
			if (uni.$b.isFn(valueType)) {
				return valueType.call( this.rootVm , value , key );
			}
			
			//空值
			if (uni.$b.isNull(value)) {
				if (valueType == 'object') {
					return {} ;
				}
				if (valueType == 'array') {
					return [] ;
				}
				return "" ;
			}
			
			if (valueType == 'int') {
				return parseInt(value);
			}
			if (valueType == 'float') {
				return parseFloat(value);
			}
			if ( (valueType == 'boolean' || valueType == 'bool') && uni.$b.isBoolean(value)) {
				return uni.$b.isTrue(value) ;
			}
			if ( ( (valueType == 'object' || valueType == 'json') && uni.$b.isJsonStr(value) ) || (valueType == 'array' && uni.$b.isArrayStr(value) ) ) {
				return JSON.parse(value) ;
			}
			if (valueType.toLowerCase().indexOf("time") > -1) {
				let v = uni.$b.parseDate(value) ;
				if (!uni.$b.isDate(v)) {
					return value ;
				}
				if ( valueType == 'timestamp' ) {
					return v.getTime() ;
				}
				if ( valueType == 'startTimestamp' ) {
					return v.setHours(0,0,0,0) ;
				}
				if ( valueType == 'endTimestamp' ) {
					return v.setHours(23,59,59,999) ;
				}
				if ( valueType == 'startTime' ) {
					v.setHours(0,0,0,0) ;
					return uni.$b.format( v , "seconds" ) ;
				}
				if ( valueType == 'endTime' ) {
					v.setHours(23,59,59,999) ;
					return uni.$b.format( v , "seconds" ) ;
				}
			}
			
			if( valueType == 'string'){
				return uni.$b.isArray(value) || uni.$b.isObject(value) ? JSON.stringify(value) : value + '' ;
			}
			
			if( valueType == 'joinString' && uni.$b.isArray(value)){
				return value.join(",") ;
			}
			
			return value ;
		},
		
		_getSubmitData(){
			//重新收集表单数据【childrenData、valueSync】
			this._getFormData();
			let data = {} ;
			for (let key in this.valueSync) {
				let childData = this.childrenData[key] ;
				//childData不为空时为表单元素数据，_extraData表示接收外部数据
				if (!!childData || this._extraData ) {
					data[key] = this._transByValueType(key) ;
				}
			}
			return data ;
		},
		
		_parseChildValue(){
			for(let key in this.childrenData){
				this.childrenData[key].value = this._transByValueType(key) ;
			}
		},
		
		//预提交
		async _preSubmit(){
			if (uni.$b.isTrue(this.disabled)) {
				return {type : "disabled" , data : {} } ;
			}
			
			let valideRes = this.validate() ;
			let { valid , msg , name } = valideRes ;
			if (!valid) {
				uni.$b.log("表单校验失败：" , msg , name );
				this.$emit("validateFail", { msg , name } );
				return { type : "validate" , data : valideRes } ;
			}
			
			let submitData = this._getSubmitData();
			
			this.$emit( "submit" , submitData ) ;
			if (!this.canSubmit) {
				return { type : 'beforeSubmit' , data : submitData } ;
			}
			
			return {type : "submiting" , data : submitData } ;
		},
		
		async submit(){
			let preRes = await this._preSubmit() ;
			//校验未通过
			if (preRes.type != "submiting") {
				return ;
			}
			if (!!this.confirm) {
				uni.$b.showModal({
					content:this.confirm,
					success: (e) => {
						if (e.confirm) {
							this.doSubmit(preRes);
						}
					}
				})
				return ;
			}
			
			this.doSubmit(preRes);
		},
		
		async doSubmit(preRes){
			let submitData = preRes.data ;
			
			//上传临时文件
			let uploadSuccess = await this._uploadTemFiles(submitData);
			if (!uploadSuccess) {
				return ;
			}
			
			return await this._submit({
				loading : this.loading ,
				submitData
			});
		},
		
		async _uploadTemFiles(submitData){
			let promises = this._getChildren({elements:["b-img-upload"]}).map(child=>{
				if (!child.name) {
					return Promise.resolve(true); 
				}
				let tempFile = child.valueSync.filter(f => f.isTempFile) ;
				if (tempFile.length == 0) {
					return Promise.resolve(true);
				}
				return new Promise((resolve)=>{
					child.upload({
						onComplete : ({allUpload , value}) => {
							resolve(allUpload);
							this.childrenData[child.name].value = value ;
							submitData[child.name] = this._transByValueType(child.name) ;
						}
					})
				});
			});
			let res = await Promise.all(promises).then(e => e , err => false );
			return res !== false && res.every(isSuccess => isSuccess);
		},
		
		
		/**
		 * 由提交按钮触发的提交，loading状态、默认响应由按钮定义
		 */
		async _submit(config = {}){
			let { loading , submitData } = config ;
			
			//提交表单
			let res = await uni.$b.requestByApiType(this.apiType , {
				url : this.action ,
				data : submitData ,
				header : this.header ,
				method : this.method ,
				loading ,
				handled : false
			}).catch(err=>{
				console.log(err);
				this.$emit("error" , err );
				return err ;
			});
			
			let result = { result : res , data : submitData } ;
			let isOk = !uni.$b._isFailState(res) ;
			
			if(!res.formData) res.formData = submitData ;
			
			//请求提交成功
			this.$emit("load" , res );
			
			//请求OK
			if ( isOk ) {
				this.$emit("success" , res );
			}
			
			//自动重置表单
			if ( this.autoReset != 'none') {
				this.reset();
			}
			
			//留给子组件进行额外处理
			this.$handleSubmitSuccess(res) ;
			
			//不进行默认处理
			if ( uni.$b.isFalse(this.handled) ) {
				return result ;
			}
			let message = uni.$b._getMsg(res) ;
			
			//执行默认跳转
			if (isOk) {
				if (this.next == 'back') {
					uni.$b.navigateBack({
						title : message 
					});
					return ;
				}
				if (!!this.next) {
					uni.$b.redirectTo({
						url: this.next
					});
					return ;
				}
			}
			
			uni.$b.showTips( message , isOk ? 'success' : 'none');
			
			return result ;
		},
		
		$handleSubmitSuccess(e){},
		
		_getChildByName({name , elements}){
			let children = this._getChildren({name});
			return children[children.length - 1] ;
		},
		
		_getChildren({name , elements} = {}){
			let children = [] ;
			elements = elements || formElements ;
			elements.forEach( componentName => {
				let curChildren = this.getChildren(componentName);
				curChildren.forEach(child => {
					if ( !name || name === child.name ) {
						children.push(child);
					}
				})
			})
			return children;
		},
		
		_getFormData(){
			let values = {} , childrenData = {} ;
			this._getChildren().forEach(child =>{
				let name = child.name ;
				if (!name) {
					return ;
				}
				let formData = child.getFormData() ;
				childrenData[name] = formData ;
				values[name] = formData.value ;
			});
			this.valueSync = values ;
			this.childrenData = childrenData ;
		},
		
		getData(){
			this._getFormData();
			return this.valueSync ;
		}
	}
}