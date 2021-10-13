<template>
	<view class="b-data" v-if="hasAuth">
		
		<block v-if="isConnect">
			
			<view :class="hideClass">
				<slot :options="options" :data="data"></slot>
			</view>
			
			<block v-if="isLoading">
				<slot name="loading"></slot>
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
	import dataMixins from "../../js_sdk/mixins/base-request-data-mixins.js" ;
	/**
	* @description Data 请求单条数据，发送请求加载一条数据，支持数据本地缓存，开启权限校验后，无权限时不请求不展示。当未连接网络时，显示网络异常提示，网络重连后重新请求。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/data
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认作用域插槽，可使用作用域变量data、options。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             loading             开始请求接口时触发 | 参数：--
	* @event    {Function}             load                请求接口完成后触发 | 参数：( res )
	* @event    {Function}             error               服务端接口请求异常时触发 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          loadData()          请求接口数据 (config)
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
	* @property {String}               url                 请求数据的接口地址，允许携带参数。
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
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Boolean|String}       call-on-created     组件创建时自动请求数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求数据。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               datas-key           请求接口数据后，从响应结果中取出单条json数据的键名，默认为data，支持深层键名，如result.data。可通过修改配置文件配置dataKey来修改默认值。未定义datas-key时，将直接取用服务端返回的原始数据。
	* @property {Boolean|String}       handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {Array|Object}         options             自定义的其他数据，传入作用域变量使用，仅在小程序中有意义（小程序中作用域插槽无法与页面共享变量，所以需将页面的变量先通过options属性传入组件，而后在组件的作用域变量options中使用）。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-data",
		mixins:[dataMixins],
		props:{
			pageParams:{
				type : [String,Boolean],
				default : true 
			}
		}
	}
</script>
