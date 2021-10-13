<template>
	<view class="b-modal father" :style="zIndexStyle">
		
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
				:in-class="inClass" 
				:out-class="outClass"
				:value="initValue"
				:duration="duration"
				:destory-on-hide="destoryOnHide"
				@beforeHide="_beforeChange"
				@beforeShow="_beforeChange"
				@change="_onChange">
				
				<view class="_box father" :style="_modalStyle" :class="dvs.modalClass">
				
					
					<!-- header -->
					<block v-if="showHeader">
						
						<slot v-if="slots.header" name="header"></slot>
						
						<view v-else :class="dvs.headerClass">
							{{title ? title : ''}}
						</view>
						
						<view @tap="_onClose" v-if="ts.showClose" :class="closeIcon" class="closeBtn pr abs top right flex  h55 fz20 bold"></view>
						
					</block>
					
					
					<!-- body -->
					<scroll-view scroll-y="true" :style="scrollStyle">
						<view :class="dvs.bodyClass" :style="bodyStyle">
							<slot :data="scopedData"></slot>
						</view>
					</scroll-view>
				
					
					
					<!-- footer -->
					<view v-if="showFooter" style="line-height: 21px;">
						
						<!-- 自定义底部 -->
						<block v-if="slots.footer">
							<slot name="footer"></slot>
						</block>
						<block v-else>
							
							
							<!-- 按钮样式 -->
							<view class="flex" :class="btnClass" v-if="dvs.btnType == 'btn'">
								<b-btn v-if="ts.showCancel" @tap="_onCancel" :radius="_btnRadius" :min-width="104" :isPlain="true" :shadow="false">{{_cancelText}}</b-btn>
								<b-btn v-if="ts.showConfirm" @tap="_onConfirm" :radius="_btnRadius" :min-width="104" 
									:class="{'ml':btnAlign != 'around'}" :shadow="false" :disabled="confirmDisabled">
									{{_confirmText}}
								</b-btn>
							</view>
							
							
							<!-- 铺满按钮样式 -->
							<view class="flex av text-center fz15 pointer bt rdsB13 hidden" v-else-if="dvs.btnType == 'coverBtn'">
								
								<view v-if="ts.showCancel" class="ptb10" hover-class="grayBg" @tap="_onCancel"  :style="{color:cancelColor}">
									<view class="ptb1">
										{{_cancelText}}
									</view>
								</view> 
								
								<view v-if="ts.showConfirm" :class="{'bl' : ts.showCancel , 'disabled' : confirmDisabled}" class="ptb10" hover-class="grayBg" @tap="_onConfirm"  :style="{color:confirmColor}">
									<view class="ptb1">
										{{_confirmText}}
									</view>
								</view>
								
							</view>
							
						</block>
						
						
					</view>
					
					
				</view>
				
			</b-animate>
			
		</view>
		
	</view>
</template>

