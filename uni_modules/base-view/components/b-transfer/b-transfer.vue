<template>
	<view class="b-rate form-item" v-if="hasAuth && inited">
		<b-label
			:title="title" 
			:title-width="titleWidth"
			:title-style="_titleStyle"
			:title-class="titleClass"
			:position="position" 
			:align="align" 
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
			
			<view :class="boxClass" id="formItem">
				
				<view class="rds2 bd father" :class="panelClass">
					<view class="ptb10 plr flex fz12 grayBg bb rdsT2">
						
						<!-- 全选 左侧 -->
						<b-checkAll :name="unselectName" :value="checked" :disabled="_disabled || sourceCount == 0" @change="_onCheck">
							<text v-if="!!_sourceTitle">{{_sourceTitle}}</text>
						</b-checkAll>
						
						<view class="gray">{{checkedCount}}/{{sourceCount}}</view>
						
					</view>
					
					
					<!-- 搜索框 -->
					<view v-if="_filterable && sourceCount > 0" class="plr pt10">
						<b-input
							:title-width="0"
							prefix-icon="bIcon-search" 
							:placeholder="_filterPlaceholder" 
							:scale="0.8" 
							input-class="rds23 bd" 
							placeholder-class="fz12 gray"
							v-model="leftQuery"
							@input="_onSearch"></b-input>
					</view>
					
					
					<scroll-view :scroll-y="true" :style="transferStyle">
						<view class="plr ptb6">
							
							<b-check class="ptb4" :name="unselectName" :value="item.value" :disabled="item._disabled" :key="item.value" v-for="( item , index) in sourceData">
								<view v-if="!slots.default">
									{{item.title}}
									<view v-if="!!item.remark" class="gray fz12">
										{{item.remark}}
									</view>
								</view>
								<slot v-else :data="item.data" :checked="item.checked" :selected="false" :value="item.value" :title="item.title" :remark="item.remark" :disabled="item._disabled"></slot>
							</b-check>
							
						</view>
					</scroll-view>
					
					
					<slot v-if="slots.sourceEmpty" name="sourceEmpty"></slot>
					<view v-else-if="sourceCount == 0" class="abs flex ct">
						<b-empty :is-show="true" :ptb="0"></b-empty>
					</view>
					
				</view>
				
				
				<view class="pd flex ct fz12">
					<view :class="{'flex ct' : _vertical}">
						
						<view @tap="select">
							<slot v-if="slots.selectBtn" name="selectBtn" :vertical="_vertical" :checked="checkedCount" :unchecked="uncheckedCount"></slot>
							<view v-else :class="rightClass" class="w30 h30 flex ct rds">
								<view :class="_vertical?'bIcon-arrowDown':'bIcon-arrowRight'"></view>
							</view>
						</view>
						
						<view @tap="remove">
							<slot v-if="slots.unselectBtn" name="unselectBtn" :vertical="_vertical" :checked="checkedCount" :unchecked="uncheckedCount"></slot>
							<view v-else :class="leftClass" class="w30 h30 flex ct rds">
								<view :class="_vertical?'bIcon-arrowUp':'bIcon-arrowLeft'"></view>
							</view>
						</view>
						
					</view>
				</view>
				
				
				<view class="rds2 bd father" :class="panelClass">
					
					<view class="ptb10 plr flex fz12 grayBg bb rdsT2">
						
						<!-- 全选 右侧 -->
						<b-checkAll :name="selectedName" :value="unchecked" :disabled="_disabled || selectsCount == 0" @change="_onUnchecked">
							<text v-if="!!_selectedTitle">{{_selectedTitle}}</text>
						</b-checkAll>
						<view class="gray">{{uncheckedCount}}/{{selectsCount}}</view>
						
					</view>
					
					
					<view v-if="_filterable && selectsCount > 0" class="plr pt10">
						<b-input
							:title-width="0"
							prefix-icon="bIcon-search" 
							:placeholder="_filterPlaceholder" 
							:scale="0.8" 
							input-class="rds23 bd" 
							placeholder-class="fz12 gray"
							v-model="rightQuery"></b-input>
					</view>
					
					
					<scroll-view :scroll-y="true" :style="transferStyle" :scroll-top="srcollTop" @scroll="srcollTop=$event.detail.scrollTop;">
						
						<view class="plr ptb6">
							<b-check class="ptb4" :name="selectedName" :value="item.value" :disabled="item._disabled" :key="item.value" v-for="( item , index) in selects">
								<view v-if="!slots.default">
									{{item.title}}
									<view v-if="!!item.remark" class="gray fz12">
										{{item.remark}}
									</view>
								</view>
								<slot v-else :data="item.data" :checked="item.checked" :selected="true" :value="item.value" :title="item.title" :remark="item.remark" :disabled="item._disabled"></slot>
							</b-check>
						</view>
						
					</scroll-view>
					
					
					
					<!-- 无数据 -->
					<slot v-if="slots.selectedEmpty" name="selectedEmpty"></slot>
					<view v-else-if="selectsCount == 0" class="abs flex ct">
						<b-empty :is-show="true" :ptb="0"></b-empty>
					</view>
					
				</view>
				
				
			</view>
			
			<slot name="bottom"></slot>
			
		</b-label>
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js";
	import formMixins from "../../js_sdk/mixins/base-form-mixins.js" ;
	import requestListMixins from "../../js_sdk/mixins/base-request-list-mixins.js";
	/**
	* @description Transfer 穿梭框，多选表单组件，与`b-selects`组件不同，它将备选项和已选项分别以列表形式呈现，更为直观的展现两份数据，同时还可以对新增、删减的数据进行记录，为差量更新提供便利。当然，它与`b-selects`组件一样，支持远程数据加载，支持根据用户不同的权限，展现不同的数据。
	* @tutorial    https://base-view.cn/#/pages/doc/transfer
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认插槽，用于自定义选项内容，可使用作用域变量。
	* @slot     {Scoped}               selectBtn           用于覆盖确认选择按钮的作用域插槽
	* @slot     {Scoped}               unselectBtn         用于覆盖取消选中按钮的作用域插槽
	* @slot                            selectedEmpty       用于覆盖已选数据项区域空数据提示内容的插槽。
	* @slot                            sourceEmpty         用于覆盖待选数据项区域空数据提示内容的插槽。
	* @slot                            bottom              底部位置的插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              选项发生变化时触发，包含新增、删减、当前值三组数据。 | 参数：( e )
	* @event    {Function}             sourceCheckChange   数据源侧（左侧）选项选中状态发生变化时触发 | 参数：( e )
	* @event    {Function}             selectedCheckChange 已选数据侧（右侧）选中状态发生变化时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          clearQuery()        清空筛选框内的关键字 type
	* @method                          reset()             重置增量数据、删减数据为空，重新统计，通常在保存增量数据、删减数据后使用。 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               name                表单的key，缺省时将不参与表单校验与提交。
	* @property {String}               set-name            使用b-form组件回填表单时的键名，默认与name一致。
	* @property {String|Array}         value               已选表单值，接受数组字符串、数组、可使用spliter属性分为为数组的字符串等三类值。可使用v-model双向绑定已选值，回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
	* @property {String|Array}         v-model             双向绑定表单值。
	* @property {String}               spliter             用于将String类型的value属性分割为数组的分隔符，默认为英文逗号。
	* @property {Array}                list                源数据列表（需包含待选和已选的全部数据），mode为local时传入有效。若mode为remote时，服务端返回的数据列表的结构应与list一致。
	* @property {String}               mode                列表数据加载模式，默认local，从list属性加载数据；若为remote，需要配置url作为数据请求接口地址。
	*    @value                        local               从list属性传入的本地数据加载列表数据
	*    @value                        remote              从url接口地址远程请求列表数据
	* @property {Boolean|String}       disabled            禁用
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       index-value         当前选中的值是否为数组下标，否则为选项数据中的value字段值，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               value-type          提交表单值类型，指定后在提交表单之前会先转为对应类型，默认array。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。若传入字符串不是默认的类型字符，则可以是页面内在methods中声明的函数名称。在支付宝小程序、头条小程序内无法直接传入函数，可传入页面内的函数名。注意：在该函数内，this对象将始终指向当前页面对象。
	*    @value                        string              字符串
	*    @value                        array               数组
	* @property {Boolean|String|Number|Array} vertical     【响应式属性】 竖向布局，默认1,0，即移动端显示竖向布局，其他端横向布局。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               source-title        数据源侧（左侧）标题，默认：全选。
	* @property {String}               selected-title      已选数据侧（右侧）标题，默认：全选。
	* @property {String|Number|Array}  max-height          【响应式属性】 最大高度，默认300px。
	* @property {String|Number|Array}  min-height          【响应式属性】 最小高度，默认100px。
	* @property {Boolean|String}       filterable          显示筛选输入框，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               filter-placeholder  筛选输入框占位符，默认：请输入关键字筛选。
	* @property {String}               filter-method       自定义数据项筛选函数，不传时根据标题、备注进行筛选。该函数接收(query,item)作为参数，query表示当前的筛选关键字，item为当前数据项，返回true时显示当前数据项。filterMethod属性接受一个字符串类型的函数名时，表示页面methods中的函数。
	* @property {String}               order-by            右侧列表中新加入的元素的排序规则，默认unshift，插入最前面。
	*    @value                        unshift             新添加的选项插入最前面
	*    @value                        push                新添加的选项插入最后面
	*    @value                        origin              新添加的选项按数据源默认排序排列
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不请求接口，有权限则通过url远程请求列表数据。若设置为false，则不进行权限校验，直接请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {String}               url                 远程接口地址，用于请求列表数据，mode为remote时有效。开启权限验证后，若auth-url为空，则使用url进行权限验证。
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {Boolean|String}       page-params         请求数据调用接口时，是否自动携带当前页面的参数，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       cache               发送远程请求时进行本地缓存，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       call-on-created     若设置mode为remote，组件创建时自动请求列表数据，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求列表数据。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {String}               method              请求方法，api-type为http时有效，默认get，可通过配置文件配置request.method来修改默认值。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       required-mark       显示必填标识，默认true，通常通过b-form的required-mark属性统一调控。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               title               标题
	* @property {String|Number}        title-width         标题宽度，默认0，在b-form组件中默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* @property {String}               align               标题对齐方式，默认left。
	*    @value                        left                左对齐
	*    @value                        center              居中对齐
	*    @value                        right               右对齐
	* @property {String|Array}         position            【响应式属性】 标题位置，默认left，可通过配置文件配置components.label.position来修改默认值。
	*    @value                        left                左侧
	*    @value                        top                 顶部
	* @property {String|Array}         title-class         【响应式属性】 标题的样式类名，默认"bold"，可通过配置文件配置components.label.titleClass来修改默认值。
	* @property {String}               title-style         标题样式，同css的style。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               validate-title      校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
	* @property {String}               validator           表单校验函数，接收表单值value作为参数，若校验未通过需返回错误提示信息，校验通过时不返回任何信息。若传入字符串类型属性值，则表示在页面methods中声明的一个函数名。在支付宝小程序、头条小程序中仅支持字符串类型属性值。
	* @property {Boolean|String}       blur-check          失去焦点时触发表单校验，默认false，通过components.blurCheck来配置默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       required            必填项，默认true，通常可以使用b-form组件的required属性来统一调控默认是否必填。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               error-type          校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。通常通过b-form组件的error-type属性统一调控。
	*    @value                        toast               消息提示框显示提示文字，大于15字时为模态弹窗
	*    @value                        underline           表单下方红字提示
	* @property {String}               empty-prefix        非空验证未通过时，提示语的前缀，默认为：请选择。
	* @property {String|Object}        error-msg           表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语，类型为object时，可定义多个校验提示。
	* @property {String|Number}        min                 最少选择的数量，默认-1，表示不限制。
	* @property {String|Number}        max                 最多选择数量，默认为-1，表示不限制。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 键名类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。
	* @property {String}               value-key           列表数据中选中值字段的键名，默认value，在配置文件中，通过配置components.valueKey来修改默认值。
	* @property {String}               remark-key          列表数据中备注字段的键名，默认remark，在配置文件中，通过配置components.remarkKey来修改默认值。
	* @property {String}               disabled-key        列表数据中字段禁用状态的键名，默认disabled，在配置文件中，通过配置components.disabledKey来修改默认值。
	* @property {String}               title-key           列表数据中标题的键名，默认title，在配置文件中，通过配置components.titleKey来修改默认值。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name : "b-transfer" ,
		mixins:[mediaMixins,formMixins,requestListMixins],
		props: {
			vertical : {
				type : [String,Boolean,Number,Array],
				default(){
					return [1,0]
				}
			},
			mode:{
				type : String ,
				default : "local"
			},
			sourceTitle:String,
			selectedTitle : String ,
			maxHeight : {
				type : [String,Number,Array],
				default(){
					return "300px" ;
				}
			},
			minHeight : {
				type : [String,Number,Array],
				default(){
					return "200px" ;
				}
			},
			filterable:[String,Boolean],
			filterPlaceholder:String,
			filterMethod:[String,Function],
			searchName : String ,
			valueType : {
				type : [String , Function ] ,
				default : "array"
			},
			spliter:{
				type : String ,
				default : uni.$b.getValue("components.spliter" , ',')
			},
			max:{
				type : [Number,String] ,
				default : -1
			},
			min:{
				type : [Number,String] ,
				default : -1
			},
			orderBy:{
				type : String ,
				default : "unshift"
			}
		},
		computed: {
			unselectName(){
				return `${this.uid}_unselect` ;
			},
			selectedName(){
				return `${this.uid}_selected` ;
			},
			slots(){
				return uni.$b.getSlots.call(this , "selectedEmpty" , "sourceEmpty" , "title" , "titleRight" , "default" , "selectBtn" , "unselectBtn" );
			},
			_max(){
				return Number(this.max) ;
			},
			
			reachMaxCount(){
				return this._max > 0 && (this.checked.length + this.valueSync.length) >= this._max ;
			},
			
			_errorMsg(){
				let msg = {
					minLength : uni.$b.localeB("validate.minChoose", {title : this.title , minlength : this.min }) 
				};
				if (uni.$b.isNull(this.errorMsg)) {
					return msg ;
				}
				if (uni.$b.isObject(this.errorMsg)) {
					return Object.assign(msg , this.errorMsg) ;
				}
				return this.errorMsg ;
			},
			
			$finalValue(){
				let valueKey = this.isValue ? "value" : "_indexValue" ;
				if(this.valueSync.length > 0){
					let sourceValues = this.authListData.map(item => item[valueKey]) ;
					return this.valueSync.filter(value => sourceValues.includes(value) );
				}
				let indexs = uni.$b.parseArray( this.defaultIndex ) ;
				return this.authListData.filter((cur,index) => indexs.some(i => parseInt(i) === index) ).map(item => item[valueKey]);
			},
			
			_minlength(){
				return Number(this.min) ;
			},
			_emptyPrefix(){
				return this.emptyPrefix || uni.$b.localeB("validate.selectPrefix") ;
			},
			_filterable(){
				return uni.$b.isTrue(this.filterable);
			},
			_filterPlaceholder(){
				return uni.$b.isNull(this.filterPlaceholder) ? uni.$b.localeB("select.searchPlaceholder") : this.filterPlaceholder ;
			},
			_vertical(){
				return this.bv(this.vertical);
			},
			_maxHeight(){
				return this.uv(this.maxHeight);
			},
			_minHeight(){
				return this.uv(this.minHeight);
			},
			_sourceTitle(){
				return uni.$b.isNull(this.sourceTitle) ? uni.$b.localeB("transfer.selectAll") : this.sourceTitle ;
			},
			_selectedTitle(){
				return uni.$b.isNull(this.selectedTitle) ? uni.$b.localeB("transfer.selectAll") : this.selectedTitle ;
			},
			
			transferStyle(){
				return uni.$b.getStyle({
					"max-height" : `calc(${this._maxHeight} - 88rpx)` , 
					"min-height" : `calc(${this._minHeight} - 88rpx)` , 
				})
			},
			boxClass(){
				return uni.$b.getClassName({
					"flex cv" : !this._vertical ,
					"grid g1" : this._vertical
				})
			},
			panelClass(){
				return uni.$b.getClassName({
					"half" : !this._vertical 
				})
			},
			listData(){
				return this.authListData.map(item => {
					return {
						_index : item._index ,
						title : item[this.titleKey],
						value : item[this.valueKey],
						remark : item[this.remarkKey],
						disabled: item[this.disabledKey],
						data : item
					}
				})
			},
			//已选选项
			selects(){
				if (this.orderBy == "origin") {
					return this.listData.filter(item => {
						let choosed = this.$finalValue.includes(item.value);
						let filted = uni.$b.isNull(this.leftQuery) || this._filterMethod(this.leftQuery , item.data) ;
						return choosed && filted ;
					});
				}
				return this.$finalValue.map( value => {
					let item = this.listData.find(item => item.value === value ) ;
					if (!item) {
						return {} ;
					}
					let isChecked = this.unchecked.includes(item.value);
					item._disabled = this._disabled ;
					item.checked = isChecked ;
					return item ;
				}).filter(item => {
					return uni.$b.isNull(this.leftQuery) || this._filterMethod(this.leftQuery , item.data);
				});
			},
			//备选项
			sourceData(){
				return this.listData.filter(item => {
					return !this.$finalValue.includes(item.value) ; 
				}).filter(item => {
					return uni.$b.isNull(this.leftQuery) || this._filterMethod(this.leftQuery , item.data);
				}).map(item => {
					let isChecked = this.checked.includes(item.value);
					item._disabled = this._disabled || item.disabled || ( this.reachMaxCount && !isChecked ) ;
					item.checked = isChecked ;
					return item ;
				});
			},
			sourceCount(){
				return this.sourceData.length ;
			},
			selectsCount(){
				return this.selects.length ;
			},
			checkedCount(){
				return this.checked.length ;
			},
			uncheckedCount(){
				return this.unchecked.length ;
			},
			
			rightClass(){
				let disabled = this.checkedCount == 0 ;
				return uni.$b.getClassName({
					"grayBg bd disabled":disabled ,
					"bg mainBd hover8" : !disabled
				})
			},
			leftClass(){
				let disabled = this.uncheckedCount == 0 ;
				return uni.$b.getClassName({
					"grayBg bd disabled":disabled ,
					"bg mainBd hover8" : !disabled ,
					"mt" : !this._vertical ,
					"ml" : this._vertical
				})
			}
		},
		data() {
			return {
				uid : uni.$b.buuid(),
				valueSync : [], //当前值
				checked : [], //待增值
				unchecked : [], //待减值
				add:[], //新增值
				removed:[] ,//新减值
				leftQuery : "" ,
				rightQuery : "" ,
				srcollTop : 0
			}
		},
		
		async created() {
			this._filterMethod = await this.getFilterMethod();
		},

		methods: {
			
			_filterMethod(){},
			
			async getFilterMethod(){
				let filterMethod = this.filterMethod ;
				if ( uni.$b.isNull(filterMethod) ) {
					return (query , item) => (item[this.titleKey] && item[this.titleKey].indexOf(query) > -1) || (item[this.remarkKey] && item[this.remarkKey].indexOf(query) > -1) ;
				}
				//获取页面对象
				let roots = await uni.$b.getRoot() ;
				if (uni.$b.isString(filterMethod)) {
					//获取页面内的转换函数
					filterMethod = roots[filterMethod] ;
				}
				if (uni.$b.isFn(filterMethod)) {
					filterMethod.bind(roots);
				}
				return filterMethod ;
			},
			
			_onSearch(value){
				if (!this.searchName || this.isLocalMode) {
					return ;
				}
				this.loadDataOnce({
					params : {
						[this.searchName] : value
					}
				});
			},
			
			_handleValueSet(value){
				return uni.$b.parseArray(value , this.spliter) ;
			},
			
			_onCheck(e){
				let checked = e.detail.value ;
				this.checked = this._max > 0 ? checked.splice(0 , this._max) : checked ;
				this.$emit("sourceCheckChange" , { detail : { value : [...this.checked] } })
			},
			_onUnchecked(e){
				this.unchecked = e.detail.value ;
				this.$emit("selectedCheckChange" , { detail : { value : [...this.unchecked] } })
			},
			
			select(){
				if (this.checkedCount == 0) {
					return ;
				}
				let fnName = this.orderBy == "push" ? "push" : "unshift" ;
				this.add[fnName](...this.checked);
				this.add = uni.$b.combine(this.add);
				this.removed = this.removed.filter(v => !this.add.includes(v));
				
				//设置值
				if (this.orderBy == "origin") {
					let all = [...this.add , ...this.valueSync] ;
					this.valueSync = this.listData.filter(item => all.includes(item.value)).map(item => item.value);
					this.add = this.listData.filter(item => this.add.includes(item.value)).map(item => item.value);
				}else{
					this.valueSync[fnName](...this.checked);
				}
				
				this.srcollTop = Math.random() ;
				this.$nextTick(()=>{
					this.srcollTop = this.orderBy == "unshift" ? 0 : 100000 ;
				})
				
				this.$changeValue({detail:{value:this.valueSync}});
				
				this.checked = [] ;
			},
			remove(){
				if (this.uncheckedCount == 0) {
					return ;
				}
				
				//本次真实移除的
				let realRemoved = this.unchecked.filter(v => !this.add.includes(v));
				let fnName = this.orderBy == "push" ? "push" : "unshift" ;
				this.removed[fnName](...realRemoved);
				this.removed = uni.$b.combine(this.removed);
				if (this.orderBy == "origin") {
					this.removed = this.listData.filter(item => this.removed.includes(item.value)).map(item => item.value);
				}
				
				this.add = this.add.filter(v => !this.unchecked.includes(v));
				
				this.valueSync = this.valueSync.filter(v => !this.unchecked.includes(v));
				
				this.$changeValue({detail:{value:this.valueSync}});
				
				this.unchecked = [];
			},
			
			handleValueChange(e){
				e.detail = {
					value : uni.$b.clone(this.valueSync) ,
					add : uni.$b.clone(this.add) ,
					removed : uni.$b.clone(this.removed)
				}
			},
			
			clearQuery(type = "left"){
				this[type + "Query"] = "" ;
			},
			
			reset(){
				this.add = [] ;
				this.removed = [] ;
			}
		}
	}
</script>
<style lang="scss">
	.hoverStatus{
		transition: all 0.2s linear;
		&:hover{
			border-color: $main;
			background-color: $main;
			color: #fff;
		}
	}
	.half{
		width: calc(50% - 60rpx);
	}
</style>