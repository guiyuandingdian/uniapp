<template>
	<view class="b-message fixed" :class="_placement" :style="myStyle">

		<b-animate 
			:ref="refId"
			:value="initValue"
			:in-class="inClass" 
			:out-class="outClass"
			:stay-time="stayTime"
			:repeat="true"
			@beforeHide="$emit('beforeHide' , $event)"
			@beforeShow="$emit('beforeShow' , $event)"
			@change="_change">
			
			<!-- 消息提示盒子 -->
			<view class="ww flex ct">
				<view class="box father flex ct"
					:class="boxClass" 
					:style="_boxStyle">
					
					<slot v-if="$scopedSlots.default" :data="data"></slot>
					
					<view v-else class="break">
						
						<text class="mr7" 
							:class="_icon" 
							:style="{color : _iconColor}" 
							v-if="_icon"></text>
							
						<text>{{_content}}</text>
						
					</view>
					
					<view class="abs top right pr15 ptb10 fz12 bIcon-multiply" v-if="_showClose" @tap="hide()">
						<view class="closeBtn pt1"></view>
					</view>
					
				</view>
			</view>
			
			
		</b-animate>
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	/**
	* @description Message 消息提示，用于交互反馈提示信息，内置操作成功、操作失败、警示三种常用提示消息类型样式。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/message
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}                  default          默认作用域插槽，可用于自定义消息提示框内容，可使用作用域变量data。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                beforeShow       显示之前触发 | 参数：( isShow )
	* @event    {Function}                beforeHide       消失之前触发 | 参数：( isShow )
	* @event    {Function}                change           入场或出场结束后触发 | 参数：( isShow )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                             show()           显示消息提示框，可传入消息内容，也可传入data参数，作为消息提示框的作用域变量。 ( data )
	* @method                             hide()           隐藏消息提示框 --
	* @method                             toggle()         显示时隐藏，隐藏时显示。 ( data )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 常用属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Number}                  duration         消息提示框停留时间，到时间后自动消失，show-close属性为false时有效，单位ms，默认3000。
	* @property {Boolean|String}          is-show          显示消息提示框，message有值时有效，默认false，与v-model二选一使用。
	* @property {String}                  message          消息内容，有值时消息提示框才会显示。
	* @property {String}                  type             消息提示类型，通过该属性可计算出对应的icon、iconColor，默认ok。可通过配置文件配置components.message.typeList来配置常用的消息提示类型。
	*    @value                           ok               操作成功
	*    @value                           fail             操作失败
	*    @value                           warn             警示信息
	* @property {Boolean|String}          v-model          数据双向绑定，与is-show属性二选一使用，用于控制消息提示框的显示状态。
	* @property {Number}                  z-index          弹层的堆叠顺序，默认30。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                  box-style        消息提示框的样式，同css的style样式，可自定义背景色、文字颜色、边线颜色等样式。
	* @property {String}                  icon             自定义图标类名
	* @property {String}                  icon-color       图标的自定义颜色
	* @property {String}                  in-class         入场动画类名，默认fadeInDownSm。
	* @property {String}                  out-class        出场动画类名，默认fadeOutUpSm。
	* @property {String|Array}            placement        【响应式属性】 消息提示框的位置，默认topCenter。
	*    @value                           center           居中
	*    @value                           topCenter        顶部居中
	*    @value                           bottomCenter     底部居中
	* @property {Boolean|String}          show-close       显示关闭按钮，默认false，配置为true时，duration属性将失效。
	* @property {String|Number|Array}     top              【响应式属性】 提示框与顶部的距离，默认20px。
	* 
	* @property {String}                  ref               获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-message" ,
		mixins:[mediaMixins],
		props:{
			value : [Boolean , String] ,
			type : {
				type : String ,
				default : "ok"
			},
			placement:{
				type : [String , Array],
				default(){
					return 'topCenter';
				}
			},
			maxWidth:{
				type : [String,Number,Array],
				default(){
					return ["680rpx","800rpx"] ;
				}
			},
			content : String ,
			icon : String,
			duration :{
				type : Number ,
				default : 3000
			},
			iconColor : String ,
			boxStyle : String ,
			showClose : {
				type : [Boolean , String] ,
				default : false 
			} ,
			inClass : {
				type : String ,
				default : "fadeInDownSm"
			},
			outClass : {
				type : String ,
				default : "fadeOutUpSm"
			},
			zIndex : {
				type : Number ,
				default : 30
			},
			top:{
				type : [String , Number , Array] ,
				default(){
					// #ifdef H5
					return uni.getSystemInfoSync().windowTop + 20 ;
					// #endif
					// #ifndef H5
					return uni.getSystemInfoSync().statusBarHeight ;
					// #endif
				}
			}
		},
		data() {
			return {
				status : "" ,
				initValue : false ,
				isShowSync : false ,
				data : {} ,
				refId : uni.$b.buuid()
			}
		},
		computed:{
			_placement(){
				return this.dv(this.placement) ;
			},
			_showClose(){
				return uni.$b.isTrue(this.showClose) ;
			},
			_content(){
				return this.data.content || this.content ;
			},
			_icon(){
				return this.getValueByType("icon") ;
			},
			_iconColor(){
				return this.getValueByType("iconColor") ;
			},
			myStyle(){
				return uni.$b.getStyle({
					'z-index' : this.zIndex ,
					'top' : this.uv(this.top)
				});
			},
			_boxStyle(){
				return uni.$b.getStyle({
					'max-width' : this.uv(this.maxWidth)
				});
			},
			boxClass(){
				return this._showClose ? 'pr45 pl15' : 'plr30' ;
			},
			stayTime(){
				return this._showClose ? -1 : this.duration ;
			}
		},
		watch:{
			value(isShow){
				isShow = uni.$b.isTrue(isShow) ;
				if (isShow === this.isShowSync) {
					return ;
				}
				if (isShow) {
					this.show();
				}else{
					this.hide();
				}
			},
			content :{
				handler(){
					this.messageSync = this.content ;
				},
				immediate : true 
			}
		},
		created() {
			this.initValue = this.value ;
		},
		methods: {
			
			_change(isShow){
				this.status = '' ;
				this.isShowSync = isShow ;
				this.$emit("input" , isShow) ;
				this.$emit("change" , isShow) ;
				if (!isShow) {
					this.data = {} ;
				}
			},
			show(data){
				if (uni.$b.isObject(data)) {
					this.data = data ;
				}
				if (uni.$b.isString(data)) {
					this.data = {content : data};
				}
				this.status = 'showing' ;
				let ref = this.$refs[this.refId] ;
				ref && ref.show();
			},
			hide(){
				this.status = 'hiding' ;
				let ref = this.$refs[this.refId] ;
				ref && ref.hide();
			},
			toggle(msg ,data){
				if (this.status == 'hiding') {
					return this.show(msg , data) ;
				}
				if (this.status == 'showing') {
					return this.hide() ;
				}
				this.isShowSync ? this.hide() : this.show(msg,data) ;
			},
			getValueByType(key){
				if (uni.$b.notNull(this.data[key])) {
					return this.data[key] ;
				}
				if (uni.$b.notNull(this.$props[key])) {
					return this.$props[key] ;
				}
				let typeList = uni.$b.getValue("components.message.typeList" , []);
				let item = typeList.find(item=>item.type == this.type) ;
				return item ? item[key] : '' ;
			}
		}
	}
</script>
