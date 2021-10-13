<template>
	<view class="father b-popover" 
		@mouseover="_hoverShow"
		@mouseleave="_leaveHide"
		@touchstart="_hoverShow"
		@touchend="_leaveHide"
		:class="placementClass">
		
		<view v-if="isShowSync && _trigger == 'click'" class="fixed z2" @tap="toggle()"></view>
		
		<!-- 覆盖边缘空隙 -->
		<view v-if="isShowSync && _trigger == 'hover'" class="abs center z2 coverTarget" @tap="toggle()"></view>
		
		<!-- target -->
		<view class="inline father z3 target" id="reference"
			@tap="toggle()" 
			@mousedown="_toggleByFocus(true)" 
			@mouseup="_toggleByFocus(false)">
			
			<slot></slot>
			
		</view>
		
		
		<view class="popover" :style="popoverStyle" >
			<b-animate class="father"
				:ref="`${uid}_popover`"
				:inClass="inClassSync"
				:outClass="outClassSync"
				:duration="200"
				:destory-on-hide="false"
				:value="false"
				@beforeShow="_beforeShow"
				@beforeHide="_beforeHide"
				@change="_change">
				
				
				<view class="shadow rds4 bd" :style="contentStyle">
					
					<view class="hidden abs">
						<view class="abs left bottom rds" :style="popoStyle"></view>
						<view class="abs right top rds" :style="bigPopoStyle"></view>
					</view>
					
					<scroll-view :scroll-y="true" class="h100p father z1" :style="innerStyle">
						<slot name="content" :data="scopedData"></slot>
					</scroll-view>
					
				</view>
				
				
			</b-animate>
		</view>
		
		
		
		
		<!-- 箭头 -->
		<view class="popover-arrow" :style="arrowStyle">
			<b-animate
				v-if="_showArrow"
				:ref="`${uid}_arrow`"
				:inClass="inClassSync"
				:outClass="outClassSync"
				:value="false"
				:duration="200">

				<view class="before" :style="beforeStyle"></view>
				<view class="after" :style="afterStyle"></view>

			</b-animate>
		</view>
		
		
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js";
	/**
	* @description Popover 响应式弹出窗，在各个设备上具有良好适配性的弹出窗，它展现的触发方式也可以是响应式的。
	* @tutorial    https://base-view.cn/#/pages/doc/popover
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}                       content     弹窗内容插槽，用于放置弹出窗内容，可使用show()方法传入作用域变量。
	* @slot                                    default     弹出窗触发插槽，用于放置触发弹出窗显示、隐藏的元素
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                     beforeShow  弹出窗显示之前触发 | 参数：( isShow )
	* @event    {Function}                     beforeHide  弹出窗隐藏之前触发 | 参数：( isShow )
	* @event    {Function}                     change      弹出窗显示、隐藏后触发 | 参数：( isShow )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                                  show()      显示弹出窗，接收data、callback两个参数，可以同时传入，也可以只传入任意一个。 ( data , callback )
	* @method                                  hide()      隐藏弹出窗 ( callback )
	* @method                                  toggle()    隐藏时显示，显示时隐藏 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       placement   【响应式属性】 弹出窗的位置，默认"fixBottom,fixBottom,right"。
	*    @value                                fixTop      位于顶部，横向铺满，此时width属性无效。
	*    @value                                fixBottom   位于底部，横向铺满，此时width属性无效。
	*    @value                                right       右侧
	*    @value                                rightTop    右上
	*    @value                                rightBottom 右下
	*    @value                                left        左侧
	*    @value                                leftTop     左上
	*    @value                                leftBottom  左下
	*    @value                                top         顶部
	*    @value                                topLeft     顶部左对齐
	*    @value                                topRight    顶部右对齐
	*    @value                                bottom      底部
	*    @value                                bottomLeft  底部左对齐
	*    @value                                bottomRight 底部右对齐
	* @property {String|Array}                 trigger     【响应式属性】 弹出窗的触发方式，默认hover 。
	*    @value                                click       点击切换显示、隐藏。
	*    @value                                hover       鼠标移入显示、移出触发。
	*    @value                                focus       鼠标按住显示，松开隐藏。
	*    @value                                none        无，可通过变量或内置方法来控制显示状态。
	* @property {Boolean|String}               value       显示弹出窗，默认false，动态改变其值可以控制弹出窗的显示、隐藏状态，通常与v-model属性来选择使用。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               v-model     数据双向绑定，控制弹出窗的显示、隐藏状态，与value属性选择使用即可。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       in-class    显示动画类名，详情参考b-animate组件。
	*    @value                                fadeIn      淡入
	*    @value                                fadeInDown  从上往下淡入
	*    @value                                fadeInDownSm 小幅度从上往下淡入
	*    @value                                fadeInDownLg 大幅度从上往下淡入
	*    @value                                fadeInLeft  从左侧淡入
	*    @value                                fadeInLeftSm 小幅度从左侧淡入
	*    @value                                fadeInLeftLg 大幅度从左侧淡入
	*    @value                                fadeInRight 从右侧淡入
	*    @value                                fadeInRightSm 小幅度从右侧淡入
	*    @value                                fadeInRightLg 大幅度从右侧淡入
	*    @value                                fadeInUp    从下往上淡入
	*    @value                                fadeInUpSm  小幅度从下往上淡入
	*    @value                                fadeInUpLg  大幅度从下往上淡入
	*    @value                                zoomInSm    缩小后淡入
	*    @value                                zoomIn      变大后淡入
	*    @value                                slideDown   下拉展开
	*    @value                                circle      旋转
	* @property {String}                       out-class   隐藏动画类名，详情参考b-animate组件。
	*    @value                                fadeOut     淡出
	*    @value                                fadeOutDown 向下淡出
	*    @value                                fadeOutDownSm 小幅度向下淡出
	*    @value                                fadeOutDownLg 大幅度向下淡出
	*    @value                                fadeOutLeft 向左淡出
	*    @value                                fadeOutLeftSm 小幅度向左淡出
	*    @value                                fadeOutLeftLg 大幅度向左淡出
	*    @value                                fadeOutRight 向右淡出
	*    @value                                fadeOutRightSm 小幅度向右淡出
	*    @value                                fadeOutRightLg 大幅度向右淡出
	*    @value                                fadeOutUp   向上淡出
	*    @value                                fadeOutUpSm 小幅度向上淡出
	*    @value                                fadeOutUpLg 大幅度向上淡出
	*    @value                                zoomOutSm   缩小淡出
	*    @value                                zoomOut     变大淡出
	*    @value                                slideUp     上拉收起
	* @property {Boolean|String}               exclusive   排他性，显示当前弹出窗时，隐藏其他的弹出窗，默认true。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               hide-arrow  是否隐藏三角箭头，默认false。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               disabled    禁用
	*    @value                                true        
	*    @value                                false       
	* @property {String|Number}                show-delay  鼠标划入显示弹出窗的延迟时间，弹出窗较多时，配置适当的延迟时间可以避免鼠标划过弹窗乱弹的情况，trigger属性为hover时有效，单位ms，默认200。
	* @property {String|Number}                hide-delay  鼠标划出隐藏弹出窗的延迟时间，trigger属性为hover时有效，单位ms，默认200。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Array}          width       【响应式属性】 弹出窗的宽度，默认800rpx。
	* @property {String|Number|Array}          max-height  【响应式属性】 弹出窗的最大高度，默认500,500,700。
	* @property {String|Number|Array}          ptb         【响应式属性】 上下内边距，默认30rpx。
	* @property {String|Number|Array}          plr         【响应式属性】 左右内边距，默认30rpx。
	* @property {String|Number}                z-index     弹出窗的层级，默认14。
	* @property {String}                       bg-color    背景色，默认#fff。
	*    @value                                #e1251b     红色
	*    @value                                #FF6D8A     粉色
	*    @value                                #f69c00     黄色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String}                       border-color 边线颜色，默认#e0e0e0。
	* @property {String}                       popo-color  泡泡的颜色，不显示泡泡可设为transparent，默认transparent。
	*    @value                                rgba(255,255,255,0.01) 白色
	*    @value                                rgba(0,0,0,0.01) 黑色
	*    @value                                transparent 透明
	* @property {String|Number|Array}          offset      【响应式属性】 弹出窗偏移的距离，默认0。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* 
	* @property {String}                       ref          获取组件对象，通常用于调用组件内置方法。
	* @property {String}                       v-slot:default  默认插槽作用域变量
	*/
	export default {
		name:"b-popover",
		mixins:[mediaMixins] ,
		props:{
			value : [Boolean,String] ,
			trigger:{
				type : [String,Array] ,
				default(){
					return "hover" ;
				}
			},
			bgColor:{
				type : String ,
				default : "#fff"
			},
			borderColor:{
				type : String ,
				default : "#e0e0e0"
			},
			popoColor:{
				type : String ,
				default : "transparent"
			},
			exclusive : {
				type : [Boolean , String],
				default : true 
			},
			width : {
				type : [Number,String,Array] ,
				default : function(res){
					return 'auto'
				}
			},
			ptb : {
				type : [Number,String,Array] ,
				default : function(res){
					return '30rpx'
				}
			},
			plr : {
				type : [Number,String,Array] ,
				default : function(res){
					return '30rpx'
				}
			},
			maxHeight : {
				type : [Number,String,Array] ,
				default : function(res){
					return '500,500,700'
				}
			},
			placement:{
				type : [String,Array] ,
				default(){
					return "fixBottom,fixBottom,right" ;
				}
			},
			inClass:String,
			outClass:String,
			disabled : [Boolean,String] ,
			hideArrow : [Boolean,String] ,
			zIndex : {
				type : [String,Number] ,
				default : 14
			},
			showDelay : {
				type : [String,Number] ,
				default : 200
			},
			hideDelay : {
				type : [String,Number] ,
				default : 200
			},
			offset : {
				type : [String,Number,Array] ,
				default : 0
			}
		},
		
		data() {
			return {
				scopedData:{},
				uid : uni.$b.buuid() ,
				status : "" ,
				isShowSync : false ,
				inClassSync : "fadeIn" ,
				outClassSync : "fadeOut" ,
				rect : {
					top : 0 ,
					left : 0
				},
				popRect:{
					width : 0 ,
					height : 0
				},
				hoverTimer : null ,
				isHoverShow : null 
			}
		},
		
		computed:{
			
			_zIndex(){
				return Number(this.zIndex) ;
			},
			
			_exclusive(){
				return uni.$b.isTrue(this.exclusive) ;
			},
			
			_disabled(){
				return uni.$b.isTrue(this.disabled) ;
			},
			
			_trigger(){
				return this.dv(this.trigger);
			},
			
			_width(){
				return this.pv(this.width);
			},
			
			_offset(){
				return this.pv(this.offset);
			},
			
			_maxHeight(){
				return this.uv(this.maxHeight);
			},
			
			_placement(){
				return this.dv(this.placement);
			},
			
			_showArrow(){
				return !uni.$b.isTrue(this.hideArrow) ;
			},
			
			_ptb(){
				return this.uv(this.ptb);
			},
			
			_plr(){
				return this.uv(this.plr);
			},
			
			maxWidth(){
				return uni.$b.getSafeArea().width - 30 ;
			},
			
			placementClass(){
				if (this._placement != 'auto') {
					return this._placement ;
				}
				return this._getPlacement() ;
			},
			
			popoverStyle(){
				let className = this.placementClass ;
				let left = - this.rect.left + 15 ;
				let fixLeft = className == 'fixTop' || className == 'fixBottom' ? `${left}px` : '' ;
				let position = `calc(100% + 10px + ${this._offset})` ;
				return uni.$b.getStyle({
					"z-index" : this.zIndex ,
					"bottom" : ['top',"topRight","topLeft","fixTop"].includes(className) ? position : '' ,
					"top" : ['bottom',"bottomRight","bottomLeft","fixBottom"].includes(className) ? position : '' ,
					"left" : (className.indexOf("right") == 0 ? position : '') || fixLeft ,
					"right" : className.indexOf("left") == 0 ? position : '' ,
				});
			},
			
			arrowStyle(){
				let className = this.placementClass ;
				let position = `calc(-10px - ${this._offset})` ;
				return uni.$b.getStyle({
					"z-index" : this.zIndex ,
					"top" : ['top',"topRight","topLeft","fixTop"].includes(className) ? position : '' ,
					"bottom" : ['bottom',"bottomRight","bottomLeft","fixBottom"].includes(className) ? position : '' ,
					"right" : (className.indexOf("right") == 0 ? position : '') ,
					"left" : className.indexOf("left") == 0 ? position : '' ,
				});
			},
			
			contentStyle(){
				let className = this.placementClass ;
				let x = className == 'top' || className == 'bottom' ? "-50%" : 0 ;
				let y = className == 'left' || className == 'right' ? "-50%" : 0 ;
				return uni.$b.getStyle({
					"width" : className == 'fixTop' || className == 'fixBottom' ? `${this.maxWidth}px` : this._width ,
					"z-index" : this.zIndex ,
					"padding-top" : this._ptb ,
					"padding-bottom" : this._ptb ,
					"background-color" : this.bgColor ,
					"border-color" : this.borderColor ,
					"transform" : `translate(${x},${y})`
				});
			},
			
			innerStyle(){
				let className = this.placementClass ;
				return uni.$b.getStyle({
					"max-height" : this._maxHeight,
					"padding-left" : this._plr ,
					"padding-right" : this._plr 
				});
			},
			
			beforeStyle(){
				return this._getColorStyle(this.borderColor) ;
			},
			
			afterStyle(){
				return this._getColorStyle(this.bgColor) ;
			},
			
			popoSize(){
				let size = parseInt(this.popRect.height * 0.7)  ;
				return size > 120 ? 120 : size ;
			},
			
			popoStyle(){
				let size = this.popoSize ;
				return uni.$b.getStyle({
					"width" : `${size}px` ,
					"height" : `${size}px` ,
					"bottom" : `-${size/3}px`,
					"left" : `-${size/2}px`,
					"background" : this.popoColor
				});
			},
			
			bigPopoStyle(){
				let size = this.popoSize ;
				return uni.$b.getStyle({
					"width" : `${size}px` ,
					"height" : `${size}px` ,
					"top" : `${size/3}px`,
					"right" : `-${size/2}px`,
					"background" : this.popoColor
				});
			}
		},
		
		watch:{
			value(isShow){
				isShow = uni.$b.isTrue(isShow) ;
				if (this.isShowSync == isShow) {
					return ;
				}
				if (isShow) {
					this.show();
				}else{
					this.hide() ;
				}
			},
			
			inClass : {
				handler(){
					this.inClassSync = this.inClass || 'fadeIn';
				},
				immediate : true 
			},
			
			outClass : {
				handler(){
					this.outClassSync = this.outClass || 'fadeOut';
				},
				immediate : true 
			}
		},
		
		mounted() {
			if (uni.$b.isTrue(this.value)) {
				this.show() ;
			}
		},
		
		methods: {
			
			_getColorStyle(color){
				let p = this._placement ;
				let style = '' ;
				['left','right','top','bottom'].forEach(c=>{
					if (p && p.indexOf(c) == 0) {
						style = `border-${c}-color:${color}` ;
					}
				})
				return style ;
			},
			
			_beforeShow(){
				this.status = 'showing' ;
				this.$emit("beforeShow" , true );
			},
			
			_beforeHide(){
				this.status = 'hiding' ;
				this.$emit("beforeHide" , false );
			},
			
			_change(isShow){
				this.status = '' ;
				this.isShowSync = isShow ;
				if (!isShow) {
					this.scopedData = {} ;
				}
				uni.$emit("change" , isShow );
			},
			
			toggle(){
				if (this._trigger == 'focus') {
					return ;
				}
				if (this.status == 'showing') {
					return this.hide() ;
				}
				if (this.status == 'hiding') {
					return this.show() ;
				}
				return this.isShowSync ? this.hide() : this.show();
			},
			
			show(data , callback){
				if (this._disabled) {
					return ;
				}
				
				if (uni.$b.isObject(data)) {
					this.scopedData = data ;
				}else if (uni.$b.isObject(callback)) {
					this.scopedData = callback ;
				}
				
				//关闭其他的弹窗
				if (this._exclusive) {
					uni.$emit("$b_popover_show" , true ) ;
				}
				
				let ref = this.$refs[`${this.uid}_popover`] ;
				let queryRefer = uni.$b.select("#reference" , this) ;
				let queryPop = ref.queryRect() ;
				
				Promise.all([queryRefer , queryPop]).then(res=>{
					this.rect = res[0] ;
					this.popRect = res[1] ;
					
					ref.show(callback);
					this._toggleArrow(true);
					
					//监听其他弹窗打开事件
					if (this._exclusive) {
						uni.$once("$b_popover_show" , ()=>{
							this && this.hide();
						});
					}
				});
			},
			
			hide(callback){
				if (this._disabled) {
					return ;
				}
				let ref = this.$refs[`${this.uid}_popover`] ;
				ref && ref.hide(callback);
				this._toggleArrow(false);
			},
			
			_toggleArrow(isShow){
				let ref = this.$refs[`${this.uid}_arrow`] ;
				if ( !this._showArrow || !ref ) {
					return ;
				}
				if (isShow) {
					ref.show();
				}else{
					ref.hide();
				}
			},
			
			_hoverShow(e){
				clearTimeout(this.hoverTimer) ;
				if (this._trigger != 'hover' || this.isHoverShow ) {
					return ;
				}
				this.isHoverShow = true ;
				this.hoverTimer = setTimeout(e => {
					this.show()
				} , Number( this.showDelay ) );
			},
			
			_leaveHide(e){
				if (this._trigger != 'hover' || this.isHoverShow == false ) {
					return ;
				}
				clearTimeout(this.hoverTimer) ;
				this.hoverTimer = setTimeout(e => {
					this.isHoverShow = false ;
					this.hide() ;
				} , Number( this.hideDelay ) );
			},
			
			_toggleByFocus(isShow){
				if (this._trigger == 'focus') {
					return isShow ? this.show() : this.hide() ;
				}
			},
			
			/**
			 * @description 根据元素所处的位置计算弹窗的出现位置
			 */
			_getPlacement(){
				
				if (null == this.fatherRectSync) {
					return 'right' ;
				}
				
				//注意：windowWidth未减去windowLeft的宽度，但是windowHeight已减去windowTop的高度
				let { left : fatherLeft , top : fatherTop , right : fatherRight , bottom : fatherBottom , width : fatherWidth , height : fatherHeight } = this.fatherRectSync ;
				let { top , left , right , bottom , width , height } = this.rect ; //元素坐标
				
				// #ifdef H5
				/* 左侧窗体的宽度 */
				let leftWindow = document.getElementsByTagName("uni-left-window") ;
				if ( leftWindow.length > 0 ) {
					let windowLeft = leftWindow[0].offsetWidth ;
					left -= windowLeft ;
					right -= windowLeft ;
					fatherLeft -= windowLeft ;
					fatherRight -= windowLeft ;
				}
				// #endif
				
				let { width : popWidth , height : popHeight } = this.popRect ; //弹层区域
				//修正布局信息浮点数引起的前后取值不一致的问题
				popWidth = Math.round(popWidth + 10);
				popHeight = Math.round(popHeight + 10);
				
				let inRight = right + popWidth < fatherRight ;
				this._changeAnimateClass('fadeInRightSm' ,'fadeOutRightSm');
				//右侧
				if ( inRight && top - popHeight/2 > fatherTop && top + height/2 + popHeight/2 < fatherBottom ) {
					return 'right' ;
				}
				
				//右上
				if ( inRight && top + popHeight < fatherBottom ) {
					return 'rightTop' ;
				}
				
				//右下
				if ( inRight && bottom - popHeight > fatherTop ) {
					return 'rightBottom' ;
				}
				
				
				let inLeft = left - popWidth > fatherLeft ;
				this._changeAnimateClass('fadeInLeftSm' ,'fadeOutLeftSm');
				//左侧
				if ( inLeft && top - popHeight/2 > fatherTop && top + height/2 + popHeight/2 < fatherBottom ) {
					return 'left' ;
				}
				
				//左上
				if ( inLeft && top + popHeight < fatherBottom ) {
					return 'leftTop' ;
				}
				
				//左下
				if ( inLeft && bottom - popHeight > fatherTop) {
					return 'leftBottom' ;
				}
				
				let inTop = top - popHeight > fatherTop ;
				this._changeAnimateClass('fadeInDownSm' ,'fadeOutUpSm');
				//顶部
				if (inTop && left + width/2 - popWidth/2 > fatherLeft && left + width/2 + popWidth/2 < fatherRight ) {
					return 'top' ;
				}
				
				//顶左
				if (inTop && left + popWidth < fatherRight ) {
					return 'topLeft' ;
				}
				
				//顶右
				if (inTop && right - popWidth > fatherLeft ) {
					return 'topRight' ;
				}
				
				let inBottom = bottom + popHeight < fatherBottom ;
				this._changeAnimateClass('fadeInUpSm' ,'fadeOutDownSm');
				//底部
				if (inBottom && left + width/2 - popWidth/2 > fatherLeft && left + width/2 + popWidth/2 < fatherRight ) {
					return 'bottom' ;
				}
				
				//底部左侧
				if (inBottom && left + popWidth < fatherRight ) {
					return 'bottomLeft' ;
				}
				
				//底部右侧
				if (inBottom && right - popWidth > fatherLeft ) {
					return 'bottomRight' ;
				}
				
				//以下为兼容位置
				let isVertical = fatherHeight > fatherWidth ;
				this._changeAnimateClass('fadeInUpSm' ,'fadeOutDownSm');
				if (isVertical ) {
					return top > fatherBottom/2 ? 'top' : 'bottom' ;
				}
				
				this._changeAnimateClass('fadeInRightSm' ,'fadeOutRightSm');
				return left > fatherRight/2 ? 'leftTop' : 'rightTop' ;
			},
			
			_changeAnimateClass(inClass , outClass){
				if (uni.$b.isNull(this.inClass)) {
					this.inClassSync = inClass ;
				}
				if (uni.$b.isNull(this.outClass)) {
					this.outClassSync = outClass ;
				}
			}
		}
	}
