<template>
	<view class="b-table" v-if="hasAuth">
		
		<block v-if="!isCard">
			
			<view class="father">
				
				<b-scroll
					id="tableBox"
					:scroll-x="_responsive"
					@scroll="_onScroll"
					@scrolltolower="_onReachRight">
					
					<tableItem
						:isVertical="_isVertical"
						:listData="listData"
						:headerData="headerData"
						@getWidths="_onGetWidths"
						@onCheck="_onCheck"
						@onTapHead="_onTapHead">
						
						<template v-slot:td="{item,head,row,col,totalRow}">
							<slot name="td" :item="item" :row="row" :head="head" :col="col" :totalRow="totalRow"></slot>
						</template>
						
						<template slot="prepend">
							<slot name="prepend"></slot>
						</template>
						
						<template slot="append">
							<slot name="append"></slot>
						</template>
					
					</tableItem>
					
				</b-scroll>
				
				
				<view v-if="fixLeftWidth" 
					:style="leftStyle" 
					:class="{shadowRight : scrollLeft > 20}"
					class="abs left hidden">
					
					<tableItem
						fixType="leftFixed"
						v-slot:td="{item,head,row,col,totalRow}"
						:isVertical="_isVertical"
						:listData="listData"
						:headerData="headerData"
						@onCheck="_onCheck"
						@onTapHead="_onTapHead">
						
						<slot name="td" :item="item" :row="row" :head="head" :col="col" :totalRow="totalRow"></slot>
						
					</tableItem>
					
				</view>
				
				<view v-if="fixRightWidth" 
					:class="{shadowLeft : scrollLeft > 20 && notReachRight }"
					:style="rightStyle" 
					class="abs right hidden flex rt t">
					
					<tableItem
						fixType="rightFixed"
						v-slot:td="{item,head,row,col,totalRow}"
						:isVertical="_isVertical"
						:listData="listData"
						:headerData="headerData"
						@onCheck="_onCheck"
						@onTapHead="_onTapHead">
						
						<slot name="td" :item="item" :row="row" :head="head" :col="col" :totalRow="totalRow"></slot>
						
					</tableItem>
					
				</view>
					
			</view>
		</block>
		<block v-else>
			
			
			<view>
				<view class="ptb whiteBg clear" :class="{mt : index > 0}" v-for="( item , index) in listData" :key="item._uid">
					
					<view class="plr ptb5 fl break" :style="head.style" v-for="( head , headIndex) in headerData" :key="headIndex">
						
						<view class="flex lt">
							<view class="grey normal fz13" :style="{width : head.titleWidth}">
								<text :class="head.headClass">
									{{head.title}}
								</text>
							</view>
							<view class="pl10" :class="head.tdClass">
								
								<!-- 自定义item -->
								<slot v-if="head.component.name == 'slot'" 
									name="td" 
									:item="item.data" 
									:row="index" 
									:head="head" 
									:col="headIndex"></slot>
								
								<btd v-else 
									:head="head" 
									:item="item" 
									:headIndex="headIndex" 
									:index="index"></btd>
								
							</view>
						</view>
						
					</view>
					
				</view>
			</view>
			
		</block>
		
		
		<block v-if="(isLocalMode || inited) && !isLoading && listData.length == 0">
			
			<block v-if="slots.empty">
				<slot name="empty"></slot>
			</block>
			<block v-else-if="_showEmpty">
				<b-empty key="empty" :is-show="true"></b-empty>
			</block>
			
		</block>
		
		
	</view>
</template>

