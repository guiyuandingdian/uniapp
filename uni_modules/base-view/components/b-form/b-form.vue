<template>
	<view class="b-form">
		
		<slot :data="dataToSet"></slot>
		
	</view>
</template>

<script>
	import formMixins from "./b-form-mixins.js" ;
	
	/**
	* @description Form 表单，统一配置内部表单元素布局样式、校验规则等参数，完成表单数据回填、表单数据校验、表单数据提交等基本业务流程。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/form
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}            default             默认作用域插槽，可使用作用域变量data，data为当前表单的所有表单值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}          loading             请求回填表单数据的url接口之前触发 | 参数：--
	* @event    {Function}          load                请求回填表单数据接口成功时触发 | 参数：{ state , msg , data }
	* @event    {Function}          change              表单值发生变化时触发 | 参数：{ name , value , formData }
	* @event    {Function}          reset               重置表单后触发 | 参数：( obj )
	* @event    {Function}          validateFail        表单验证失败时触发 | 参数：{ msg , name }
	* @event    {Function}          submit              表单提交时触发 | 参数：( obj )
	* @event    {Function}          success             表单提交成功（业务执行成功）时触发，如需业务执行失败时也触发该事件，需配置handled属性为false。 | 参数：( e )
	* @event    {Function}          error               请求接口失败时触发 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                       setData()           设置表单值，若内部表单元素有name属性，则会将值直接回填至对应的表单元素。 ( data )
	* @method                       reset()             重置表单，具有hidden="true"属性的隐藏类表单将不会重置。 ( extraData )
	* @method                       clearError()        清空表单校验失败提示信息 --
	* @method                       validate()          校验表单 ( name )
	* @method                       submit()            提交表单 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}            align               表单标题的对齐方式，默认left。
	*    @value                     left                左对齐
	*    @value                     center              居中对齐
	*    @value                     right               右对齐
	* @property {Boolean|String}    auto-placeholder    根据标题自动生成并显示占位符，默认true。
	* @property {Boolean|String}    auto-reset          提交表单成功后是否自动清空表单的方式，默认none。注意：清空表单值时hidden='true'的表单值将不会被清空。
	*    @value                     all                 清除所有表单值
	*    @value                     justForm            清除内部表单元素的值，不清空通过setData()传入的其他自定义值。
	*    @value                     none                不执行清空表单的操作
	* @property {Boolean|String}    disabled            禁用全部表单，禁止表单提交。
	* @property {String|Array}      position            【响应式属性】 内部表单元素标题的位置，默认auto。
	*    @value                     top                 标题位于表单的上方
	*    @value                     left                标题位于表单的左侧
	*    @value                     auto                宽屏PC、窄屏PC上位于左侧，移动设备上位于顶部。
	* @property {String|Number}     scale               内部表单元素的缩放倍数，默认1。
	* @property {String|Number}     title-width         内部表单元素标题的宽度，单位px，默认65，通过修改配置文件配置components.label.titleWidth来修改默认值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 权限类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}      auth-url            权限验证地址，当权限验证地址与action、url不一致时使用。
	* @property {Boolean|String}    check-auth          请求表单数据、提交表单时是否校验权限，设置为true时将开启权限校验，无权限时不请求接口；若设置为false，则不进行权限校验直接请求接口。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}    blur-check          内部表单失去焦点时立即进行表单校验
	* @property {String}            error-type          表单校验错误提示方式，默认toast，可通过修改配置文件配置components.errorType来修改默认值。
	*    @value                     toast               轻提示
	*    @value                     underline           表单下方红字提示
	* @property {Boolean|String}    focus-error         提交表单校验错误时，将页面滑动并聚焦到该表单，默认true。
	* @property {Boolean|String}    required            内部表单元素全部都默认必填，默认为true。
	* @property {Boolean|String}    required-mark       内部表单元素显示必填标记，默认true。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 数据回填属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}    call-on-created     表单创建时自动请求并回填表单数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求并回填表单数据。
	* @property {String}            data-key            回填表单请求接口数据后，从响应结果中取出表单json数据的键名，默认为data，支持深层键名，如result.data。可通过修改配置文件配置dataKey来修改默认值。
	* @property {Boolean|String}    page-params         回填表单数据请求接口时，是否自动携带当前页面的参数，默认false。
	* @property {Object}            params              回填表单数据请求接口时携带的参数
	* @property {String}            url                 编辑表单回填表单数据时，请求表单数据的接口地址，允许携带参数。
	* @property {Boolean|String}    usable              回填表单数据接口是否可用，默认true。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单提交属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}            action              表单数据提交接口地址
	* @property {Boolean|String}    extra-data          是否接收、提交除内部表单元素之外的表单数据，默认true。为false时，通过setData()方法设置表单数据，将只设置内部表单元素的表单数据，提交表单数据时也仅提交内部表单元素的数据。
	* @property {Boolean|String}    handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	* @property {String}            next                表单提交成功后，下一步将跳转的页面地址，如需返回上一页，直接填写back即可。
	*    @value                     back                返回上一页
	*    @value                     pageUrl...          跳转页面的地址
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他交互属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}    cache               回填表单请求接口数据是否进行本地缓存，默认false。
	* @property {Boolean|String}    debug               请求接口数据时是否在浏览器控制台打印日志，默认true，可通过修改配置文件配置call.debug来修改默认值。
	* @property {Object}            header              设置请求的 header，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Object}            loading             请求接口时加载状态的配置项
	* @property {String}            method              请求方法，api-type为http时有效，默认get。
	*    @value                     post                POST请求
	*    @value                     get                 GET请求
	* 
	* @property {String}            ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name : "b-form" ,
		mixins:[formMixins]
	}
</script>