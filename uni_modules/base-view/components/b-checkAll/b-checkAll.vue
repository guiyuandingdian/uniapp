<template>
	<view class="b-checkAll flex lt" :class="_disabled?'disabled':'pointer'" @tap="checkAll">
		
		<b-check-item
			:radius="radius"
			:class="{'mr7' : slots.default}"
			:color="color"
			:iconColor="iconColor"
			:scale="scale"
			:isChecked="isChecked"></b-check-item>
		
		<slot></slot>
		
	</view>
</template>

<script>
	import {store} from "../../js_sdk/state/base-checkAll-state.js" ;
	/**
	* @description CheckAll 全选，与`b-check`组件一起使用，可实现全选功能。`b-checkAll`组件与`b-check`组件通过相同选项组标识`name`来关联，不需要是父子关系、兄弟关系，布局是相互独立无任何关联的。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/checkAll
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，常用于写标题。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              当复选框选项变化时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          checkAll()          b-checkAll组件内置方法，选中、取消选中所有相同name的check组件。当b-checkAll组件为选中状态时，调用该方法则取消选中，反之则选中。 --
	* @method                          check()             b-check组件内置方法，选中、取消选中当前的组件。 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               color               选中复选框颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #FF6D8A             粉色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String}               icon-color          选中复选框的图标颜色，默认为#fff，可通过配置文件配置components.mainInverse修改默认值。
	* @property {String}               radius              复选框的圆角大小，默认4px，圆形时为100%。
	* @property {String|Number}        scale               复选框的缩放比例，默认1。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props checkAll属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               name                必填属性，选项组标识，用于控制与自身name一致的b-check组件。
	* @property {String}               spliter             用于将String类型的value属性分割为数组的分隔符，默认为英文逗号。
	* @property {String|Array}         value               当前已选择的选项值列表，为数组字符串时将被转为数组，当为纯字符串时，会使用spliter属性将字符串分割为数组。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props check属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               name                必填属性，选项组标识，受与自身name一致的b-checkAll组件控制。
	* @property {String|Object}        value               复选框的值
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-checkAll",
		props:{
			name : {
				type : String ,
				required : true
			} ,
			value : {
				type : [String , Array] ,
				default : ''
			},
			spliter : String ,
			scale:{
				type : [String,Number],
				default : 1
			},
			color : String ,
			iconColor : String ,
			radius : {
				type : String ,
				default : "2px"
			},
			disabled:[String,Boolean]
		},
		data() {
			return {
				pagePath : "" 
			}
		},
		computed:{
			slots(){
				return uni.$b.getSlots.call(this,"default");
			},
			_disabled(){
				return uni.$b.isTrue(this.disabled);
			},
			namespace(){
				return `${this.pagePath}-${this.name}`
			},
			
			curData(){
				return store.state[this.namespace] || {} ;
			},
			
			allValues(){
				return this.curData.values || [] ;
			},
			
			checkedValues(){
				return this.curData.checkedValues || [] ;
			},
			
			isChecked(){
				if (!this.curData) {
					return false ;
				}
				return this.allValues.length > 0 && this.allValues.every( v => this.checkedValues.includes(v) ) ;
			}
		},
		
		watch:{
			value(){
				let checkedValues = uni.$b.parseArray(this.value , this.spliter) ;
				this.commit("resetCheckedValues" , {value : checkedValues});
			}
		},
		
		created() {
			uni.$on("onBaseCheckValue" , this._onCheckValue ) ;
		},
		
		async mounted() {
			this.pagePath = await uni.$b.getPagePath();
			let checkedValues = uni.$b.parseArray(this.value , this.spliter) ;
			this.commit("init", {value : checkedValues});
			uni.$emit("b-checkAll-submitValue" , this.namespace );
		},
		
		beforeDestroy() {
			uni.$off("onBaseCheckValue" , this._onCheckValue ) ;
		},
		
		methods: {
			
			commit(action , data = {}){
				data.name = this.namespace ;
				store.commit(action , data);
			},
			
			checkAll(){
				if (this._disabled) {
					return ;
				}
				if (this.isChecked) {
					this.commit("unselectAll");
				}else{
					this.commit("selectAll");
				}
				this._emitChange();
			},
			
			_onCheckValue({name , value , isChecked}){
				if (name !== this.namespace) {
					return ;
				}
				this._emitChange(name , value , isChecked);
			},
			
			_emitChange(name , value , isChecked){
				this.$emit("change" , { detail : {
					value : [...this.checkedValues] , 
					isCheckeAll : this.isChecked ,
					name : this.name ,
					changed:{
						name , value , isChecked
					}
				} }) ;
			}
		}
	}
</script>