<template>
	<view class="b-select form-item" v-if="hasAuth">
		
		<view id="formItem">
			
			<b-input confirmType="search"
				:value="inputValue"
				:clearable="false"
				:confirmHold="false"
				:holdKeyboard="false"
				:showConfirmBar="false"
				:disabled="_disabled"
				:title="title"
				:title-width="titleWidth" 
				:position="position" 
				:align="align"
				:requiredMark="_requiredMark"
				:required="_required"
				:placeholder="_placeholder"
				:placeholder-class="placeholderClass"
				:placeholder-style="placeholderStyle"
				:focus="focusSync"
				:prefixIcon="prefixIcon"
				:suffixIcon="suffixIcon"
				:errorContent="errorTip"
				:inputClass="inputClass"
				:inputStyle="inputStyle"
				:scale="_scale"
				
				@change="_onInput"
				@blur="_onBlur"
				@focus="_onFocus"
				@confirm="_onBlur">
				
			
				<!-- 前置追加内容 -->
				<template slot="prefix">
					<slot name="prefix"></slot>
				</template>
				
				
				<!-- 后置追加内容 -->
				<template slot="suffix">
					
					<view class="flex lt pr10">
						
						<!-- 搜索状态 -->
						<block v-if="searching">
							<view class="pr10">
								<b-loading color="#777" trackColor="#e9ecef"></b-loading>
							</view>
						</block>
						
						
						<!-- 追加元素 -->
						<view class="pr10" v-if="$slots.suffix">
							<slot name="suffix"></slot>
						</view>
						
						
						<!-- 清空 -->
						<view v-if="_clearable" @tap="_onClear" class="bIcon-close fz12 gray pointer"></view>
						
						
						<!-- 下拉箭头 -->
						<view class="fz12 gray pointer transition bIcon-arrowDown"
							v-else-if="!_disabled" 
							@tap="_toggleOptions"  
							:class="arrowClassName"></view>
						
					</view>
					
				</template>
				
				
				<!-- 选项列表 -->
				<b-animate class="_panel z12 suggestions-box"
					:ref="uid" 
					:inClass="isBottom ? 'fadeInDownSm':'slideDown'" 
					:outClass="isBottom ? 'fadeOutUpSm' : 'slideUp'" 
					:class="panelClassName"
					:value="false"
					:destory-on-hide="false"
					@change="optionsShow=$event;">
					
					
					<view class="_panelInner pointer ptb10 whiteBg suggestions autoY" :style="innerStyle">
						
						<view class="_panelItem ptb7 plr20 suggestions-item"
							v-for="( item , index) in listData" :key="index"
							:class="{'not-allowed op5' : item.disabled }" 
							:style="item.style"
							@tap="select(index)">
							
							
							<!-- 选项子元素 -->
							<view class="fixAutoNoPd middle father z2">
								
								<!-- 选项文字 -->
								<view class="item">
									<view class="fz14">
										<rich-text :nodes="item.richTitle"></rich-text>
									</view>
									<view class="fz12 gray" v-if="item.richRemark">
										<rich-text :nodes="item.richRemark"></rich-text>
									</view>
								</view>
								
								<!-- 对勾图标 -->
								<view class="w1p bIcon-correct fz16 bold"  :class="{'op0' : !item.checked}"></view>
								
							</view>
							
						</view>
						
					</view>
					
				</b-animate>
				
				
			</b-input>
			
			<slot></slot>	
			
		</view>
	</view>
</template>

