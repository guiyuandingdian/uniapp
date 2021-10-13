<template>
	<view class="b-progress father">
		
		<block v-if="mode == 'line'">
			
			<!-- 进度条 -->
			<view id="progressBar" class="hidden" :style="trackStyle">
				<view class="b-bar flex ct" :style="innerStyle" :class="innerClass">
					<block v-if="_infoPosition == 'center'">
						<slot v-if="slots.default"></slot>
						<block v-else>{{_percent}}%</block>
					</block>
				</view>
			</view>
			
			<!-- 进度信息 -->
			<view v-if="!!placement" class="abs left" style="margin-left: -14rpx;"  :style="infoBoxStyle">
				
				<b-popover class="h100p"
					width="auto" 
					trigger="none"
					ptb="3"
					plr="10"
					:value="true"
					:bg-color="infoColor"
					:placement="placement">
					
					<view></view>
					
					<template slot="content">
						<slot v-if="slots.default"></slot>
						<block v-else>{{_percent}}%</block>
					</template>
					
				</b-popover>
				
			</view>
			
			
		</block>
		<block v-else>
			
			<view class="square" id="progressBar">
				
				<canvas class="item" :canvas-id="`${canvasId}bg`" :id="`${canvasId}bg`"></canvas>
				<canvas class="item" :canvas-id="canvasId" :id="canvasId"></canvas>
				
				<view v-if="placement" class="flex ct">
					<view class="text-center">
						<slot :percent="_percentText" v-if="slots.default"></slot>
						<view v-else class="fz20 bold">{{_percentText}}%</view>
					</view>
				</view>
				<view v-if="(title || slots.title) && mode == 'openCircle'" class="flex ct b" style="padding-bottom: 10%;">
					<view class="text-center">
						<slot v-if="slots.title" name="title"></slot>
						<view v-else class="fz12 gray">{{title}}</view>
					</view>
				</view>
			</view>
			
		</block>
		
		
	</view>
</template>

