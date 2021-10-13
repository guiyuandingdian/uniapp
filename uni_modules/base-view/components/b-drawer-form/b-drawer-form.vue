<template>
	<view class="b-drawer-form father" :style="zIndexStyle">
		
		<!-- 遮罩层 -->
		<b-animate :ref="`${refId}_mask`" v-if="ts.mask" :value="maskInitValue">
			
			<view class="fixed wp7" 
				:style="zIndexStyle"
				@tap="_onMask" 
				@touchmove.stop.prevent="()=>{}"></view>
				
		</b-animate>
		
		
		<view class="fixed" 
			:class="dvs.placement" 
			:style="fixedStyle">
			
			<b-animate 
				:ref="`${refId}_body`" 
				:in-class="_inClass" 
				:out-class="_outClass"
				:value="initValue"
				:duration="duration"
				:destory-on-hide="ts.destoryOnHide"
				@beforeHide="_beforeChange"
				@beforeShow="_beforeChange"
				@change="_onChange">
				
				<view class="father" :class="_drawerClass" :style="scrollStyle">
					
					<!-- header -->
					<view class="_header">
						
						<view class="statusBar"></view>
						
						<block v-if="showHeader">
							
							<slot v-if="slots.header" name="header"></slot>
							
							<view v-else :class="dvs.headerClass" :style="headerStyle">
								{{title ? title : ''}}
							</view>
							
							<view @tap="_onClose" v-if="ts.showClose" :class="closeIcon" class="closeBtn pr abs top right flex h45 fz20 bold"></view>
							
						</block>
					</view>
					
					
					<!-- body -->
					<scroll-view :scroll-y="true" :class="dvs.bodyClass" :style="_bodyStyle">
						<slot :data="scopedData"></slot>
					</scroll-view>
					
					
					<!-- footer -->
					<view class="_footer abs bottom safeBottom whiteBg z20 " style="line-height: 21px;">
						<view class="pd" v-if="showFooter">
							
							<!-- 自定义底部 -->
							<block v-if="slots.footer">
								<slot name="footer"></slot>
							</block>
							<block v-else>
								
								
								<!-- 按钮样式 -->
								
								<view v-if="_btnType == 'coverBtn'" class="flex av">
									<view v-if="ts.showCancel" :class="{pr7 : ts.showConfirm}">
										<b-btn @tap="_onCancel" type="block" :radius="_btnRadius" :isPlain="true">{{_cancelText}}</b-btn>
									</view>
									<view v-if="ts.showConfirm" :class="{pl7 : ts.showCancel }">
										<b-btn @tap="_onConfirm" type="block" :radius="_btnRadius">{{_confirmText}}</b-btn>
									</view>
								</view>
								
								
								<view v-else class="flex" :class="btnClass">
									<b-btn v-if="ts.showCancel" @tap="_onCancel" :radius="_btnRadius" :isPlain="true">{{_cancelText}}</b-btn>
									<b-btn v-if="ts.showConfirm" @tap="_onConfirm" :radius="_btnRadius" :class="{ml0 : btnAlign == 'around'}" >{{_confirmText}}</b-btn>
								</view>
								
								
							</block>
							
						</view>
						
					</view>
					
					
				</view>
				
			</b-animate>
			
		</view>
		
	</view>
</template>

