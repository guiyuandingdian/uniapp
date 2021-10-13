<template>
	
	<view class="b-result">
		<b-modal 
			width="600rpx"
			top="0"
			placement="center"
			:value="initValue"
			:ref="refId" 
			:in-class="inClass"
			:out-class="outClass"
			:close-by-mask="closeByMask"
			:show-close="showClose"
			@change="_onChange"
			@beforeShow="_beforeChange"
			@beforeHide="_beforeChange">
	
			<!-- 自定义顶部插槽-->
			<view slot="header">
				
				<view class="w100 center-block pt30 pb10">
					<view class="square">
						
						<block v-if="$slots.icon">
							<slot name="icon"></slot>
						</block>
						<block v-else-if="!image">
							<view class="bg op1 rds" :style="bgStyle"></view>
							<view class="flex ct lh1">
								<view :class="_icon" :style="iconStyle"></view>
							</view>
						</block>
						<block v-else>
							<image :src="image" mode="aspectFill" class="block rds"></image>
						</block>
						
						
					</view>
				</view>
				
			</view>
	
	
			<view class="text-center">
				<view class="ptb10 fz18 plr10">{{_title}}</view>
				<view class="grey break autoY" v-if="_remark" style="max-height: 400rpx;">
					<view class="plr5" :class="remarkClass">
						<rich-text :nodes="_remark"></rich-text>
					</view>
				</view>
			</view>
	
	
			<!-- 自定义底部插槽-->
			
			
			<template slot="footer">
				
				<slot v-if="hasSlots"></slot>
				
				<view v-else class="flex ct ptb40">
					
					<b-btn 
						:color="_color" 
						radius="40" 
						ptb="8" 
						width="110"
						@tap="hide()">我知道啦</b-btn>
						
				</view>

			</template>
	
		</b-modal>
		
		
		
	</view>
</template>