</script>
<style lang="scss">
	
$borderWhite:#fff;
	
.b-popover{
	display: inline-block;
	.popover-arrow{
		position: absolute;
		.before,.after{
			width: 0;
			height: 0;
		}
		.after{
			position: absolute;
		}
	}
	.popover{
		position: absolute;
		z-index: 13;
	}
	&.right , &.rightTop , &.rightBottom{
		.popover{
			left: calc(100% + 10px);
		}
		.popover-arrow{
			right: -10px;
			top: 50%;
			transform: translate(0,-50%);
			.before,.after{
				border-top: 6px solid transparent;
				border-bottom: 6px solid transparent;
				border-right: 6px solid $borderColor;
			}
			.after{
				top: 0;
				left: 1px ;
				border-right-color:$borderWhite;
			}
		}
	}
	
	
	&.left , &.leftTop , &.leftBottom{
		.popover{
			right: calc(100% + 10px);
		}
		.popover-arrow{
			left: -10px;
			top: 50%;
			transform: translate(0,-50%);
			.before,.after{
				border-top: 6px solid transparent;
				border-bottom: 6px solid transparent;
				border-left: 6px solid $borderColor;
			}
			.after{
				top: 0;
				right: 1px;
				border-left-color:$borderWhite;
			}
		}
		
		
	}
	
	
	&.right , &.left{
		.popover{
			top: 50%;
		}
	}
	
	&.rightTop , &.leftTop{
		.popover{
			top: 0;
		}
	}
	
	&.rightBottom , &.leftBottom{
		.popover{
			bottom: 0;
		}
	}
	
	
	&.top , &.topLeft , &.topRight , &.fixTop{
		.popover{
			bottom: calc(100% + 10px);
		}
		.popover-arrow{
			top: -10px;
			left: 50%;
			transform: translate(-50% , 0);
			.before,.after{
				border-left: 6px solid transparent;
				border-right: 6px solid transparent;
				border-top: 6px solid $borderColor;
			}
			.after{
				top: -2px;
				border-top-color:$borderWhite;
			}
		}
	}
	
	
	&.bottom , &.bottomLeft , &.bottomRight , &.fixBottom{
		.popover{
			top: calc(100% + 10px);
		}
		.popover-arrow{
			bottom: -10px;
			left: 50%;
			transform: translate(-50% , 0);
			.before,.after{
				border-left: 6px solid transparent;
				border-right: 6px solid transparent;
				border-bottom: 6px solid $borderColor;
			}
			.after{
				top: 1px;
				border-bottom-color:$borderWhite;
			}
		}
	}
	
	
	&.top , &.bottom{
		.popover{
			left: 50%;
		}
	}
	
	&.fixTop , &.fixBottom{
		.popover{
			left: 15px;
		}
	}
	
	&.topRight , &.bottomRight{
		.popover{
			right: 0;
		}
	}
	
	&.topLeft , &.bottomLeft{
		.popover{
			left: 0;
		}
	}
}

.coverTarget{
	width: calc(100% + 40px);
	height: calc(100% + 40px);
}

.target{
	min-width: 30rpx;
	min-height: 30rpx;
}
</style>