<script>
	import tableItem from "./b-table-item.vue" ;
	import btd from "./b-td.vue" ;
	/**
	* @description Table 表格，支持固定列、多选的响应式表格
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/table
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               td                  自定义每一格内容的插槽，默认每一格直接展示文字，定义了header的component字段则展示对应的内置组件，当内置组件无法满足需求时，可使用td插槽，来定义当前td的内容。通常在该插槽内，可使用作用域变量head.key、head.title来判断是哪一列的td。
	* @slot                            prepend             插入到表头下方、表格内容上方的插槽，通常用于追加自定义表格行，需结合.tr、.td、.autoWidth等样式类来实现表格行布局。
	* @slot                            append              插入到表格内容下方的插槽，通常用于追加自定义表格行，需结合.tr、.td、.autoWidth等样式类来实现表格行布局。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             onCheck             当开启了选择行列，选择行时触发 | 参数：( e )
	* @event    {Function}             onTapHead           当点击表头时触发，通常会结合header属性的icon字段来一起使用。 | 参数：( e )
	* @event    {Function}             change              当列表数据变化时触发，即远程加载列表数据后、从列表数据中删除数据后。 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          remove()            删除表格数据行 ( index , count )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Array}                list                表格本地数据列表
	* @property {String}               mode                表格列表数据加载模式，默认local，从list属性加载数据；若为remote，需要配置url作为数据请求接口地址。
	*    @value                        local               从list属性传入的本地数据加载列表数据
	*    @value                        remote              从url接口地址远程请求列表数据
	* @property {Array}                v-model             双向绑定表格的数据列表
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 配置项属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Array}                header              表格配置项
	* @property {String|Object}        header.component    header属性内部字段，用于定义当前列使用什么组件（仅支持可选值中定义的组件）。String类型时代表组件名称，若为Object，则name表示组件名称，其他的字段代表组件的属性。
	*    @value                        b-copy              复制组件
	*    @value                        b-more              长文本组件
	* @property {String|Array}         header.position     【响应式属性】 header属性内部字段，当type属性为card时，用于表示标题的位置，默认left。通常使用title-position属性统一调整，使用header.position进行个性化调整。
	*    @value                        left                左侧
	*    @value                        top                 顶部
	* @property {Boolean|String|Number|Array} header.visiable 【响应式属性】 header属性内部字段，表示当前列的可见性，1、true表示可见，0、false表示隐藏。
	* @property {String|Number|Array}  header.width        【响应式属性】 当前列宽度，type属性为table时，一般有两种，一种是可放置内容的最小宽度，此时无须设置宽度，或设置为1%；另一种是根据剩余空间自动分配的最大宽度，此时设置width为auto。当type属性为card时，可通过width指定当前列的宽度占比，默认情况下，未指定宽度时按50%展现，指定为auto时按100%展现。
	* @property {String|Array}         title-position      【响应式属性】 用于统一调整所有列标题的位置，type属性为card时有效。
	*    @value                        left                左侧
	*    @value                        top                 顶部
	* @property {String|Number}        title-width         统一调整所有列的标题宽度，默认65，为0时隐藏标题，type属性为card时有效。可通过修改配置文件components.table.titleWidth来修改默认值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 权限类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示组件，有权限则通过url远程请求数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Boolean|String}       cache               启用客户端本地缓存，默认false。启用本地缓存后，至离开应用或主动清除缓存，将不再请求服务端数据。
	* @property {Boolean|String}       handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。若为定义list-key，则直接使用服务端返回的原始数据作为作用域变量list。
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {String}               method              请求方法，api-type为http时有效，默认get。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Boolean|String}       page-params         请求数据调用接口时，是否自动携带当前页面的参数，默认false。
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {String}               url                 远程接口地址，用于请求表格列表数据，mode为remote时有效。开启权限验证后，若auth-url为空，则使用url进行权限验证。
	* @property {Boolean|String}       usable              发送远程请求接口是否可用，传入url属性后有效，默认true。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}         align               【响应式属性】 表格内容的横向对齐方式，默认left，可通过配置文件配置components.table.align来修改默认值。
	*    @value                        left                左对齐
	*    @value                        center              居中对齐
	*    @value                        right               右对齐
	* @property {Boolean|String|Number|Array} responsive   【响应式属性】 当表格过长时，是否可左右滑动。由于css机制的限制，当开启左右滑动时，上下方向的内容随即无法设置为overflow:visiable，只能是auto、hidden，当表格内有一些超出表格的内容时将无法获得最佳的展示效果。此时可选择关闭表格左右滑动，若需展示的内容较多，可考虑将多列合并为一列的方式。
	* @property {String|Array}         type                【响应式属性】 样式类型，通常窄屏设备使用card，宽屏设备使用table，默认"card,card,table"。
	*    @value                        card                卡片
	*    @value                        table               表格
	* @property {String|Array}         vertical-align      【响应式属性】 表格内容的纵向对齐方式，默认middle，可通过配置文件配置components.table.verticalAlign来修改默认值。
	*    @value                        top                 顶部对齐
	*    @value                        middle              中间对齐
	*    @value                        bottom              底部对齐
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-table",
		components:{ tableItem , btd },
		mixins:[uni.$b._mixins.requestList , uni.$b._mixins.media],
		props:{
			header:{
				type : Array ,
				default : () => []
			},
			type:{
				type:[String,Array],
				default(){
					return "table"
				}
			},
			mode : {
				type : String ,
				default : "local"
			},
			value : {
				type : Array ,
				default : ()=>[]
			},
			titleWidth:{
				type : [String,Number] ,
				default : uni.$b.getValue("components.table.titleWidth")
			},
			titlePosition:{
				type : [String,Array],
				default : "left"
			},
			//是否为竖向布局
			isVertical:{
				type:[String , Boolean],
				default : true 
			},
			showEmpty:{
				type:[String , Boolean],
				default : true 
			},
			align:{
				type : [String , Array],
				default(){
					return uni.$b.getValue("components.table.align") ;
				}
			},
			verticalAlign:{
				type : [String , Array],
				default(){
					return uni.$b.getValue("components.table.verticalAlign") ;
				}
			},
			responsive:{
				type : [String,Number,Array,Boolean],
				default(){
					return true ;
				}
			}
		},
		data() {
			return {
				scrollLeft : 0 ,
				notReachRight : false ,
				headerSync : [] ,
				choosedIds : [] ,
				fixLeftWidth : 0 ,
				fixRightWidth : 0 ,
				tableHeight : 0
			}
		},
		computed:{
			slots(){
				return uni.$b.getSlots.call(this,"empty");
			},
			_showEmpty(){
				return uni.$b.isTrue(this.showEmpty) ;
			},
			_type(){
				return this.dv(this.type);
			},
			
			_isVertical(){
				return uni.$b.isTrue(this.isVertical) ;
			},
			
			_responsive(){
				return this.bv(this.responsive) ;
			},
			
			_align(){
				return this.dv(this.align) ;
			},
			
			_verticalAlign(){
				return this.dv(this.verticalAlign) ;
			},
			
			_titlePosition(){
				return this.dv(this.titlePosition) ;
			},
			
			rightStyle(){
				return uni.$b.getStyle({
					width : `${this.fixRightWidth}px` ,
					height : `${this.tableHeight}px`
				})
			},
			
			leftStyle(){
				return uni.$b.getStyle({
					width : `${this.fixLeftWidth}px` ,
					height : `${this.tableHeight}px`
				})
			},
			
			isCard(){
				return this._type == 'card' ;
			},
			
			headerData(){
				let {isNull , hasAuth , notNull , isUnstrictTrue} = uni.$b ;
				let list = this.headerSync.map((item,_index)=> ({ ...item , _index , _key : JSON.stringify(`${item.key}${_index}${item.title}`) }))
				.filter(item=> {
					//权限
					let authShow = isNull(item.authUrl) || hasAuth(item.authUrl) ;
					
					//设备可见性
					let visiable = isNull(item.visiable) || this.bv(item.visiable) ;
					
					return authShow && visiable ;
				}).map(item=>{
					let position = this.dv(item.position) ;
					let width = this.dv(item.width) ;
					if (this.isCard) {
						width = uni.$b.isNull(width) ? "50%" : ( width == 'auto' ? '100%' : width ) ;
						item.position = uni.$b.isNull(position) ? this._titlePosition : position ;
						item.titleWidth = uni.$b.isNull(item.titleWidth) ? this.titleWidth : item.titleWidth ;
					}
					
					item.style = uni.$b.getStyle({
						"text-align" : this.isCard ? '' : this._align ,
						"vertical-align" : this.isCard ? '' : this._verticalAlign,
						"width" : width
					});
					
					item.headStyle = uni.$b.getStyle({
						"text-align" : this.isCard ? '' : this._align ,
						"width" : width
					});
					
					item.tdClass = this.dv(item.tdClass) ;
					item.headClass = this.dv(item.headClass) ;
					
					//表头中的index代表是序号列
					item.isIndex = notNull(item.index) ;
					item.component = this._getComponentsData(item.component) ;
					let iconData = this._getIconData(item.icon , item.iconIndex) ;
					return { ...item , ...iconData } ;
				});
				
				let isAll = this._setLeftFixed(list) ;
				this._setRightFixed(list, isAll) ;
				
				return list ;
			},
			
			listData(){
				//表头中配置的index，代表排序
				let indexHead = this.headerData.find(head=>head.isIndex) ;
				let startIndex = indexHead ? indexHead.index : 0 ;
				return this.listSync.map( (item,index)=>{
					/* 禁止列表缓存 */
					return {
						_uid : JSON.stringify(item) + index ,
						_index : index ,
						index : startIndex + index ,
						checked : false ,
						data : item 
					} ;
				});
			},
			
			allChecked(){
				return this.listData.every(item => item.checked ) ;
			}
			
		},
		
		watch:{
			header:{
				handler(header){
					this.headerSync = header ;
				},
				immediate : true 
			}
		},
		
		created() {
			// this._onScroll = uni.$b.once(this._onScroll , 100);
			// this._onReachRight = uni.$b.once(this._onReachRight , 200);
		},
		
		methods: {
			
			_setLeftFixed(list){
				for (var i = 0; i < list.length; i++) {
					let item = list[i] ;
					if (!item.fixed) {
						return false ;
					}
					item.fixedClassName = 'leftFixed' ;
				}
				return true ;
			},
			
			_setRightFixed(list , isAll){
				for (var i = list.length - 1 ; i > -1 ; i--) {
					let item = list[i] ;
					if (!item.fixed) {
						break ;
					}
					item.fixedClassName = isAll ? '' : 'rightFixed' ;
				}
			},
			
			_onGetWidths({tableWidth , tableHeight , leftWidth , rightWidth}){
				uni.$b.select("#tableBox",this).then(r=>{
					let width = r.width ;
					if (tableWidth > width) {
						this.fixLeftWidth = leftWidth ;
						this.fixRightWidth = rightWidth ;
						this.tableHeight = tableHeight ;
					}
				})
			},
			
			_onCheck(e){
				let {name , value , isChecked} = e.detail ;
				this.$emit("onCheck" , { detail : { key : name , value , allChecked : isChecked } });
			},
			
			_onTapHead(head){
				//获取原始head数据
				let originIndex = head._index ;
				let originHead = this.headerSync[originIndex] ;
				
				let detail = { key : head.key , title : head.title } ;
				
				//切换icon
				let iconIndex = head.iconIndex ;
				if (head.hasIcon && head.iconList.length > 1) {
					iconIndex ++ ;
					iconIndex = iconIndex > head.iconList.length - 1 ? 0 : iconIndex ;
					head.iconIndex = iconIndex ;
					this.$set(this.headerSync[originIndex] , "iconIndex" , iconIndex );
					
					detail.iconIndex = iconIndex ;
				}
				
				this.$emit("onTapHead" , {detail} );
			},
			
			//组装组件数据
			_getComponentsData(component){
				if (uni.$b.isNull(component)) {
					return { name : "default" };
				}
				if (uni.$b.isString(component)) {
					return { name : component }
				}
				return uni.$b.isObject(component) ? component : { name : 'default' } ;
			},
			
			//组装图标数据
			_getIconData(icon , index){
				if (uni.$b.isNull(icon)) {
					return { hasIcon : false } ;
				}
				index = uni.$b.isNull(index) ? 0 : index ;
				let iconList = uni.$b.isArray(icon) ? icon : [icon] ;
				return {
					iconList ,
					hasIcon : iconList.length > 0 ,
					iconIndex : index ,
					icon : iconList[index]
				};
			},
			
			_selectAll(key){
				if (!key) {
					if (uni.$b.isDev()) {
						console.error("selected key is undefined")
					}
					return ;
				}
				let allIds = this.listData.map(item=>item[key]);
				if (this.allChecked) {
					this.choosedIds = this.choosedIds.filter(c=>!allIds.includes(c)) ;
				}else{
					this.choosedIds = uni.$b.combine(this.choosedIds , allIds);
				}
			},
			
			$handleSuccess(){
				this.$emit("input" , this.listSync);
				this.$emit("change" , { detail : { value : this.listSync } });
			},
			
			/**
			 * @description 移除指定行
			 * @param {Number} index 从第几行开始移除
			 * @param {Number} count 删除多少行
			 */
			remove(index = 0 , count = 1){
				let realIndex = this.listData[index]._index ;
				this.listSync.splice(realIndex,count) ;
				this.$emit("input" , this.listSync);
				this.$emit("change" , { detail : { value : this.listSync } } );
			},
			
			_onScroll(e){
				this.scrollLeft = e.detail.scrollLeft ;
				this.notReachRight = true ;
			},
			
			_onReachRight(){
				this.notReachRight = false ;
			}
			
		}
	}
</script>
<style lang="scss">
	.shadowRight{
		box-shadow: 7px 0px 10px -6px rgba(0,0,0,0.1);
	}
	.shadowLeft{
		box-shadow: -7px 0px 10px -6px rgba(0,0,0,0.1);
	}
</style>