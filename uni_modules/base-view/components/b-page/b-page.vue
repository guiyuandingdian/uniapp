<template>
	<view class="b-page" v-if="hasAuth">
		
		<block v-if="isConnect">
			
			<!-- 筛选条件 -->
			<b-form
				@submit="submit"
				@reset="_onSearchReset"
				:ref="searchId"
				:required="false"
				title-width="0" 
				scale="0.83">
				
				<slot name="search" :data="searchFormData"></slot>
				
			</b-form>
			
			
			
			<!-- 更多筛选 -->
			<b-drawer-form
				:ref="moreSearchId"
				position="top"
				confirm-text="筛选"
				cancel-text="重置"
				cancel-type="reset"
				:required="false"
				:destory-on-hide="false"
				@submit="submit"
				@reset="reset">
				
				<slot name="moreSearch" :data="searchFormData"></slot>
				
			</b-drawer-form>
			
			
			
			<view :class="hideClass">
				<slot :options="options" :list="page.list" :page="page"></slot>
			</view>
			
			<!-- 底部加载状态 -->
			<block v-if="bottomReach && !page.lastPage">
				<slot v-if="slots.loading" name="loading"></slot>
				<b-loading v-else class="flex ct ptb"></b-loading>
			</block>
			
			<!-- 空数据 -->
			<block v-if="!isLoading || inited ">
				
				<block v-if="page.list.length == 0  && _showEmpty">
					<block v-if="slots.empty">
						<slot name="empty"></slot>
					</block>
					<block v-else>
						<b-empty :is-show="true"></b-empty>
					</block>
				</block>
				<block v-else-if="_showNav">
					
					<!-- 分页导航 -->
					<b-view :cname="navClass">
						<b-page-nav
							:disabled="isLoading"
							:page="page" 
							:hide-on-single-page="hideOnSinglePage"
							:prevText="prevText"
							:nextText="nextText"
							@switchPage="switchPage"></b-page-nav>
					</b-view>
						
				</block>
				
			</block>
			
		</block>
		<block v-else>
			
			<!-- 无网络状态 -->
			<b-empty icon="bIcon-noWifi" tips="网络连接失败" :is-show="!isConnect">
				<b-btn @tap="_reconnect()" class="mt" radius="23" width="100">重新连接</b-btn>
			</b-empty>
			
		</block>
		
	</view>
</template>