<script>
	import drawer from "../b-drawer/b-drawer.js" ;
	import modalForm from "../b-modal-form/b-modal-form.js" ;
	/**
	* @description DrawerForm 抽屉表单，集合了`b-drawer`和`b-form`两个组件的全部能力，并拓展了一些抽屉表单的能力，通常用于筛选条件的临时展示。该组件支持`b-form`、`b-drawer`两个组件所有的属性、事件、插槽、方法，不再赘述。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/drawer-form
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             statusChange        当抽屉显示状态发生变化后触发 | 参数：( isShow )
	* @event    {Function}             change              表单值发生变化时触发 | 参数：{ name , value , formData }
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          show()              显示抽屉，可传入data参数作为设置表单值的数据，并作为默认作用域插槽的作用域变量。 ( data , callback )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               cancel-type         取消提交按钮的类型，默认hide。
	*    @value                        hide                隐藏模态框
	*    @value                        submit              提交表单
	*    @value                        reset               重置表单，可搭配justForm属性使用。
	*    @value                        validate            校验表单
	*    @value                        clearError          清除表单校验提示信息
	*    @value                        loadData            请求表单数据，配置url属性时有效。
	* @property {String}               confirm-type        确认提交按钮的类型，默认submit。
	*    @value                        submit              提交表单
	*    @value                        reset               重置表单，可搭配justForm属性使用。
	*    @value                        validate            校验表单
	*    @value                        clearError          清除表单校验提示信息
	*    @value                        loadData            请求表单数据，配置url属性时有效。
	*    @value                        hide                隐藏模态框
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认作用域插槽，可使用作用域变量data。
	* @slot                            header              自定义头部插槽，使用后顶部的title区域将被取代。
	* @slot                            footer              自定义底部插槽，使用后底部的按钮区域将被取代。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             beforeShow          显示抽屉之前触发 | 参数：( isShow )
	* @event    {Function}             beforeHide          隐藏抽屉之前触发 | 参数：( isShow )
	* @event    {Function}             change              显示、隐藏抽屉后触发 | 参数：( isShow )
	* @event    {Function}             confirm             点击确认按钮时触发 | 参数：( e )
	* @event    {Function}             cancel              点击取消按钮时触发 | 参数：( e )
	* @event    {Function}             close               点击关闭按钮时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          show()              显示抽屉，允许接收一个回调函数和注入抽屉默认插槽的json数据，另外这两个参数允许只传入一个而无须关心其顺序，如show(callback)与show(data)都是可以的。 ( data , callback ) 
	* @method                          hide()              隐藏模态框 ( callback )
	* @method                          toggle()            切换抽屉的显示、隐藏状态，允许接收一个回调函数和注入抽屉的json数据。 ( data , callback )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       close-by-mask       点击背景遮罩层关闭抽屉，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       destory-on-hide     抽屉隐藏时销毁组件，下次显示时重新渲染，默认true。在保留用户输入、操作状态的一些场景，你可以设置为false，默认为true。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Number}        duration            动画持续时间，单位ms，默认300。
	* @property {Boolean|String}       mask                显示黑色半透明背景，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         placement           【响应式属性】 抽屉的位置，默认right。
	*    @value                        top                 顶部
	*    @value                        right               右侧
	*    @value                        bottom              底部
	*    @value                        left                左侧
	* @property {String}               title               标题
	* @property {Boolean|String}       v-model             数据双向绑定，控制弹窗的显示、隐藏状态，与value属性选择使用即可。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       value               显示弹出窗，默认false，动态改变其值可以控制弹出窗的显示、隐藏状态，通常与v-model属性来选择使用。
	*    @value                        true                
	*    @value                        false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 按钮类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}         btn-align           【响应式属性】 按钮的对齐方式，默认right，btn-type为btn时有效。
	*    @value                        right               右对齐
	*    @value                        center              居中对齐
	*    @value                        left                左对齐
	*    @value                        around              平均分布
	*    @value                        between             两端对齐
	* @property {String|Array}         btn-type            【响应式属性】 底部确认、取消按钮的样式类型。
	*    @value                        coverBtn            铺满底部
	*    @value                        btn                 按钮类型
	* @property {String}               cancel-text         取消按钮文字，默认：取消。
	* @property {String}               close-icon          关闭按钮图标，默认bIcon-multiply，可通过配置文件配置components.drawer.closeIcon来修改默认值。
	* @property {String}               confirm-text        确认按钮文字，默认：确定。
	* @property {Boolean|String}       round-btn           底部按钮为圆形按钮，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       show-cancel         显示取消按钮，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       show-close          显示关闭按钮，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       show-confirm        显示确认按钮，默认true。
	*    @value                        true                
	*    @value                        false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               body-class          【响应式属性】 抽屉内容部分的样式类名，默认"plr ptb10,pd"，可通过配置文件配置components.drawer.bodyClass来修改默认值。
	* @property {String}               body-style          抽屉内容部分的样式，同css样式
	* @property {String}               drawer-class        【响应式属性】 抽屉样式类名，默认whiteBg，可通过配置文件配置components.drawer.drawerClass来修改默认值。
	* @property {String}               drawer-style        抽屉样式，同css样式。
	* @property {String}               header-class        【响应式属性】 抽屉头部的样式类名，默认"flex ptb10 plr fz16"，可通过配置文件配置components.drawer.headerClass来修改默认值。
	* @property {String}               header-style        抽屉头部部分的样式，同css样式
	* @property {String|Number|Array}  height              【响应式属性】 高度，如无特殊需求，请使用默认值，通常placement为top、bottom时用于定义抽屉高度。
	* @property {String|Number|Array}  width               【响应式属性】 宽度，如无特殊需求，请使用默认值，通常placement为left、right时用于定义抽屉宽度。
	* @property {String|Number}        z-index             抽屉的层级，默认18。
	* 
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
	*    @value                     true                
	*    @value                     false               
	* @property {Boolean|String}    auto-reset          提交表单成功后是否自动清空表单的方式，默认none。注意：清空表单值时hidden='true'的表单值将不会被清空。
	*    @value                     all                 清除所有表单值
	*    @value                     justForm            清除内部表单元素的值，不清空通过setData()传入的其他自定义值。
	*    @value                     none                不执行清空表单的操作
	* @property {Boolean|String}    disabled            禁用全部表单，禁止表单提交。
	*    @value                     true                
	*    @value                     false               
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
	*    @value                     true                
	*    @value                     false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}    blur-check          内部表单失去焦点时立即进行表单校验
	*    @value                     true                
	*    @value                     false               
	* @property {String}            error-type          表单校验错误提示方式，默认toast，可通过修改配置文件配置components.errorType来修改默认值。
	*    @value                     toast               轻提示
	*    @value                     underline           表单下方红字提示
	* @property {Boolean|String}    focus-error         提交表单校验错误时，将页面滑动并聚焦到该表单，默认true。
	*    @value                     true                
	*    @value                     false               
	* @property {Boolean|String}    required            内部表单元素全部都默认必填，默认为true。
	*    @value                     true                
	*    @value                     false               
	* @property {Boolean|String}    required-mark       内部表单元素显示必填标记，默认true。
	*    @value                     true                
	*    @value                     false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 数据回填属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}    call-on-created     表单创建时自动请求并回填表单数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求并回填表单数据。
	*    @value                     true                
	*    @value                     false               
	* @property {String}            data-key            回填表单请求接口数据后，从响应结果中取出表单json数据的键名，默认为data，支持深层键名，如result.data。可通过修改配置文件配置dataKey来修改默认值。
	* @property {Boolean|String}    page-params         回填表单数据请求接口时，是否自动携带当前页面的参数，默认false。
	*    @value                     true                
	*    @value                     false               
	* @property {Object}            params              回填表单数据请求接口时携带的参数
	* @property {String}            url                 编辑表单回填表单数据时，请求表单数据的接口地址，允许携带参数。
	* @property {Boolean|String}    usable              回填表单数据接口是否可用，默认true。
	*    @value                     true                
	*    @value                     false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单提交属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}            action              表单数据提交接口地址
	* @property {Boolean|String}    extra-data          是否接收、提交除内部表单元素之外的表单数据，默认true。为false时，通过setData()方法设置表单数据，将只设置内部表单元素的表单数据，提交表单数据时也仅提交内部表单元素的数据。
	*    @value                     true                
	*    @value                     false               
	* @property {Boolean|String}    handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                     true                
	*    @value                     false               
	* @property {String}            next                表单提交成功后，下一步将跳转的页面地址，如需返回上一页，直接填写back即可。
	*    @value                     back                返回上一页
	*    @value                     pageUrl...          跳转页面的地址
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他交互属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}    cache               回填表单请求接口数据是否进行本地缓存，默认false。
	*    @value                     true                
	*    @value                     false               
	* @property {Boolean|String}    debug               请求接口数据时是否在浏览器控制台打印日志，默认true，可通过修改配置文件配置call.debug来修改默认值。
	*    @value                     true                
	*    @value                     false               
	* @property {Object}            header              设置请求的 header，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Object}            loading             请求接口时加载状态的配置项
	* @property {String}            method              请求方法，api-type为http时有效，默认get。
	*    @value                     post                POST请求
	*    @value                     get                 GET请求
	* 
	* @property {String}            ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-drawer-form" ,
		mixins:[ drawer , modalForm ] ,
		methods:{
			$onChange(isShow){
				if(isShow){
					this.setData(this.scopedData);
					this._queryRects();
				}else if (this.ts.destoryOnHide) {
					this.isRect = false ;
					this.formDataLoad = false ;
					this.scopedData = {} ;
					this.data = {} ; //formData
				}
				this.$emit("input" , isShow);
				this.$emit("statusChange" , isShow);
			}
		}
	}
</script>
