<template>
	<view class="b-drawer father" :style="zIndexStyle">
		
		<!-- 遮罩层 -->
		<b-animate v-if="ts.mask" :ref="`${refId}_mask`" :value="maskInitValue">
			
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
					<view class="_footer abs bottom z20 safeBottom"  style="line-height: 21px;">
						<view class="safeBottom" :class="footerClass" v-if="showFooter">
							
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
	import drawer from "./b-drawer.js" ;
	/**
	* @description Drawer 响应式抽屉，一个在各个设备上具有良好的适配性、用于盛放临时内容的侧边弹层视图容器。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/drawer
	* @version     1.0.0
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
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-drawer",
		mixins:[drawer]
	}
</script>