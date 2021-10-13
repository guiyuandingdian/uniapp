import showMixins from "../../js_sdk/mixins/base-show-mixins.js" ;
export default {
	mixins:[showMixins],
	props:{
		checkAuth: {
			type: [Boolean, String],
			default () {
				return uni.$b.getValue("checkAuth", false)
			}
		},
		authUrl: [String, Array],
		usable: {
			type: [Boolean, String],
			default: true
		},
		apiType: {
			type : String ,
			default () {
				return uni.$b.getValue("request.apiType", "uniCloud")
			}
		},
		url: String,
		params: {
			type: Object,
			default () {
				return {};
			}
		},
		pageParams: [Boolean, String],
		cache: {
			type: [String, Boolean],
			default: false
		},
		handled: {
			type: [Boolean, String],
			default: true
		},
		loading: {
			type: Object,
			default: function(e) {
				return {};
			}
		},
		method: {
			type: String,
			default(){
				return uni.$b.getValue("request.method", "uniCloud")
			}
		},
		header: {
			type: Object,
			default: function(e) {
				return {};
			}
		},
		callOnCreated: {
			type: [Boolean, String],
			default: true
		},
		hideOnLoading: {
			type: [String, Boolean],
			default: undefined
		},
		rate: {
			type: [Number, String],
			default: 300
		},
		options: { //兼容小程序
			type: [Object, Array],
			default () {
				return {}
			}
		}
	},
	data() {
		return {
			refreshing : true ,
			isConnect : true ,
			isLoading : false ,
			isError : false ,
			inited : false , //留给子组件实现
			curPageParams : {}
		}
	},
	
	computed:{
		
		$ts(){
			return uni.$b.getTrues.call(this , "callOnCreated" , "handled" , "usable" , "checkAuth" , "hideOnLoading", "pageParams") ;
		},
		
		//是否具有权限显示当前组件
		hasAuth(){
			let {isNull , isFalse , hasAuth } = uni.$b ;
			return (isNull(this.url) && isNull(this.authUrl)) || !this.$ts.checkAuth || hasAuth( this.authUrl || this.url ) ;
		},
		
		_hideOnLoading(){
			return uni.$b.isNull(this.hideOnLoading)  ? !this.inited : this.$ts.hideOnLoading;
		},
		
		loadDataOnCreated(){
			return this.$ts.callOnCreated ;
		},
		
		isUsable(){ //是否可执行远程请求，此处提供给其他组件覆盖使用
			return !!this.url && this.$ts.usable ;
		},
		
		$loading(){ //loading配置项，此处提供给其他组件覆盖使用
			return this.loading ;
		},
		
		//本次请求携带的参数
		paramsSync(){
			return this._getParams(this.params) ;
		},
		
		/**
		 * @description 提供给其他组件覆盖使用，用于追加其他的参数
		 */
		finalParams(){
			return this.paramsSync ;
		},
		
		$handled(){
			return this.$ts.handled ;
		},
		
		hideClass(){
			return uni.$b.getClassName({
				'hide' : this._hideOnLoading && (this.isLoading || !this.inited)
			});
		}
	},
	
	created() {
		
		//监听网络状态变化
		uni.getNetworkType({
			success: (e) => {
				this.isConnect = e.networkType != 'none' ;
			}
		});
		uni.onNetworkStatusChange((e)=>{
			this.isConnect = e.networkType != 'none' ;
			if (this.isConnect) {
				this._reconnect();
			}
		});
		
		this.refresh = uni.$b.once( this.refresh , 300 , true);
		this.loadDataOnce = uni.$b.once( this.loadData , this.rate );
		
		this._loadOnCreated();
	},
	
	mounted(){
		this.$bind();
	},
	
	beforeDestroy() {
		this.$unbind();
	},
	
	methods: {
		
		$onComponentShow(){
			this.$bind();
		},
		
		$onComponentHide(){
			this.$unbind();
		},
		
		$bind(){
			uni.$on("baseOnPullDownRefresh" , this._onRefresh ) ;
			uni.$on("baseOnReachBottom" , this.$onGetMore ) ;
		},
		
		$unbind(){
			uni.$off("baseOnPullDownRefresh" , this._onRefresh ) ;
			uni.$off("baseOnReachBottom" , this.$onGetMore ) ;
		},
		
		$onGetMore(){},
		
		_onRefresh(path){
			if (path !== this.pagePath) {
				return ;
			}
			this.refresh();
		},
		
		async _loadOnCreated(){
			this.curPageParams = await uni.$b.getPageParams() ;
			if (this.loadDataOnCreated) {
				this.loadData();
			}
		},
		
		_reconnect(){
			if (this.loadDataOnCreated) {
				if (!this.isConnect) {
					uni.showToast({
						title: '网络连接失败',
						icon : 'none'
					});
					return ;
				}
				this.loadData();
			}
		},
		
		_getParams(params = {} , pageParams){
			pageParams = pageParams ?? this.$ts.pageParams ;
			if(!pageParams){
				return params ;
			}
			return uni.$b.deepMerge( {} , this.curPageParams , params ) ;
		},
		
		refresh(params){
			if (this.refreshing) {
				return ;
			}
			this.refreshing = true ;
			this.loadData({ params });
		},
		
		
		handleLoadData(){},
		
		/**
		 * @description 请求数据
		 */
		async loadData(config={}){
			let rootVm = await uni.$b.getRoot() ;
			rootVm.$nextTick(()=>{
				let {loading , success , error , params , pageParams } = config ;
				if ( !this.isUsable || !this.hasAuth || !this.isConnect ) {
					this.isLoading = false ;
					return ;
				}
				let isContinute = this.handleLoadData();
				if (isContinute === false) {
					return ;
				}
				this.isLoading = true ;
				this.isError = false ;
				this.$emit("loading");
				uni.$b.requestByApiType(this.apiType , {
					url : this.url ,
					data : this._getParams( params || this.finalParams , pageParams ) ,
					method : this.method ,
					header : this.header ,
					loading : loading || this.$loading ,
					cache : this.cache ,
					handled : this.$handled
				}).then( res =>{
					this.$emit("load" , res );
					this.isError = false ;
					this.success(res);
					//回调函数
					uni.$b.isFn(success) && success(res) ;
				}).catch(err=>{
					this.isError = true ;
					this.$emit("error" , err);
					this.error(err);
					//回调函数
					uni.$b.isFn(error) && error(err) ;
				}).finally( ()=>{
					this.refreshing = false ;
					this.isLoading = false ;
					this.complete();
				});
			})
		},
		
		success(res){},
		
		error(err){} ,
		
		complete(){}
	}
	
}