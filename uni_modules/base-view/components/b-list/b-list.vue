<template>
	<view class="b-list" v-if="hasAuth">
		
		<block v-if="isConnect">
			
			<view :class="hideClass">
				<slot :options="options" :list="listSync"></slot>
			</view>
			
			<block v-if="isLoading">
				<slot name="loading"></slot>
			</block>
			<!-- 空数据 -->
			<block v-else-if="listSync.length == 0 && _showEmpty">
				
				<block v-if="emptSlot">
					<slot name="empty"></slot>
				</block>
				<block v-else>
					<b-empty :is-show="true"></b-empty>
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
	/**
	* @description List 请求列表数据，发送远程请求，请求列表数据，开启权限校验后，无权限时不请求数据不展示。当未连接网络时，显示网络异常提示，网络重连后重新请求。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/list
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认插槽，可使用作用域变量list。
	* @slot                            loading             用于自定义加载状态的插槽，使用该插槽时，通常需将组件的loading.show属性设置为false。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             loading             数据开始加载时触发 | 参数：--
	* @event    {Function}             load                数据加载完成时触发 | 参数：( res )
	* @event    {Function}             error               服务端响应异常时触发 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          loadData()          请求列表数据 ( config )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       cache               启用客户端本地缓存，默认false。启用本地缓存后，至离开应用或主动清除缓存，将不再请求服务端数据。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       hide-on-loading     加载状态不显示内部元素。若未定义该属性，则请求到非空的data数据之前为true，之后为false。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               method              请求方法，api-type为http时有效，默认get。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Boolean|String}       page-params         请求数据调用接口时，是否自动携带当前页面的参数，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {String}               url                 请求列表数据时的接口地址，允许携带参数。
	* @property {Boolean|String}       usable              发送远程请求接口是否可用，传入url属性后有效，默认true。
	*    @value                        true                
	*    @value                        false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 权限类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示组件，有权限则通过url远程请求数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Boolean|String}       call-on-created     组件创建时自动请求数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求数据。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。若为定义list-key，则直接使用服务端返回的原始数据作为作用域变量list。
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {Array|Object}         options             自定义的其他数据，传入作用域变量使用，仅在小程序中有意义（小程序中作用域插槽无法与页面共享变量，所以需将页面的变量先通过options属性传入组件，而后在组件的作用域变量options中使用）。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-list",
		mixins:[uni.$b._mixins.requestList],
		props:{
			showEmpty : {
				type : [String,Boolean] ,
				default : true 
			}
		},
		computed:{
			emptSlot(){
				return uni.$b.hasSlots.call(this , "empty");
			},
			isRemoteMode(){
				return true ;
			},
			isLocalMode(){
				return false ;
			},
			_showEmpty(){
				return uni.$b.isTrue(this.showEmpty) ;
			},
		}
	}
</script>