<script>
	import modal from "./b-modal.js" ;
	/**
	* @description Modal 响应式模态框，一个在各个设备上具有良好的适配性、内容可以弹性伸缩的弹层视图容器。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/modal
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}                  default          默认作用域插槽，可使用作用域变量data。
	* @slot                               header           自定义头部插槽，使用后顶部的title区域将被取代。
	* @slot                               footer           自定义底部插槽，使用后底部的按钮区域将被取代。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                beforeShow       显示模态框之前触发 | 参数：( isShow )
	* @event    {Function}                beforeHide       隐藏模态框之前触发 | 参数：( isShow )
	* @event    {Function}                change           模态框状态变更完成后触发，可根据参数判断当前的显示状态。 | 参数：( isShow )
	* @event    {Function}                confirm          点击确认按钮时触发 | 参数：( e )
	* @event    {Function}                cancel           点击取消按钮时触发 | 参数：( e )
	* @event    {Function}                close            点击右上角关闭按钮时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                             show()           显示模态框，允许接收一个回调函数和注入模态框的json数据，另外这两个参数允许只传入一个而无须关心其顺序，如show(callback)与show(data)都是可以的。 ( callback , data )
	* @method                             hide()           隐藏模态框。 ( callback )
	* @method                             toggle()         切换模态框的显示、隐藏状态，允许接收一个回调函数和注入模态框的json数据，另外这两个参数允许只传入一个而无须关心其顺序，如toggle(callback)与toggle(data)都是可以的噢。 ( callback , data )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}          close-by-mask    点击背景遮罩层关闭弹窗，默认true。
	*    @value                           true             
	*    @value                           false            
	* @property {Boolean|String}          destory-on-hide  模态框隐藏时销毁组件，下次显示时重新渲染，默认true。在保留用户输入、操作状态的一些场景，你可以设置为false。
	*    @value                           true             
	*    @value                           false            
	* @property {Number}                  duration         动画持续时间，单位ms，默认300。
	* @property {String}                  in-class         入场动画动画类名，默认zoomIn，支持内置动画类名与自定义动画类名。
	*    @value                           fadeIn           淡入
	*    @value                           fadeInDown       从上往下淡入
	*    @value                           fadeInDownSm     小幅度从上往下淡入
	*    @value                           fadeInDownLg     大幅度从上往下淡入
	*    @value                           fadeInLeft       从左侧淡入
	*    @value                           fadeInLeftSm     小幅度从左侧淡入
	*    @value                           fadeInLeftLg     大幅度从左侧淡入
	*    @value                           fadeInRight      从右侧淡入
	*    @value                           fadeInRightSm    小幅度从右侧淡入
	*    @value                           fadeInRightLg    大幅度从右侧淡入
	*    @value                           fadeInUp         从下往上淡入
	*    @value                           fadeInUpSm       小幅度从下往上淡入
	*    @value                           fadeInUpLg       大幅度从下往上淡入
	*    @value                           zoomInSm         缩小后淡入
	*    @value                           zoomIn           变大后淡入
	*    @value                           slideDown        下拉展开
	*    @value                           circle           旋转
	* @property {Boolean|String}          mask             显示黑色半透明背景，默认true。
	*    @value                           true             
	*    @value                           false            
	* @property {String}                  out-class        出场动画动画类名，默认zoomOut，支持内置动画类名与自定义动画类名。
	*    @value                           fadeOut          淡出
	*    @value                           fadeOutDown      向下淡出
	*    @value                           fadeOutDownSm    小幅度向下淡出
	*    @value                           fadeOutDownLg    大幅度向下淡出
	*    @value                           fadeOutLeft      向左淡出
	*    @value                           fadeOutLeftSm    小幅度向左淡出
	*    @value                           fadeOutLeftLg    大幅度向左淡出
	*    @value                           fadeOutRight     向右淡出
	*    @value                           fadeOutRightSm   小幅度向右淡出
	*    @value                           fadeOutRightLg   大幅度向右淡出
	*    @value                           fadeOutUp        向上淡出
	*    @value                           fadeOutUpSm      小幅度向上淡出
	*    @value                           fadeOutUpLg      大幅度向上淡出
	*    @value                           zoomOutSm        缩小淡出
	*    @value                           zoomOut          变大淡出
	*    @value                           slideUp          上拉收起
	* @property {String}                  title            标题
	* @property {Boolean|String}          v-model          数据双向绑定，控制模态框的显示、隐藏状态，与value属性选择使用即可。
	*    @value                           true             
	*    @value                           false            
	* @property {Boolean|String}          value            显示模态框，默认false，动态改变其值可以控制模态框的显示、隐藏状态，通常与v-model属性来选择使用。
	*    @value                           true             
	*    @value                           false            
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 按钮类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}            btn-align        【响应式属性】 按钮的对齐方式，默认right。
	*    @value                           right            右对齐
	*    @value                           center           居中对齐
	*    @value                           left             左对齐
	*    @value                           around           平均分布
	*    @value                           between          两端对齐
	* @property {String|Array}            btn-type         【响应式属性】 底部确认、取消按钮的样式类型，手机端默认coverBtn，其他设备默认btn。
	*    @value                           coverBtn         铺满底部
	*    @value                           btn              按钮类型
	* @property {String}                  cancel-color     取消按钮文字颜色，btn-style为tapBtn时有效。
	* @property {String}                  cancel-text      取消按钮文字，默认：取消。
	* @property {String}                  close-icon       关闭按钮图标，默认bIcon-multiply，可通过配置文件配置components.modal.closeIcon来修改默认值。
	* @property {String}                  confirm-color    确认按钮文字颜色，btn-style为tapBtn时有效。
	* @property {String}                  confirm-text     确认按钮文字，默认：确定。
	* @property {Boolean|String}          round-btn        底部按钮为圆形按钮，默认false。
	*    @value                           true             
	*    @value                           false            
	* @property {Boolean|String}          show-cancel      显示取消按钮，默认true。
	*    @value                           true             
	*    @value                           false            
	* @property {Boolean|String}          show-close       显示右上角的关闭按钮，默认true。
	*    @value                           true             
	*    @value                           false            
	* @property {Boolean|String}          show-confirm     显示确认按钮，默认true。
	*    @value                           true             
	*    @value                           false            
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 位置类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Array}     bottom           【响应式属性】 当模态框位置palcement为bottomCenter时，用于调整距离底部的距离，默认0。
	* @property {String|Number|Array}     gutter           【响应式属性】 模态框父级容器的左右内边距（模态框是被放在一个fixed定位的父级容器中），默认['30rpx','20rpx','0']，模态框宽度为100%时，用于调整模态框的水平位置。
	* @property {String|Array}            placement        【响应式属性】 模态框的位置，默认center。
	*    @value                           center           居中
	*    @value                           topCenter        顶部居中
	*    @value                           bottomCenter     底部居中
	* @property {String|Number|Array}     top              【响应式属性】 当模态框位置palcement为topCenter时，用于调整距离顶部的距离，默认0。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                  body-class       模态框内容部分的样式类名，默认"plr ptb10,pd"，可通过配置文件配置components.modal.bodyClass来修改默认值。
	* @property {String}                  body-style       模态框内容部分的样式，同css样式
	* @property {String}                  header-class     模态框头部的样式类名，默认"flex ptb10 plr fz16"，可通过配置文件配置components.modal.headerClass来修改默认值。
	* @property {String}                  header-style     模态框头部部分的样式，同css样式
	* @property {String|Number|Array}     height           【响应式属性】 固定高度，通常用于模态框高度固定的场景，多数情况下更推荐使用max-height属性来构建高度弹性伸缩的模态框容器。
	* @property {String|Number|Array}     max-height       【响应式属性】 最大高度，默认80%，通常用于构建高度弹性伸缩的模态框容器。
	* @property {String|Number|Array}     min-height       【响应式属性】 最小高度，默认200upx。
	* @property {String}                  modal-class      模态框的样式类名，默认"whiteBg rds3"，可通过配置文件配置components.modal.modalClass来修改默认值。
	* @property {String}                  modal-style      模态框的样式，同css样式
	* @property {String|Number|Array}     width            【响应式属性】 宽度，默认['100%','90%','80%','70%','50%']
	* @property {Number}                  z-index          定位层级，默认10。
	* 
	* @property {String}                  ref               获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-modal",
		mixins: [ modal ]
	}
</script>