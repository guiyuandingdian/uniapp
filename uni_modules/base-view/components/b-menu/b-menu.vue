<template>
	<view class="b-menu">
		<slot></slot>
	</view>
</template>

<script>
	import {store} from "../../js_sdk/state/base-menu-state.js" ;
	/**
	* @description Menu 菜单，支持无限级的菜单组件，需与`b-menu-item`、`b-sub-menu`两个子菜单组件一起使用。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/menu
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，用于放置b-menu-item、b-sub-menu组件。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             onSelect            当菜单项、子菜单项点击时触发 | 参数：( e )
	* @event    {Function}             toggle              菜单项展开、收起时触发 | 参数：( isOpen , mid )
	* @event    {Function}             toggleAll           展开、收起全部菜单时触发 | 参数：( isOpened )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props Menu属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       all-opened          初始化时全部展开全部菜单，single-opened属性为false时有效，默认true，可通过配置文件配置components.menu.allOpened来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       single-opened       展开一个新的菜单项时关闭已打开的菜单项，默认false，可通过配置文件配置components.menu.singleOpened来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         opened-ids          初始化时，展开的菜单项的id列表，若为字符串值，可传入一个可以使用英文逗号分割为数组的字符串，来表示多个展开的菜单项ID。
	* @property {String|Number}        active-id           初始化时，当前选中菜单项的ID。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name : "b-menu" ,
		props:{
			collapse:{
				type : [String,Boolean] ,
				default(){
					return uni.$b.getValue("components.menu.collapse")
				}
			},
			allOpened:{
				type : [String,Boolean] ,
				default(){
					return uni.$b.getValue("components.menu.allOpened")
				}
			},
			openedIds:{
				type : Array ,
				default(){
					return [] ;
				}
			},
			singleOpened:{
				type : [String , Boolean] ,
				default(){
					return uni.$b.getValue("components.menu.singleOpened")
				}
			},
			activeId:{
				type : [String , Number] ,
				default : ""
			}
		},
		data() {
			return {
				name : uni.$b.buuid() ,
				childrenData:{},
				openIdsSync : [] ,
				activeIdSync : "",
				collapseSync : false ,
				times : 0
			}
		},
		computed:{
			ts(){
				return uni.$b.getTrues.call(this , "singleOpened" , "allOpened");
			},
			storeData(){
				return store.state[this.name] || {} ;
			},
			curActiveId(){
				return this.storeData.activeId ;
			},
			mids(){
				return this.storeData.mids ;
			},
			rootId(){
				return this.getRootId(this.curActiveId , this.mids);
			}
		},
		watch:{
			openedIds:{
				handler(value){
					value = uni.$b.parseArray(value);
					this.commit("setOpenIds" , {ids : value}) ;
				},
				immediate : true 
			},
			activeId:{
				handler(mid){
					this.commit("setActiveId" , {mid});
				},
				immediate : true 
			},
			curActiveId:{
				handler(mid){
					this.$nextTick(()=>{
						this.$emit("onActive" , { activeId : this.activeId , rootId : this.rootId });
					})
				},
				immediate : true 
			},
			collapse:{
				handler(value){
					value = uni.$b.isTrue(value) ;
					this.toggleCollapse(value);
				},
				immediate : true 
			},
			allOpened:{
				handler(value){
					console.log("value: ",value);
					this.toggle();
				},
				immediate : true 
			}
		},
		
		created() {
			store.commit("init" , this.name ) ;
		},
		
		mounted() {
			this.chooseByUrl();
		},
		
		methods: {
			
			getRootId(mid , mids) {
				let parentId = mids[mid] ;
				if (!parentId) {
					return mid ;
				}
				return this.getRootId(parentId , mids);
			},
			
			async chooseByUrl(){
				let route = await uni.$b.getPagePath();
				this.commit("setPagePath" , {route});
			},
			
			commit(name , data){
				data.name = this.name ;
				store.commit(name , data);
			},
			
			toggleCollapse(collapsed){
				this.commit("setCollapsed" , {collapsed});
				this.$emit("collapse" , {collapsed});
			},
			
			toggle(mid){
				this.commit("toggle",{ mid , singleOpened : this.ts.singleOpened , allOpened : this.ts.allOpened });
			},
			
			select(url){
				if (!!url) {
					this.commit("setPagePath" , {route : url});
				}
			}
		}
	}
</script>