<script>
	/**
	* @description Result 反馈弹窗，用于展示响应结果反馈信息、操作结果反馈信息的响应式反馈弹窗。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/result
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，使用后将覆盖默认的底部按钮。
	* @slot                            icon                图标插槽，使用后将覆盖默认的图片、图标内容。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             beforeHide          隐藏之前触发 | 参数：( isShow )
	* @event    {Function}             beforeShow          显示之前触发 | 参数：( isShow )
	* @event    {Function}             change              显示、隐藏弹窗后触发 | 参数：( isShow )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          toggle()            切换弹窗的显示、隐藏状态 ( callback )
	* @method                          show()              显示弹窗 ( callback )
	* @method                          hide()              隐藏弹窗后触发 ( callback )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               color               图标颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String}               icon                图标样式类名，支持自定义图标类名，默认bIcon-okFill，与image属性二选一选择使用。
	*    @value                        bIcon-closeFill     提交失败
	*    @value                        bIcon-waitFill      等待状态
	*    @value                        bIcon-warnFill      警告状态
	*    @value                        bIcon-okFill        默认值，提交成功
	* @property {String}               image               图标图片地址，使用图片时，不显示图标。
	* @property {String}               in-class            显示动画类名，详情参考b-animate组件，默认zoomIn。
	*    @value                        fadeIn              淡入
	*    @value                        fadeInDown          从上往下淡入
	*    @value                        fadeInDownSm        小幅度从上往下淡入
	*    @value                        fadeInDownLg        大幅度从上往下淡入
	*    @value                        fadeInLeft          从左侧淡入
	*    @value                        fadeInLeftSm        小幅度从左侧淡入
	*    @value                        fadeInLeftLg        大幅度从左侧淡入
	*    @value                        fadeInRight         从右侧淡入
	*    @value                        fadeInRightSm       小幅度从右侧淡入
	*    @value                        fadeInRightLg       大幅度从右侧淡入
	*    @value                        fadeInUp            从下往上淡入
	*    @value                        fadeInUpSm          小幅度从下往上淡入
	*    @value                        fadeInUpLg          大幅度从下往上淡入
	*    @value                        zoomInSm            缩小后淡入
	*    @value                        zoomIn              变大后淡入
	*    @value                        slideDown           下拉展开
	*    @value                        circle              旋转
	* @property {String}               out-class           隐藏动画类名，详情参考b-animate组件，默认zoomOut。
	*    @value                        fadeOut             淡出
	*    @value                        fadeOutDown         向下淡出
	*    @value                        fadeOutDownSm       小幅度向下淡出
	*    @value                        fadeOutDownLg       大幅度向下淡出
	*    @value                        fadeOutLeft         向左淡出
	*    @value                        fadeOutLeftSm       小幅度向左淡出
	*    @value                        fadeOutLeftLg       大幅度向左淡出
	*    @value                        fadeOutRight        向右淡出
	*    @value                        fadeOutRightSm      小幅度向右淡出
	*    @value                        fadeOutRightLg      大幅度向右淡出
	*    @value                        fadeOutUp           向上淡出
	*    @value                        fadeOutUpSm         小幅度向上淡出
	*    @value                        fadeOutUpLg         大幅度向上淡出
	*    @value                        zoomOutSm           缩小淡出
	*    @value                        zoomOut             变大淡出
	*    @value                        slideUp             上拉收起
	* @property {String}               remark              说明信息，选填属性。
	* @property {Boolean|String}       show-icon-bg        显示图标背景色块，默认true。
	* @property {String}               title               标题，必填属性
	* @property {Boolean|String}       v-model             数据双向绑定，控制弹窗的显示、隐藏状态，与value属性选择使用即可。
	* @property {Boolean|String}       value               显示反馈弹窗，默认false，动态改变其值可以控制反馈弹窗的显示、隐藏状态，通常与v-model属性来选择使用。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name: 'b-result' ,
		props: {
			title: String ,
			remark: String ,
			image:String,
			icon: {
				type : String ,
				default: "bIcon-okFill"
			},
			inClass: {
				type : String ,
				default: "fadeInDownSm"
			},
			outClass: {
				type : String ,
				default: "zoomOut"
			},
			color: {
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor")
				}
			},
			remarkClass: String ,
			showClose: {
				type : [String , Boolean] ,
				default: true 
			},
			showIconBg: {
				type : [String , Boolean] ,
				default: true 
			},
			closeByMask: {
				type : [String , Boolean] ,
				default: true 
			},
			value: {
				type : [String , Boolean] ,
				default: false 
			}
		},
		data(){
			return {
				showConfig : {} ,
				status : '' ,
				initValue : false ,
				isShowSync : false ,
				// #ifdef MP-TOUTIAO
				refId : uni.$b.buuid()
				// #endif
				// #ifndef MP-TOUTIAO
				refId : "modal"
				// #endif
			}
		},
		computed:{
			_showIconBg(){
				return uni.$b.isTrue(this.showIconBg) ;
			},
			bgStyle(){
				return uni.$b.getStyle({
					"background-color" : this._showIconBg ? this._color : ''
				})
			},
			iconStyle(){
				return uni.$b.getStyle({
					"font-size":`${this._showIconBg ? '60px' : '90px'}`,
					"color" : this._color
				})
			},
			hasSlots(){
				return uni.$b.hasSlots.call(this);
			},
			_title(){
				return this.showConfig.title || this.title ;
			},
			_remark(){
				return this.showConfig.remark || this.remark ;
			},
			_icon(){
				return this.showConfig.icon || this.icon ;
			},
			_color(){
				return this.showConfig.color || this.color ;
			}
		},
		watch:{
			value(isShow , o){
				isShow = uni.$b.isTrue(isShow) ;
				if(this.isShowSync === isShow){
					return ;
				}
				if (isShow) {
					this.show() ;
				}else{
					this.hide() ;
				}
			}
		},
		created() {
			let value = uni.$b.isTrue(this.value) ;
			this.initValue = value ;
			this.isShowSync = value ;
		},
		
		methods:{
			//模态框状态发生变化
			_beforeChange(isShow){
				if (isShow) {
					this.status = "showing" ;
					this.$emit("beforeShow" , true );
					return ;
				}
				this.status = "hiding" ;
				this.$emit("beforeHide" , false );
			},
			
			//模态框隐藏、显示
			_onChange(isShow){
				this.status = "" ;
				this.isShowSync = isShow ;
				this.$emit("input" , isShow);
				this.$emit("change" , isShow);
				this.$emit( isShow ? "show" : "hide" , isShow);
			},
			
			toggle(callBack){
				if (this.status == 'showing') {
					return this.hide(callBack) ;
				}
				if (this.status == 'showing') {
					return this.show(callBack) ;
				}
				if (this.isShowSync) {
					this.hide(callBack);
				}else{
					this.show(callBack);
				}
			},
			
			hide(){
				this.$refs[this.refId].hide();
			},
			
			show( config = {} ){
				this.showConfig = {...config} ;
				this.$refs[this.refId].show();
			}
		}
	}
</script>