<script>
	/**
	* @description Progress 进度条，样式更自由的进度条
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/progress
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认插槽，用于自定义进度信息内容。应先设置info-position属性为top、center、bottom，用于覆盖默认的进度信息。
	* @slot                            title               当mode为openCircle时，用于自定义标题内容。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             complete            动画执行完毕后触发，mode为circle、openCircle时有效。 | 参数：( percent )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number}        percent             百分比，默认0。
	* @property {String|Number}        radius              圆角大小，默认23。
	* @property {String}               active-color        进度条颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #FF6D8A             粉色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String}               gradual-color       type为stripe或gradual时，与active-color搭配的渐变色。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #FF6D8A             粉色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String}               info-color          进度信息提示框的背景颜色，默认#fff。type为line时有效。
	*    @value                        #e1251b             红色
	*    @value                        #f69c00             黄色
	*    @value                        #FF6D8A             粉色
	*    @value                        #07c160             绿色
	*    @value                        #F74F0E             橘色
	*    @value                        #0081ff             蓝色
	*    @value                        #8B4512             棕色
	*    @value                        #6739b6             紫色
	*    @value                        #82939c             玄灰
	*    @value                        #777                灰色
	* @property {String|Number|Array}  size                【响应式属性】 进度条的尺寸大小，默认10。
	* @property {String}               background-color    进度条背景色，默认#EBEBEB。
	* @property {Boolean|String}       animation           进度变动时启用动画，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String|Array}         info-position       【响应式属性】 进度信息的位置，默认none。
	*    @value                        top                 进度条顶部，mode为line时有效。
	*    @value                        bottom              进度条底部，mode为line时有效。
	*    @value                        center              居中显示
	*    @value                        none                不显示进度信息
	* @property {String|Number}        duration            进度增加1%所需毫秒数，默认30。当mode为circle、openCircle时，应随着圆环增大而调小duration的值，以避免出现动画不连贯引起的闪屏。
	* @property {Boolean|String}       lazy-load           懒加载，当进入可视区域时激活动画，默认true。
	*    @value                        true                
	*    @value                        false               
	* @property {String}               type                进度条样式类型，默认stripe。
	*    @value                        stripe              条纹，仅mode为line时有效。
	*    @value                        gradual             渐变色
	*    @value                        color               纯色
	* @property {String}               mode                进度条的模式，默认line。
	*    @value                        line                线性进度条
	*    @value                        circle              闭合圆形进度条
	*    @value                        openCircle          未闭合圆形进度条
	* @property {String}               title               进度条下方的标题，mode为openCircle时有效。
	* @property {String|Number|Array}  margin              【响应式属性】 外边距，默认10。mode为circle、openCircle时有效。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}               v-slot:default       默认插槽作用域变量
	*/
	export default {
		name : "b-progress" ,
		mixins:[uni.$b._mixins.media , uni.$b._mixins.lazyLoad],
		props: {
			mode : {
				type : String ,
				default : "line" 
			},
			percent : {
				type : [String,Number],
				default : 0 
			},
			radius : {
				type : [String,Number] ,
				default : 23
			},
			size:{
				type : [String,Number,Array],
				default(){
					return 10 ;
				}
			},
			activeColor:{
				type : String ,
				default : uni.$b.getValue("components.mainColor")
			},
			backgroundColor:{
				type : String ,
				default : "#EBEBEB"
			},
			animation:{
				type : [String , Boolean],
				default : true 
			},
			lazyLoad:{
				type : [String , Boolean],
				default : true 
			},
			duration : {
				type : [String,Number],
				default : 30
			},
			type:{
				type : String,
				default : "stripe" 
			},
			gradualColor:{
				type : String ,
				default : "rgba(255,255,255,0.15)"
			},
			infoPosition:[String,Array],
			infoColor: String ,
			title: String ,
			margin : {
				type : [String,Number,Array],
				default(){
					return 10 ;
				}
			}
		},
		data() {
			return {
				changedPercent : 0 ,
				// #ifdef MP-WEIXIN
				canvasId : "canvas" ,
				// #endif
				// #ifndef MP-WEIXIN
				canvasId : uni.$b.buuid() ,
				// #endif
				width : 0 ,
				curPercent : 0 ,
				old : 0 ,
				ctx : null ,
				timer : null 
			}
		},
		computed:{
			
			slots(){
				return uni.$b.getSlots.call(this , "default" , "title" ) ;
			},
			
			_animation(){
				return uni.$b.isTrue(this.animation) ;
			},
			
			_size(){
				return this.uv(this.size) ;
			},
			
			lineWidth(){
				return parseFloat(this.pv(this.size)) ;
			},
			
			_margin(){
				return parseFloat(this.pv(this.margin)) ;
			},
			
			_infoPosition(){
				return this.dv(this.infoPosition) ;
			},
			
			trackStyle(){
				return uni.$b.getStyle({
					'background-color' : this.backgroundColor ,
					'height' : this._size ,
					'border-radius' : `${this.radius}px` 
				})
			},
			
			placement(){
				let position = this._infoPosition ;
				if (uni.$b.isNull(position)) {
					position = this.mode == 'line' ? '' : 'center' ; 
				}
				if ( position == '') {
					return '' ;
				}
				if(this._percent < 30){
					return `${position}Left` ;
				}
				if(this._percent > 70){
					return `${position}Right` ;
				}
				return position ;
			},
			
			_duration(){
				let duration = this._animation ? Number(this.duration) : 0 ;
				return Math.abs(duration * Number(this.changedPercent)) ;
			},
			
			_percent(){
				let percent = Number(this.percent);
				return percent > 100 ? 100 : ( percent < 0 ? 0 : percent ) ;
			},
			
			_infoColor(){
				return uni.$b.isNull(this.infoColor) ? this.activeColor : this.infoColor ;
			},
			
			infoBoxStyle(){
				return uni.$b.getStyle({
					'left' : this.inView ? `${this._percent}%` : '0%' ,
					'transition' : `left ${this._duration}ms`
				})
			},
			
			innerStyle(){
				return uni.$b.getStyle({
					'background-color' : this.activeColor ,
					'background-image' : this._getBgImg(),
					'height' : this._size ,
					'width' : this.inView ? `${this._percent}%` : '0%' ,
					'transition' : `width ${this._duration}ms`
				})
			},
			
			innerClass(){
				return uni.$b.getClassName({
					'b-movingBg' : this.type == 'stripe'
				})
			},
			
			sAngle(){
				return this.mode == 'circle' ? 0.5 : 0.75 ;
			},
			
			eAngle(){
				return this.mode == 'circle' ? 2.5 : 0.25 ;
			},
			
			basic(){
				return (this.mode == 'circle' ? 2 : 1.5)/100 ;
			},
			
			_percentText(){
				return parseInt(this.curPercent);
			}
		},
		
		watch:{
			percent(n,o){
				clearTimeout(this.timer);
				if (this.mode != 'line') {
					this._startDraw( this.old , n );
				}else{
					this.changedPercent = Number(n) - Number(o) ;
					this._lineComplete();
				}
			}
		},
		
		mounted() {
			if (this.mode != 'line') {
				if (!this._lazyLoad) {
					console.log(",,,,,");
					uni.$b.select("#progressBar",this).then(res=>{
						this.width = res.width ;
						this._drawProgressbg();
						this._drawCircle(0 , this._percent);
					});
				}
			}else{
				this.changedPercent = this._percent ;
				this._lineComplete();
			}
		},
		
		methods: {
			
			_lineComplete(){
				this.$nextTick(()=>{
					this.timer = setTimeout(e => {
						this.$emit("complete" , this._percent );
					} , this._duration ) ;
				});
			},
			
			_getBgImg(){
				let gc = this.gradualColor ;
				if (this.type == 'gradual') {
					return `linear-gradient(to right,${gc},${this.activeColor})` ;
				}
				if ( this.type == 'stripe') {
					let t = "transparent" ;
					return `linear-gradient(45deg, ${gc} 25%, ${t} 25%, ${t} 50%, ${gc} 50%, ${gc} 75%, ${t} 75%, ${t})` ;
				}
			},
			
			_drawProgressbg() {
				let ctx = uni.createCanvasContext( this.canvasId + 'bg', this);
				ctx.setLineWidth(this.lineWidth); // 设置圆环的宽度
				ctx.setStrokeStyle(this.backgroundColor); // 设置圆环的颜色
				ctx.setLineCap('round'); // 设置圆环端点的形状
				ctx.beginPath(); //开始一个新的路径
				let centerX = this.width/2 ;
				let r = this.width/2 - this._margin ;
				ctx.arc( centerX, centerX, r , this.sAngle * Math.PI, this.eAngle * Math.PI );
				ctx.stroke(); //对当前路径进行描边
				ctx.draw();
			},
			
			_drawCircle( start , end ) {
				//取消动画
				if (!this._animation) {
					start = end ;
				}
				
				//记录当前动画的绘制位置
				this.old = start ;
				
				if ( this.ctx == null ) {
					this.ctx = uni.createCanvasContext( this.canvasId , this);
				}else{
					this.ctx.clearRect(0,0,this.width,this.width);
				}
				
				let gradient = this.ctx.createLinearGradient( this._margin , this.width - this._margin  ,   this.width - this._margin , this._margin );
				gradient.addColorStop(0 , this.type == 'gradual' ? this.gradualColor : this.activeColor );
				gradient.addColorStop(1 , this.activeColor);
				this.ctx.setLineWidth(this.lineWidth);
				this.ctx.setStrokeStyle(gradient);
				this.ctx.setLineCap('round');
				this.ctx.beginPath();
				
				let step = this.basic * start + this.sAngle ;
				let centerX = this.width/2 ;
				let r = this.width/2 - this._margin ;
				
				this.ctx.arc(centerX, centerX, r , this.sAngle * Math.PI, step * Math.PI );
				this.ctx.stroke();
				this.ctx.draw();
				
				//已到达终点
				if (start == end) {
					this.curPercent = start ;
					this.$emit("complete" , start );
					return ;
				}
				
				let increase = end - start ;
				if (increase < -1) {
					increase = -1 ;
				}else if (increase > 1) {
					increase = 1 ;
				}
				
				//逐步绘制
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					start += increase ;
					this.curPercent = start ;
					this._drawCircle(start , end);
				} , this.duration) ;
			},
			
			$onObserve(){
				uni.$b.select("#progressBar",this).then(res=>{
					this.width = res.width ;
					this._createObserver("#progressBar");
					this._drawProgressbg();
				});
			},
			
			$onLazyLoad(){
				this._startDraw(0 , this._percent);
			},
			
			_startDraw(start , end){
				if (this.width > 0 ) {
					this._drawCircle(start , end);
					return ;
				}
				uni.$b.select("#progressBar",this).then(res=>{
					this.width = res.width ;
					if (this.width == 0) {
						return ;
					}
					this._drawCircle(start , end);
				});
			}
			
			
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes movingBg {
		from {
			background-position: 0 0;
		}
	
		to {
			background-position: 40px 0;
		}
	}
	
	.b-movingBg {
		background-size: 40px 40px;
		animation: movingBg 0.6s linear infinite;
	}
	
	.b-bar{
		width: 0%;
	}
</style>
