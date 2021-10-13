<template>
	<view class="b-radio form-item" :class="outerClassName" v-if="hasAuth">
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
			
			<view class="hidden father" id="formItem">
				
				<view class="_options clear" :style="boxStyle">
					
					<!-- 追加元素 -->
					<view class="fl" v-if="slots.prepend">
						<slot name="prepend"></slot>
					</view>
					
					
					<view v-for="( item , index) in listData" :key="index"
						class="option fl pointer father" 
						hover-class="none" 
						:class="item.className" 
						:style="itemStyle"
						@tap="select(index)">
						
						<slot v-if="slots.option"
							name="option"
							:item="item.data"
							:title="item.title" 
							:checked="item.checked" 
							:value="item.value" 
							:disabled="item.disabled" 
							:index="index"></slot>
						
						<block v-else>
							
							<view class="father" :class="itemClass" :style="item.style">
								
								<b-check-item 
									v-if="_styleType == 'normal'" 
									class="mr10"
									:radius="radius"
									:color="color"
									:iconColor="textColor"
									:scale="_scale"
									:isChecked="item.checked"></b-check-item>
								
								<!-- 选项文字 -->
								<view style="flex-shrink: 1;" :style="item.titleStyle">
									{{item.title}}
								</view>
								
								
								<b-check-item
									v-if="_styleType == 'block'" 
									class="_box ml10"
									:radius="radius"
									:color="color"
									:iconColor="textColor"
									:scale="_scale"
									:isChecked="item.checked"></b-check-item>
								
								
								<!-- 勾选图标 -->
								<block v-if="_styleType == 'badge'">
									<view v-if="item.checked" 
										:style="{color : color}"
										class="checkTag bIcon-correctFill abs bottom right"></view>
								</block>
								
							</view>
							
						</block>
						
						
						
					</view>
					
					
					<!-- 列表数据为空 -->
					<view class="fl" v-if="showEmpty">
						<slot name="empty"></slot>
					</view>
					
					
					<!-- 追加元素 -->
					<view class="fl" v-if="slots.append">
						<slot name="append"></slot>
					</view>
					
					
				</view>
				
				
			</view>
			
			<slot></slot>
			
		</b-label>
	</view>
</template>