<script>
	import requestMixins from "../../js_sdk/mixins/base-request-mixins.js" ;
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description Page 分页数据查询，远程请求分页数据，内置完整的下拉刷新，上拉加载更多逻辑。
	* @tutorial    https://base-view.cn/#/pages/doc/page
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认插槽，用于定义分页内容，可使用作用域变量list。
	* @slot                            loading             加载更多时位于底部的加载状态插槽，使用时会覆盖默认的loading组件。
	* @slot                            empty               无数据时显示的插槽，使用后将覆盖默认的b-empty组件。
	* @slot     {Scoped}               search              用于放置筛选表单元素、提交按钮的筛选条件表单插槽，将插入b-page组件内部的b-form组件内。
	* @slot     {Scoped}               moreSearch          更多筛选插槽，以抽屉形式展现。用于放置筛选表单元素、提交按钮的筛选条件表单插槽，将插入b-page组件内部的b-form组件内。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             load                每次加载分页数据，请求完成时触发。 | 参数：( res )
	* @event    {Function}             error               数据请求失败时触发 | 参数：( err )
	* @event    {Function}             search              使用search、moreSearch插槽，并提交筛选表单时触发。 | 参数：( data )
	* @event    {Function}             reset               使用serach、moreSerach插槽定义筛选条件表单，并重置表单时触发。 | 参数：data
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          refresh()           刷新分页数据，从第一页重新开始请求。注意：若通过组件的params属性来传入分页参数，在params变化后刷新分页数据，应使用this.$nextTick()来调用该方法，待参数渲染完毕。刷新分页数据时，最佳的方式是直接给refresh方法传入params参数。 params
	* @method                          getMore()           加载下一页数据 --
	* @method                          search()            使用search、moreSearch插槽时使用，用于提交筛选条件并刷新分页数据。 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number}        page-size           每页数据条数，默认10。
	* @property {String}               page-number-key     向服务端提交分页页码的键名，默认pageNumber，可通过配置文件配置components.page.pageNumberKey来修改默认值。
	* @property {String}               page-size-key       向服务端提交分页条数的键名，默认pageSize。可通过配置文件配置components.page.pageSizeKey来修改默认值。
	* @property {String}               url                 请求分页数据的接口地址，允许携带参数。
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {Boolean|String}       page-params         请求数据调用接口时，是否自动携带当前页面的参数，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               method              请求方法，api-type为http时有效，默认get，可通过配置文件配置request.method来修改默认值。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {String}               get-page            从服务端响应数据中获取标准分页数据的函数，该函数返回可供b-page组件直接使用的标准分页数据。该属性接受一个函数，也可以接受页面内methods中的函数名。可通过配置文件配置response.getPage来修改全局的分页数据获取函数。
	* @property {Boolean|String|Number|Array} show-nav     【响应式属性】 显示分页导航，关闭触底加载更多效果。不显示分页导航时，将启用触底加载更多效果，默认[0,1]。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         nav-class           【响应式属性】 内置分页导航样式类名，默认mt20。
	* @property {Boolean|String}       hide-on-single-page 以分页导航形式展现分页数据时，若只有一页数据是否隐藏分页导航，默认false，可通过配置文件配置components.pageNav.hideOnSinglePage来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               prev-text           分页导航的前一页文字，有值时将隐藏左箭头。
	* @property {String}               next-text           分页导航的下一页文字，有值时将隐藏右箭头。
	* @property {Boolean|String}       show-empty          展示空数据提示信息，默认true。
	*    @value                        true                
	*    @value                        false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示组件，有权限则通过url远程请求数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Boolean|String}       handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       usable              发送远程请求接口是否可用，传入url属性后有效，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Boolean|String}       call-on-created     组件创建时自动请求分页数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求数据。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       cache               发送远程请求后将请求结果数据进行本地缓存，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Array|Object}         options             自定义的其他数据，传入作用域变量使用，仅在小程序中有意义（小程序中作用域插槽无法与页面共享变量，所以需将页面的变量先通过options属性传入组件，而后在组件的作用域变量options中使用）。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-page",
		mixins:[requestMixins , mediaMixins],
		props:{
			pageSize : {
				type : [Number,String] ,
				default(){
					return 10
				}
			},
			getPage:{
				type : [String , Function],
				default(){
					return uni.$b.getValue("response.getPage")
				}
			},
			pageNumberKey : {
				type : String ,
				default(){
					return uni.$b.getValue("components.page.pageNumberKey")
				}
			},
			pageSizeKey : {
				type : String ,
				default(){
					return uni.$b.getValue("components.page.pageSizeKey")
				}
			},
			showNav:{
				type : [Boolean,Array,Number,String],
				default(){
					return [0,1];
				}
			},
			navClass:{
				type : [Array,String],
				default(){
					return "mt20";
				}
			},
			hideOnSinglePage: {
				type : [Boolean,String] ,
				default(){
					return uni.$b.getValue("components.pageNav.hideOnSinglePage")
				}
			},
			prevText : String ,
			nextText : String ,
			showEmpty : {
				type : [String,Boolean] ,
				default : true 
			},
			autoGetMore : {
				type : Boolean ,
				default : true 
			}
		},
		data(){
			return {
				// #ifdef MP-TOUTIAO
				refId : uni.$b.buuid() ,
				// #endif
				// #ifndef MP-TOUTIAO
				refId : "b-page" ,
				// #endif
				bottomReach : false ,
				page:{
					pageNumber : 1 ,
					pageSize : 10 ,
					list : [] ,
					lastPage : true ,
					totalRow : 0 ,
					totalPage : 0 
				},
				searchFormData:{},
				refreshing : false ,
				resetType : ""
			}
		},
		computed:{
			searchId(){
				return `${this.refId}_search` ;
			},
			moreSearchId(){
				return `${this.refId}_moreSearch` ;
			},
			_showNav(){
				return this.bv(this.showNav);
			},
			_showEmpty(){
				return uni.$b.isTrue(this.showEmpty) ;
			},
			isRemoteMode(){
				return true ;
			},
			isLocalMode(){
				return false ;
			},
			slots(){
				return uni.$b.getSlots.call(this , "empty" , "loading" , "search" , "moreSearch");
			},
			
			loadDataOnCreated(){
				return false ;
			},
			
			_getPage(){
				let getPage = this.getPage ;
				if (uni.$b.notNull(getPage) && uni.$b.isString(getPage)) {
					getPage = this.rootVm[getPage] ;
				}
				if (uni.$b.isFn(getPage)) {
					return getPage ;
				}
			},
			finalParams(){
				return {
					[this.pageNumberKey] : this.page.pageNumber ,
					[this.pageSizeKey] : this.page.pageSize ,
					...this.paramsSync ,
					...this.searchFormData
				} ;
			},
		},
		
		async created() {
			this.rootVm = await uni.$b.getRoot() ;
			this.page.pageSize = Number(this.pageSize) ;
			this.getMore = uni.$b.once(this.getMore , 300 , true);
			if ( this.$ts.callOnCreated ) {
				this.loadData();
			}
		},
		
		methods:{
			
			search(){
				this.rootVm.$nextTick(()=>{
					let data =  this.$refs[this.searchId]._getSubmitData();
					let moreData =  this.$refs[this.moreSearchId]._getSubmitData();
					let submitData = Object.assign({},data,moreData) ;
					this.searchFormData = {} ;
					for(let key in submitData){
						this.$set(this.searchFormData , key , submitData[key] ) ;
					}
					this.$emit("search" , { data : this.searchFormData }) ;
					this.refresh();
				});
			},
			
			showMoreSearch(){
				let data = this.$refs[this.searchId].getData();
				uni.$b.deepMerge(this.searchFormData , data);
				this.$refs[this.moreSearchId].show(this.searchFormData);
			},
			
			submit(data = {}){
				for(let key in data){
					this.$set(this.searchFormData , key , data[key] ) ;
				}
				this.$refs[this.searchId].setData(this.searchFormData);
				this.$refs[this.moreSearchId].setData(this.searchFormData);
				this.$refs[this.moreSearchId].hide();
				this.$emit("search" , { data : this.searchFormData }) ;
				this.refresh();
			},
			
			reset(){
				this.searchFormData = {} ;
				if (this.resetType != 'search') {
					this.resetType = "moreSearch" ;
					this.$refs[this.searchId].reset();
				}
				
				this.$emit("reset" , { data : this.searchFormData }) ;
				this.refresh();
			},
			
			_onSearchReset(){
				if (this.resetType == "moreSearch") {
					this.resetType = "" ;
					return ;
				}
				this.resetType = "search" ;
				this.$refs[this.moreSearchId].reset();
			},
			
			switchPage({pageSizeChanged, pageNumber, pageSize}){
				this.page.pageNumber = Number(pageNumber) ;
				this.page.pageSize = Number(pageSize) ;
				this.loadDataOnce();
				this.$emit("switchPage" , {pageNumber : this.page.pageNumber , pageSize : this.page.pageSize}) ;
			},
			
			$onGetMore(path){
				if (path !== this.pagePath || !this.autoGetMore) {
					return ;
				}
				this.getMore();
			},
			
			refresh(params){
				if (this.refreshing) {
					return ;
				}
				this.refreshing = true ;
				this.page.pageNumber = 1 ;
				if (params) {
					params = {
						[this.pageNumberKey] : this.page.pageNumber ,
						[this.pageSizeKey] : this.page.pageSize ,
						...params
					};
				}
				this.loadDataOnce({ params });
			},
			
			getMore(){
				if (this._showNav) {
					return ;
				}
				this.bottomReach = true ;
				if ( this.page.lastPage || this.isLoading ) {
					return ;
				}
				this.page.pageNumber ++ ;
				this.loadDataOnce();
			},
			
			async success(res){
				let {isNull} = uni.$b ;
				let rootVm = await uni.$b.getRoot() ;
				let page = await this._getPage.call( rootVm , res ) ;
				this.inited = true ;
				let pageNumber = isNull(page.pageNumber) ? this.page.pageNumber : page.pageNumber ;
				this.page.pageNumber = pageNumber ;
				if (pageNumber == 1 || this._showNav) {
					this.page.list = [] ;
				}
				this.page.list.push( ...page.list ) ;
				
				this.page.pageSize = isNull(page.pageSize) ? this.page.pageSize : page.pageSize ;
				this.page.lastPage = isNull(page.lastPage) ? page.list.length < this.page.pageSize : page.lastPage ;
				this.page.totalRow = page.totalRow ;
				this.page.totalPage = page.totalPage ;
				this.$emit("success" , { page : this.page });
			},
			
			complete(){
				if (this.refreshing) {
					this.refreshing = false ;
					uni.stopPullDownRefresh();
				}
			},
			
			setData(index , data){
				this.$set( this.page.list , index , data ) ;
			}
		}
	}
</script>