export default {
	mixins:[ uni.$b._mixins.form , uni.$b._mixins.media , uni.$b._mixins.requestList ],
	props:{
		mode : {
			type : String ,
			validator(v){
				return uni.$b.isOneOf("mode" , v , ["local" , "remote" , "search"]) ;
			},
			default : "local"
		},
		color:{
			type : String ,
			default : uni.$b.getValue("components.mainColor")
		},
		background:{
			type : String ,
			default : "#f5f7fa"
		},
		maxHeight:{
			type: [Number,String,Array] ,
			default(){
				return 290 ;
			}
		},
		defaultIndex:{
			type : [String , Number],
			default : -1 
		},
		prefixIcon : String ,
		suffixIcon : String ,
		emptySearch : [String,Boolean] ,
		highlight : {
			type : [String , Boolean],
			default : true 
		} ,
		highlightColor:{
			type : String ,
			default : uni.$b.getValue("highlightColor" , "#e1251b")
		},
		searchKey:{
			type : String ,
			default : "keywords"
		},
		searchStatus:{
			type : [Boolean,String] ,
			default : true
		},
		clearable:{ //是否可清空已选择的值
			type : [Boolean,String] ,
			default : true
		},
		hideOnBlur:{
			type : [Boolean,String] ,
			default : true
		},
		inputClass:{
			type : [String,Array],
			default(){
				return uni.$b.getValue("components.select.inputClass")
			}
		} ,
		inputStyle: String ,
		searchPlaceholder:String
	},
	
	data() {
		return {
			uid : uni.$b.buuid(), 
			rect : {
				top : 0
			},
			keywords : "" , //用户输入的关键字
			optionTitle : "" , //当前对用户展示的选项标题
			hidePanelTime : null  ,
			focusError : false , //聚焦输入框
			isKeepFocus : false ,
			optionsShow : false  //当前选项是否显示
		}
	},
	
	computed:{
		
		isLocalMode(){
			return this.mode === 'local' ;
		},
		
		isRemoteMode(){
			return this.mode === 'remote' ;
		},
		
		isSearchMode(){
			return this.mode === 'search' ;
		},
		
		/**
		 * 是否可清空已选择的选项
		 */
		_clearable(){
			return this.clearable && !this._disabled && this.hasValue ;
		},
		
		_searchPlaceholder(){
			return this.searchPlaceholder ? this.searchPlaceholder : uni.$b.localeB("select.searchPlaceholder") ;
		},
		
		_placeholder(){
			let {isTrue,isNull} = uni.$b ;
			let auto = this.extendProp("autoPlaceholder" , true , "components.autoPlaceholder") ;
			let prefix = this._emptyPrefix ;
			let holder = isTrue(auto) && isNull(this.placeholder) && !isNull(this.title) ? `${prefix}${this.title}` : this.placeholder ;
			return this.optionsShow ? this._searchPlaceholder : holder ;
		},
		
		_emptyPrefix(){
			return this.emptyPrefix || uni.$b.localeB("validate.selectPrefix") ;
		},
		
		size(){
			return this._scale * 40 ;
		},
		
		loadingSync(){ //禁止请求数据时显示loading状态
			return { show : false } ;
		},
		
		searching(){
			return uni.$b.isTrue(this.searchStatus) && this.isLoading ;
		},
	
		/**
		 * @description loadData方法请求数据时携带的参数
		 */
		finalParams(){
			let params = this.paramsSync || {} ;
			if (!this.isSearchMode) {
				return params ;
			}
			//搜索模式时追加输入的关键字参数
			let searchParams = {} ;
			if (this.searchKey) {
				params[this.searchKey] = this.keywords ;
			}
			return params ;
		},
		
		$finalValue(){
			let index = Number(this.defaultIndex) ;
			let isDefault = uni.$b.isNull(this.valueSync) && index > -1 && this.authListData.length > index ;
			return isDefault ? this.authListData[index][this.valueKey] : this.valueSync ;
		},
		
		inputValue(){
			return uni.$b.isNull(this.optionTitle) ? this.keywords : this.optionTitle ;
		},
		
		isUsable(){ //是否可执行远程请求
			return !!this.url && !this.isLocalMode && uni.$b.isTrue(this.usable) ;
		},
		
		_height(){
			return this.pv(this.maxHeight , uni.$b.getSafeArea().height) || '280px' ; 
		},
		
		heightNum(){
			return parseFloat( this._height ) ;
		},
		
		/**
		 * 输入框是否处于屏幕下方
		 */
		isBottom(){
			return this.rect.top > uni.$b.getSafeArea().height - this.heightNum ;
		},
		
		panelClassName(){
			let isRight = this.rect.right > uni.$b.getSafeArea().width - this.rect.width ;
			return uni.$b.getClassName({
				'top abs' : true ,
				'isBottom' : this.isBottom , 
				'none' : this.listData.length == 0 ,
				'right' : isRight ,
				'left' : !isRight
			});
		},
		
		innerStyle(){
			return uni.$b.getStyle({
				'max-height' : this._height 
			});
		},
		
		arrowClassName(){
			return uni.$b.getClassName({
				'rotate' : this.optionsShow 
			})
		},
		
		listData(){
			let listData = this.authListData.map( (item,index) => {
				let value = item[this.valueKey] ;
				let checked = this._isChecked(value , index) ;
				let disabled = this._isDisabled(item[this.disabledKey] , checked) ;
				let title = item[this.titleKey] ;
				let remark = item[this.remarkKey] ;
				//选中样式
				let styles = this._getStyle(checked);
				let richTitle = this._highlightStr(title , this.keywords) ;
				let richRemark = this._highlightStr(remark , this.keywords) ;
				let data = { value , checked , disabled , title ,  remark , ...styles , _indexValue : index } ;
				//若外部传入richTitle、richRemark则覆盖组件内部的数据，此特性用于支持外部自定义高亮代码
				return Object.assign( { richTitle , richRemark } , item , data ) ;
			});
			
			//搜索关键字
			let words = this.keywords ;
			
			//搜索模式不需要关键字本地过滤
			if (this.isSearchMode || uni.$b.isNull(words)) {
				return listData ;
			}
			
			return listData.filter(item => (item.title && item.title.indexOf(words)>-1) || item.remark && item.remark.indexOf(words)>-1 ) ;
		}
		
	},
	
	watch:{
		listData:{
			handler(){
				this._setOptionTitle();
			},
			immediate : true
		}
	},
	
	mounted() {
		this._getRect();
	},
	
	methods: {
		
		_getStyle(checked){
			return {
				style :checked ? uni.$b.getStyle({
					"color" : this.color ,
					"font-weight" : 700 ,
					"background-color" : this.background
				}) : ''
			} 
		},
		
		_isChecked(value , index){
			return this.isValue ? value === this.$finalValue : index === this.$finalValue ;
		},
		
		_isDisabled(disabled){
			return this._disabled || uni.$b.isTrue(disabled) ;
		},
		
		/**
		 * @description 设置选项标题
		 */
		_setOptionTitle(){
			this.$nextTick(()=>{
				if(this.focusSync){
					this.optionTitle = "" ;
				}else{
					let checkedItem = this.listData.find(item=>item.checked);
					this.optionTitle = checkedItem ? checkedItem.title : "" ;
					this.keywords = "" ;
				}
			})
		},
		
		_onClear(){
			//清空将触发blur，此时不应隐藏列表
			clearTimeout(this.hidePanelTime) ;
			this.keywords = "" ;
			this.$emit("clear") ;
			this.$changeValue({detail:{value:""}});
			this.$nextTick(()=>{
				this.focusSync = true ;
			})
		},

		_handleFocus(){
			this._setOptionTitle();
			if (this.isKeepFocus) {
				this.isKeepFocus = false ;
				return false ;
			}
			this._getRect(()=>{
				this.$nextTick(()=>{
					this.$refs[this.uid].show();
				});
			});
		},
		
		_handleBlur(){
			this._setOptionTitle();
			if (!uni.$b.isTrue(this.hideOnBlur)) {
				return false ;
			}
			this.hidePanelTime = setTimeout(e => {
				this.$refs[this.uid].hide();
			},200);
		},
		
		select(index){
			if ( index < 0 || index > this.listData.length - 1 ) {
				return ;
			}
			let item = this.listData[index] ;
			clearTimeout(this.hidePanelTime) ;
			if ( item.disabled ) {
				this._keepFocus() ;
				return ;
			}
			this.$refs[this.uid].hide() ;
			let value = this.isValue ? item.value : index ;
			this.$changeValue({ detail : { value , index : item._index , item : uni.$b.clone(this.listSync[item._index]) } });
		},
		
		/**
		 * 当失去焦点时，强制保持焦点，而不触发其他任何聚焦行为
		 */
		_keepFocus(){
			this.isKeepFocus = true ;
			this.focusSync = true ;
		},
		
		_onInput(e){
			let value = e.detail.value ;
			this.keywords = value ;
			if(!this.isSearchMode){
				return ;
			}
			if ( uni.$b.isNull(value) && !uni.$b.isTrue(this.emptySearch) ) {
				return ;
			}
			this.loadDataOnce();
		},
		
		_getRect(callback){
			uni.$b.select( "#formItem" , this).then(res=>{
				this.rect = res ;
				uni.$b.isFn(callback) && callback();
			});
		},
		
		_toggleOptions(){
			if(this._disabled){
				return ;
			}
			this.$refs[this.uid].toggle((isShow)=>{
				if(isShow){
					this.focusSync = true ;
				}
			});
		},
		
		$handleSuccess(res){
			if(this.listSync.length > 0 && this.focusSync ){
				this.$refs[this.uid].show();
			}
		},
		
		_highlightStr(str , keywords){
			if (uni.$b.isNull(str) || !uni.$b.isTrue(this.highlight) ) {
				return str ;
			}
			return (str+"").split(keywords).join(`<span style="color:${this.highlightColor};">${keywords}</span>`)  ;
		}
	}
}