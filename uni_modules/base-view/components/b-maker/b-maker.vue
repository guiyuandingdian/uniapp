<template>
	<view class="b-maker form-item">
		<b-label
			:title="title" 
			:title-width="titleWidth" 
			:position="position" 
			:align="align" 
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
			
			<block v-if="!hasValue && !_disabled">
				
				<view v-if="!hasEmptySlot" class="flex" style="height: 80rpx;">
					<view  @tap="add()" class="bIcon-addCircle bold hoverMain fz16 op7"></view>
				</view>
				
				<slot v-else name="empty"></slot>
				
			</block>
			
			<slot :list="valueSync"></slot>
			
			<slot name="bottom"></slot>
			
		</b-label>
	</view>
</template>

<script>
	/**
	* @description Maker 动态表单，与`b-clone`组件一起使用，用于动态创建多组表单。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/maker
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认插槽，需插入一个或多个b-clone组件使用。可使用作用域变量list。
	* @slot                            empty               当表单值为空时的插槽，默认会显示一个添加按钮，可使用该插槽来覆盖默认UI。
	* @slot                            add                 子组件b-clone的插槽，用于重新定义默认的添加按钮。
	* @slot                            remove              子组件b-clone的插槽，用于重新定义移除按钮。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              新增、移除表单时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          add()               增加一组表单组 ( index , data )
	* @method                          remove()            移除一组表单组 ( index )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Object}               default-data        添加一组表单时，向value中追加的默认表单数据。
	* @property {Boolean|String}       disabled            禁用
	* @property {String}               name                表单的key，缺省时将不参与表单校验与提交。
	* @property {Boolean|String}       show-add-icon       内部的b-clone组件显示添加组的图标按钮，默认true。
	* @property {Boolean|String}       show-remove-icon    内部b-clone组件显示移除表单组的图标按钮，默认true。
	* @property {String}               spliter             当value值是字符串时，由spliter属性分割为一个数组，表示多个选中的值，默认spliter为英文逗号。
	* @property {String|Array}         v-model             双向绑定表单值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
	* @property {String|Array}         value               表单值，可以是一个可由spliter分割为数组的字符串，也可以是一个可以转为数组的数组字符串，也可以是一个数组。可使用v-model双向绑定单选框的值。回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
	* @property {String|Function}      value-type          提交表单值类型，指定后在提交表单之前会先转为对应类型。若传入自定义的转换函数，该函数接收表单值作为参数，函数返回值将作为表单提交值。若传入字符串不是默认的类型字符，则可以是页面内在methods中声明的函数名称。在支付宝小程序、头条小程序内无法直接传入函数，可传入页面内的函数名。注意：在该函数内，this对象将始终指向当前页面对象。
	*    @value                        float               带小数点的浮点数
	*    @value                        int                 整数
	*    @value                        string              字符串
	*    @value                        boolean             布尔值
	*    @value                        bool                布尔值
	*    @value                        object              JSON对象
	*    @value                        array               数组
	*    @value                        timestamp           时间戳
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               align               标题对齐方式，默认left。
	*    @value                        left                左对齐
	*    @value                        center              居中对齐
	*    @value                        right               右对齐
	* @property {String|Array}         position            【响应式属性】 标题位置，默认auto。
	*    @value                        left                左侧
	*    @value                        top                 顶部
	*    @value                        auto                宽屏左侧，窄屏顶部
	* @property {String}               title               标题
	* @property {String|Number}        title-width         标题宽度，默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               empty-prefix        非空验证未通过时，提示语的前缀，默认为：请输入。
	* @property {String|Object}        error-msg           表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语，类型为object时，可定义多个校验提示。
	* @property {String}               error-type          校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。通常通过b-form组件的error-type属性统一调控。
	*    @value                        toast               消息提示框显示提示文字，大于15字时为模态弹窗
	*    @value                        underline           输入框的下方红字提示
	* @property {String|Number}        max                 最多创建表单组的数量，默认为-1，表示不限制。
	* @property {String|Number}        min                 最少创建表单组的数量，默认-1，表示不限制。
	* @property {Boolean|String}       required            必填项，默认true，通常可以使用b-form组件的required属性来统一调控默认是否必填。
	* @property {Boolean|String}       required-mark       显示必填标识，默认true，通常通过b-form的required-mark属性统一调控。
	* @property {String}               validate-title      校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
	* @property {String|Function}      validator           表单校验函数，接收表单值value作为参数，若校验未通过需返回错误提示信息，校验通过时不返回任何信息。若传入字符串类型属性值，则表示在页面methods中声明的一个函数名。在支付宝小程序、头条小程序中仅支持字符串类型属性值。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-maker" ,
		mixins:[uni.$b._mixins.form],
		props:{
			defaultData:{
				type : Object ,
				default(){
					return {};
				}
			},
			min : {
				type : [Number,String] ,
				default : -1
			},
			max : {
				type : [Number,String] ,
				default : -1
			},
			spliter:{
				type : String ,
				default : ","
			},
			showAddIcon:{
				type : [Boolean , String] ,
				default : true 
			},
			showRemoveIcon:{
				type : [Boolean , String] ,
				default : true 
			}
		},
		data() {
			return {
				valueSync : []
			}
		},
		computed:{
			hasEmptySlot(){
				return uni.$b.hasSlots.call(this,"empty");
			},
			_max(){
				return Number(this.max) ;
			},
			_minlength(){
				return Number(this.min) ;
			},
			_errorMsg(){
				let msg = {
					minLength : uni.$b.localeB("validate.minInput", {title : this.title , minlength : this._minlength }) 
				};
				if (uni.$b.isNull(this.errorMsg)) {
					return msg ;
				}
				if (uni.$b.isObject(this.errorMsg)) {
					return Object.assign(msg , this.errorMsg) ;
				}
				return this.errorMsg ;
			},
			editable(){
				return !this._disabled && (this._max == -1 || this.$finalValue.length < this._max ) ;
			},
			_showAddIcon(){
				return uni.$b.isTrue(this.showAddIcon) && this.editable ;
			},
			_showRemoveIcon(){
				return uni.$b.isTrue(this.showRemoveIcon) && !this._disabled ;
			}
		},
		
		created() {
			this._setChildData = uni.$b.once(this._setChildData , 100);
		},
		
		mounted() {
			this._setChildData();
		},
		
		methods: {
			
			_setChildData(){
				this.$nextTick(()=>{
					let children = this.getChildren("b-clone") ;
					children.sort( (a,b) => a._uid - b._uid ) ;
					children.forEach((c,index)=>{
						c.index = index ;
						c.isLast = index == children.length - 1 ;
					});
				});
			},
			
			_handleValueSet(value){
				this.valueSync = uni.$b.parseArray(value , this.spliter) ;
				this._setChildData();
				return this.valueSync ;
			},
			
			add(index , data){
				if (!this.editable) {
					return ;
				}
				index = uni.$b.isNull(index) ? this.valueSync.length - 1 : index ;
				data = uni.$b.isNull(data) ? this.defaultData : data ;
				this.valueSync.splice(index + 1 , 0 , { ...data } );
				this.$changeValue({detail:{value : this.$finalValue , data , index : index + 1}});
				this._setChildData();
			},
			
			remove(index){
				if (this._disabled) {
					return ;
				}
				let data = this.valueSync[index] ;
				this.valueSync.splice(index,1);
				this.$changeValue({detail:{value : this.$finalValue , data , index }});
				this._setChildData();
			}
			
		}
	}
</script>