<script>
	import radio from "./b-radio.js" ;
	/**
	* @description Radio 单选框，单选框选项支持独占一行、一行多个选项的布局方式；在选项列表数据渲染方面，支持从本地、远程接口两种方式渲染列表数据；在权限控制方面，你可以仅将部分选项展示给拥有某项权限的用户。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/radio
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                                    default     默认插槽，位于复选框的下方。
	* @slot                                    prepend     插入选项最前面的插槽
	* @slot                                    append      插入选项最后的插槽
	* @slot                                    empty       无选项数据时显示的插槽
	* @slot     {Scoped}                       option      用于自定义选项内容的插槽，用于自定义选项样式。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                     change      选项选中或取消选中时触发 | 参数：( event )
	* @event    {Function}                     loading     开始请求远程数据时触发 | 参数：--
	* @event    {Function}                     load        列表数据请求完成后触发 | 参数：( res )
	* @event    {Function}                     error       请求列表数据接口抛出异常时触发 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                                  loadData()  加载远程列表数据，mode为remote，且配置url属性时有效。 ( config )
	* @method                                  select()    选中指定的选项，通常可用于初始化选中选项使用。 ( index )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       mode        列表数据加载模式，默认local，从list属性加载数据；若为remote，需要配置url作为数据请求接口地址。
	*    @value                                local       从list属性传入的本地数据加载列表数据
	*    @value                                remote      从url接口地址远程请求列表数据
	* @property {Array}                        list        单选框数据列表，mode为local时传入有效。若mode为remote时，服务端返回的数据列表的结构应与list一致。
	* @property {Boolean|String}               index-value value值是否为数组下标，否则为选项数据中的value字段值，默认false。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       name        表单的key，缺省时将不参与表单校验与提交。
	* @property {String|Array}                 value       表单值，可使用v-model双向绑定单选框的值。回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
	* @property {String|Array}                 v-model     双向绑定单选框的值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
	* @property {Boolean|String}               disabled    禁用，默认false。
	*    @value                                true        
	*    @value                                false       
	* @property {String|Number}                default-index 默认选中的选项下标，默认0，即选中第一个。默认下标对应的默认值不会触发@change事件，表单提交时若值为空则赋值为默认值提交。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               check-auth  是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示组件，有权限则通过url远程请求数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       auth-url    权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {String}                       api-type    API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                                uniCloud    云开发接口
	*    @value                                http        常规服务端接口，如java、php、python等语言做服务端接口
	* @property {String}                       url         请求列表数据时的接口地址，允许携带参数，设置mode属性为remote时有效。
	* @property {Boolean|String}               cache       启用客户端本地缓存，默认false。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               page-params 请求列表数据调用接口时，是否自动携带当前页面的参数，默认false。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               handled     执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                                true        
	*    @value                                false       
	* @property {Object}                       header      设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Object}                       loading     请求接口时加载状态的配置项
	* @property {Boolean|String}               usable      发送远程请求接口是否可用，传入url属性后有效，默认true。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       method      请求方法，api-type为http时有效，默认get。
	*    @value                                post        POST请求
	*    @value                                get         GET请求
	* @property {Boolean|String}               call-on-created 单选框创建时自动请求列表数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求列表数据。
	*    @value                                true        
	*    @value                                false       
	* @property {Object}                       params      发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Array}          width       【响应式属性】 每一个选择项的宽度，默认auto。
	* @property {String}                       color       颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                                #e1251b     红色
	*    @value                                #FFC300     黄色
	*    @value                                #FC5E9B     粉色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String}                       icon-color  图标颜色，默认为#fff，可通过配置文件配置components.mainInverse修改默认值。
	* @property {String|Number|Array}          radius      【响应式属性】 单选框的圆角大小，默认100%。
	* @property {String|Number}                scale       尺寸缩放比例，默认1。
	* @property {String}                       type        【响应式属性】 样式类型，可使用option插槽自定义更丰富的样式。
	*    @value                                normal      默认常规样式，选项框位于左侧
	*    @value                                block       选择框位于标题右侧样式， 通常搭配width="100%"使用。
	*    @value                                badge       右下角角标样式
	*    @value                                tag         标签样式
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       title       标题
	* @property {String|Number}                title-width 标题宽度，默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* @property {String}                       align       标题对齐方式，默认left。
	*    @value                                left        左对齐
	*    @value                                center      居中对齐
	*    @value                                right       右对齐
	* @property {String}                       position    【响应式属性】 标题位置，默认auto。
	*    @value                                left        左侧
	*    @value                                top         顶部
	*    @value                                auto        宽屏左侧，窄屏顶部
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               required    必填项，默认true，可通过配置文件配置components.required来修改默认值，通常可以使用b-form组件的required属性来统一调控默认是否必填。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               required-mark 显示必填标识，默认true，可通过配置文件配置components.requiredMark来修改默认值，通常通过b-form的required-mark属性统一调控。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       error-type  校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。通常通过b-form组件的error-type属性统一调控。
	*    @value                                toast       消息提示框显示提示文字，大于15字时为模态弹窗
	*    @value                                underline   输入框的下方红字提示
	* @property {String}                       empty-prefix 非空验证未通过时，提示语的前缀，默认为：请选择。
	* @property {String|Object}                error-msg   表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语，类型为object时，可定义多个校验提示。
	* @property {String}                       validate-title 校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 键名类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       list-key    从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。
	* @property {String}                       value-key   列表数据中选中标签值字段的键名，默认value，在配置文件中，通过配置components.valueKey来修改默认值。
	* @property {String}                       disabled-key 列表数据中字段禁用状态的键名，默认disabled，在配置文件中，通过配置components.disabledKey来修改默认值。
	* @property {String}                       title-key   列表数据中标签标题的键名，默认title，在配置文件中，通过配置components.titleKey来修改默认值。
	* 
	* @property {String}                       ref          获取组件对象，通常用于调用组件内置方法。
	* @property {String}                       v-slot:default  默认插槽作用域变量
	*/
	export default {
		name:"b-radio",
		mixins:[ radio ]
	}
</script>

<style lang="scss">
	@import "./b-radio.scss" ;
</style>