<script>
	import select from "./b-select.js" ;
	/**
	* @description Select 下拉单选框，可对数据列表进行筛选，支持搜索关键字高亮的响应式下拉单选框。它可以从本地加载数据，也可以直接从API接口远程加载数据，当数据项较多的时候，你可以根据用户输入的关键字来实时加载列表数据；在权限控制方面，它允许你将某些选项只展现给具有某项权限的用户，也可以将选择器只展现给具有某项权限的用户。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/select
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，位于搜索框下方
	* @slot                            prefix              位于搜索框左侧的插槽
	* @slot                            suffix              位于搜索框右侧的插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              选中选项发生变化时触发 | 参数：( e )
	* @event    {Function}             clear               点击清空按钮时触发 | 参数：--
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          select()            选中指定选项，通常用于初始化默认选中值。 ( index )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               mode                列表数据加载模式，默认local，从list属性加载数据；若为remote、search，需要配置url作为数据请求接口地址。
	*    @value                        local               从list属性传入的本地数据加载列表数据
	*    @value                        remote              从url接口地址远程请求列表数据
	*    @value                        search              根据用户输入的搜索关键字远程搜索列表数据
	* @property {Array}                list                单选框数据列表，mode为local时传入有效。若mode为remote、search时，服务端返回的数据列表的结构应与list一致。
	* @property {Boolean|String}       index-value         value值是否为数组下标，否则为选项数据中的value字段值，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       clearable           允许清空已选择的选项，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       hide-on-blur        失去焦点时收起选项列表，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String|Number} value              表单值，可使用v-model双向绑定单选框的值。回填表单数据时，推荐使用form组件的setData()方法回填表单数据。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String|Number} v-model            双向绑定表单值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       focus               获取焦点，显示下拉选项列表，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       disabled            禁用
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       auto-placeholder    placeholder为空时，自动显示占位符，自动占位文字为：请输入${title}，${title}为表单标题。默认true，可通过components.autoPlaceholder配置默认值。通常使用b-form组件的auto-placeholder属性来统一调控。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               placeholder         占位符
	* @property {String}               search-placeholder  搜索框占位符，默认为：请输入关键字筛选。
	* @property {String|Number}        default-index       默认选中的选项下标，默认0，即选中第一个。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       empty-search        未输入关键字时也进行远程搜索列表数据，mode为search时有效，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示选择框，有权限则通过url远程请求列表数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       search-status       mode为search时，搜索远程数据时显示加载状态，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {String}               url                 设置mode属性为remote时，表示请求列表数据时的接口地址；设置mode为search时，表示搜索远程数据列表接口地址，允许携带参数。
	* @property {Boolean|String}       page-params         请求列表数据调用接口时，是否自动携带当前页面的参数，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       cache               启用客户端本地缓存，默认false。
	*    @value                        true                
	*    @value                        false               
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {String}               method              请求方法，api-type为http时有效，默认get。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {Boolean|String}       call-on-created     单选框创建时自动请求列表数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求列表数据。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Number}        rate                mode为search时，输入文字远程搜索的延迟时间，单位ms，默认300，表示停止输入文字300ms后开始远程搜索。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               color               列表项选中颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String}               background          选中项的背景色，默认#f5f7fa
	* @property {String|Number|Array}  max-height          【响应式属性】 下拉选择列表最大高度，默认280。
	* @property {String}               prefix-icon         插入搜索框左侧的图标的类名
	* @property {String}               suffix-icon         插入搜索框右侧的图标的类名
	* @property {Boolean|String}       highlight           开启关键字文字高亮，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               highlight-color     高亮文字颜色，默认#e1251b，可在配置文件中配置highlightColor来修改默认值。
	* @property {String}               border-color        搜索框边线颜色，默认#e0e0e0
	* @property {String|Number}        scale               尺寸缩放比例，默认1。
	* @property {String}               placeholder-style   指定 placeholder 的样式
	* @property {String}               placeholder-class   指定 placeholder 的样式类
	* @property {String}               style-type          【响应式属性】 搜索框的样式类型，默认gray,gray,default
	*    @value                        default             默认样式
	*    @value                        underline           底部一条边线
	*    @value                        gray                灰色背景色
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               title               标题
	* @property {String|Number}        title-width         标题宽度，默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* @property {String}               align               标题对齐方式，默认left。position属性为left时有效。
	*    @value                        left                左对齐
	*    @value                        center              居中对齐
	*    @value                        right               右对齐
	* @property {String|Array}         position            【响应式属性】 标题位置，默认auto。
	*    @value                        left                左侧
	*    @value                        top                 顶部
	*    @value                        auto                宽屏左侧，窄屏顶部
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 表单校验属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       required            必填项，默认true，通常可以使用b-form组件的required属性来统一调控默认是否必填。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       required-mark       显示必填标识，默认true，通常通过b-form的required-mark属性统一调控。
	*    @value                        true                
	*    @value                        false               
	* @property {Boolean|String}       blur-check          失去焦点时触发表单校验，默认false，通过components.blurCheck来配置默认值。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               error-type          校验失败时，错误信息的提示方式，默认totast，通过components.errorType来配置默认值。通常通过b-form组件的error-type属性统一调控。
	*    @value                        toast               消息提示框显示提示文字，大于15字时为模态弹窗
	*    @value                        underline           输入框的下方红字提示
	* @property {String}               empty-prefix        非空验证未通过时，提示语的前缀，默认为：请选择。
	* @property {String}               error-msg           表单校验未通过时，若默认提示语无法满足使用场景需求，可使用error-msg传入自定义的提示语。
	* @property {String}               validate-title      校验提示语标题，默认使用title，当title不满足使用场景时，可使用该属性重新定义。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 键名类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。
	* @property {String}               value-key           列表数据中选中标签值字段的键名，默认value，在配置文件中，通过配置components.valueKey来修改默认值。
	* @property {String}               remark-key          列表数据中备注信息字段的键名，默认remark，在配置文件中，通过配置components.remarkKey来修改默认值。
	* @property {String}               disabled-key        列表数据中字段禁用状态的键名，默认disabled，在配置文件中，通过配置components.disabledKey来修改默认值。
	* @property {String}               search-key          mode为search时，提交搜索关键字到服务端时的key，默认keywords。
	* @property {String}               name                表单的key，缺省时将不参与表单校验与提交。
	* @property {String}               title-key           列表数据中标签标题的键名，默认title，在配置文件中，通过配置components.titleKey来修改默认值。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name:"b-select",
		mixins:[select]
	}
</script>

<style lang="scss">
	@import "./b-select.scss" ;
</style>
