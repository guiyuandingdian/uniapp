<template>
	<view class="b-sub-menu">
		
		<view @tap="select" class="flex" :class="_titleClass" :style="_titleStyle">
			<view class="flex lt">
				<view v-if="!!icon" class="mr10 fz12">
					<view :class="icon"></view>
				</view>
				<view>
					{{title}}
					<view :class="_subClass" :style="_subStyle" v-if="!!subTitle">{{subTitle}}</view>
				</view>
			</view>
			<view class="fz12" v-if="!!arrow">
				<view class="transition" :class="arrowClass"></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import subMenuMixins from "./b-sub-menu-mixins.js" ;
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
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props MenuItem属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               title               菜单标题，必填项。
	* @property {String|Number}        mid                 当前菜单项唯一标识，必填项。
	* @property {String}               icon                图标样式类名
	* @property {String}               url                 跳转链接，支持站内链接、站外链接。若为站外链接，在非H5平台，需配置web-view路径。
	* @property {String}               open-type           跳转链接打开方式，默认navigateTo。
	*    @value                        navigateTo          保留当前页，打开新页面。
	*    @value                        redirectTo          关闭当前页面，打开新页面。
	*    @value                        reLaunch            关闭全部页面，打开新页面。
	*    @value                        switchTab           跳转到tabbar页面
	*    @value                        navigateBack        关闭当前页面，返回上一页，此时href属性表示无法返回上一页时，跳转的页面。
	*    @value                        _blank              打开新标签页，仅H5支持。
	* @property {String}               arrow               右侧箭头图标样式类名
	*    @value                        bIcon-arrowRight    右箭头
	*    @value                        bIcon-triangleRight 右三角箭头
	* @property {String|Array}         active-url          初次进入应用时，会根据当前页面的路径匹配菜单url，来显示菜单的选中状态。若某个页面未在菜单中显示，此时该页面的路径将无法匹配到菜单，即没有任何一个菜单有选中状态，此时可通过设置active-url属性来将某个菜单项与当前的页面进行关联，当打开这个不在菜单项中的页面时，指定该菜单项选中。
	* @property {String}               bg-color            菜单项背景色，可通过配置文件配置components.menuItem.bgColor来修改默认值。
	* @property {String}               color               菜单项文字颜色，可通过配置文件配置components.menuItem.color来修改默认值。
	* @property {String}               active-bg-color     选中菜单项背景色，可通过配置文件配置components.menuItem.activeBgColor来修改默认值。
	* @property {String}               active-color        选中菜单项文字颜色，可通过配置文件配置components.menuItem.activeColor来修改默认值。
	* @property {String}               title-class         菜单项标题样式类名，可通过配置文件配置components.menuItem.titleClass来修改默认值。
	* @property {String}               active-class        选中菜单项样式类名，可通过配置文件配置components.menuItem.activeClass来修改默认值。
	* @property {String|Number|Array}  height              【响应式属性】 菜单项高度，默认53px，可通过配置文件配置components.menuItem.height来修改默认值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props SubMenu属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               title               子菜单项标题，必填项。
	* @property {String|Number}        mid                 当前子菜单项唯一标识，必填项。
	* @property {String}               icon                左侧图标样式类名，选填。
	* @property {String}               url                 跳转链接，支持站内链接、站外链接。若为站外链接，在非H5平台，需配置web-view路径。
	* @property {String|Number|Array}  height              【响应式属性】 子菜单项高度，默认53px，可通过配置文件配置components.subMenu.height来修改默认值。
	* @property {String}               open-type           跳转链接打开方式，默认navigateTo。
	*    @value                        navigateTo          保留当前页，打开新页面。
	*    @value                        redirectTo          关闭当前页面，打开新页面。
	*    @value                        reLaunch            关闭全部页面，打开新页面。
	*    @value                        switchTab           跳转到tabbar页面
	*    @value                        navigateBack        关闭当前页面，返回上一页，此时href属性表示无法返回上一页时，跳转的页面。
	*    @value                        _blank              打开新标签页，仅H5支持。
	* @property {String}               arrow               右侧箭头图标样式类名
	*    @value                        bIcon-arrowRight    右箭头
	*    @value                        bIcon-triangleRight 右三角箭头
	* @property {String|Array}         active-url          初次进入应用时，会根据当前页面的路径匹配菜单url，来显示菜单的选中状态。若某个页面未在菜单中显示，此时该页面的路径将无法匹配到菜单，即没有任何一个菜单有选中状态，此时可通过设置active-url属性来将某个菜单项与当前的页面进行关联，当打开这个不在菜单项中的页面时，指定该菜单项选中。
	* @property {String}               bg-color            子菜单项背景色，可通过配置文件配置components.subMenu.bgColor来修改默认值。
	* @property {String}               color               子菜单项文字颜色，可通过配置文件配置components.subMenu.color来修改默认值。
	* @property {String}               active-bg-color     选中子菜单项背景色，可通过配置文件配置components.subMenu.activeBgColor来修改默认值。
	* @property {String}               active-color        选中子菜单项文字颜色，可通过配置文件配置components.subMenu.activeColor来修改默认值。
	* @property {String}               sub-active-color    选中子菜单项副标题文字颜色，可通过配置文件配置components.subMenu.subActiveColor来修改默认值。
	* @property {String}               title-class         子菜单项标题样式类名，可通过配置文件配置components.subMenu.titleClass来修改默认值。
	* @property {String}               sub-class           子菜单项副标题样式类名，可通过配置文件配置components.subMenu.subClass来修改默认值。
	* @property {String}               sub-active-class    选中子菜单项副标题样式类名，可通过配置文件配置components.subMenu.subActiveClass来修改默认值。
	* @property {String}               active-class        选中子菜单项样式类名，可通过配置文件配置components.subMenu.activeClass来修改默认值。
	* @property {String}               sub-title           子菜单项副标题，选填。
	* @property {String}               sub-color           子菜单项副标题文字颜色，可通过配置文件配置components.subMenu.subColor来修改默认值。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	
	export default {
		name : "b-sub-menu" ,
		mixins : [subMenuMixins] ,
		props:{
			subTitle : String ,
			bgColor : {
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.bgColor")
				}
			},
			color : {
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.color")
				} 
			},
			activeBgColor : {
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.activeBgColor")
				} 
			},
			activeColor : {
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.activeColor")
				} 
			},
			titleClass : {
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.titleClass")
				} 
			},
			activeClass : {
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.activeClass")
				} 
			},
			subColor:{
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.subColor")
				} 
			},
			subActiveColor:{
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.subActiveColor")
				} 
			},
			subClass:{
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.subClass")
				} 
			},
			subActiveClass:{
				type : String ,
				default(){
					return uni.$b.getValue("components.subMenu.subActiveClass")
				} 
			},
			height:{
				type : [String,Number,Array] ,
				default(){
					return uni.$b.getValue("components.subMenu.height")
				} 
			}
		},
		data() {
			return {
				
			}
		},
		computed:{
			_subClass(){
				return uni.$b.getClassName({
					[this.dvs.subClass] : true ,
					[this.dvs.subActiveClass] : this.isActive
				});
			},
			_subStyle(){
				if (this.isActive) {
					return uni.$b.getStyle({
						"color" : this.subActiveColor
					});
				}
				return uni.$b.getStyle({
					"color" : this.subColor
				});
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
.rotate{
	transform: rotate(90deg);
}
</style>
