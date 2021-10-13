<template>
	<view v-if="displaying" @tap="click" class="animate b-animate" :class="myClassName" :style="myStyle">
		<view id="animate" >
			<slot :data="data"></slot>
		</view>
	</view>
</template>

<script>
	/**
	* @description Animate 动画，为元素定义入场、出场动画，内置多种常用动画，同时也支持自定义动画噢~
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/animate
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @slot                         default                默认插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @event    {Function}          beforeShow             入场动画执行之前触发 | 参数：( isShow )
	* @event    {Function}          beforeHide             出场动画执行之前触发 | 参数：( isShow )
	* @event    {Function}          change                 入场或出场动画执行完毕触发 | 参数：( isShow )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @method                       show()                 执行入场动画，可接收两个参数，第一个是回调函数，第二个是供默认插槽使用的私域变量，二者可以都传入，也可以只传入一个，也可以都不传入。 ( callback , data )
	* @method                       hide()                 执行出场动画 ( callback )
	* @method                       toggle()               已入场时执行出场动画，已出场时执行入场动画。 ( callback , data )
	* @method                       queryRect()            隐藏状态时，查询元素的布局信息。 ( callback )
	* 
	* @property {Number}            count                  动画执行次数，默认1次，-1表示无限循环执行。
	* @property {Number}            delay                  动画执行延迟时间，单位ms，默认0。
	* @property {Boolean|String}    destory-on-hide        执行出场动画隐藏后销毁，下次进场显示重新渲染，默认true。
	* @property {Number}            duration               动画持续时间，单位ms，默认200。
	* @property {String}            in-class               入场动画动画类名，默认fadeIn，支持内置动画类名与自定义动画类名。
	*    @value                     fadeIn                 淡入
	*    @value                     fadeInDown             从上往下淡入
	*    @value                     fadeInDownSm           小幅度从上往下淡入
	*    @value                     fadeInDownLg           大幅度从上往下淡入
	*    @value                     fadeInLeft             从左侧淡入
	*    @value                     fadeInLeftSm           小幅度从左侧淡入
	*    @value                     fadeInLeftLg           大幅度从左侧淡入
	*    @value                     fadeInRight            从右侧淡入
	*    @value                     fadeInRightSm          小幅度从右侧淡入
	*    @value                     fadeInRightLg          大幅度从右侧淡入
	*    @value                     fadeInUp               从下往上淡入
	*    @value                     fadeInUpSm             小幅度从下往上淡入
	*    @value                     fadeInUpLg             大幅度从下往上淡入
	*    @value                     zoomInSm               缩小后淡入
	*    @value                     zoomIn                 变大后淡入
	*    @value                     slideDown              下拉展开
	*    @value                     circle                 旋转
	* @property {Boolean|String}    is-show                是否展示，默认true，展示时将激活入场动画。
	* @property {String}            out-class              出场动画动画类名，默认fadeOut，支持内置动画类名与自定义动画类名。
	*    @value                     fadeOut                淡出
	*    @value                     fadeOutDown            向下淡出
	*    @value                     fadeOutDownSm          小幅度向下淡出
	*    @value                     fadeOutDownLg          大幅度向下淡出
	*    @value                     fadeOutLeft            向左淡出
	*    @value                     fadeOutLeftSm          小幅度向左淡出
	*    @value                     fadeOutLeftLg          大幅度向左淡出
	*    @value                     fadeOutRight           向右淡出
	*    @value                     fadeOutRightSm         小幅度向右淡出
	*    @value                     fadeOutRightLg         大幅度向右淡出
	*    @value                     fadeOutUp              向上淡出
	*    @value                     fadeOutUpSm            小幅度向上淡出
	*    @value                     fadeOutUpLg            大幅度向上淡出
	*    @value                     zoomOutSm              缩小淡出
	*    @value                     zoomOut                变大淡出
	*    @value                     slideUp                上拉收起
	* @property {Boolean|String}    repeat                 当元素初次执行完入场动效后，多次调用show()方法，则会重复执行入场动效。若为false该元素已入场状态下，多次调用show()方法，将不再执行入场动效。
	* @property {Number}            stay-time              入场后停留时间，单位ms，到时间后自动消失，小于等于0时将不会自动退场，默认-1。
	* @property {Boolean|String}    v-model                用于数据双向绑定，控制显示状态。
	* 
	* @property {String}            ref                     获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-animate" ,
		props:{
			value:{
				type : [Boolean,String] ,
				default : true 
			},
			destoryOnHide:{
				type : [Boolean,String] ,
				default : true 
			},
			duration:{
				type : Number ,
				default : 200
			},
			stayTime:{
				type : Number ,
				default : -1
			},
			inClass:{
				type:String ,
				default : "fadeIn"
			},
			outClass:{
				type:String,
				default : "fadeOut"
			},
			count: {
				type: Number ,
				default: 1
			},
			delay : {
				type : Number ,
				default : 0
			},
			repeat:{
				type : [Boolean , String],
				default : false 
			}
		},
		data() {
			return {
				isShowSync : false ,
				recting : false ,
				animateClass : this.inClass ,
				timeout : null ,
				data : {}
			}
		},
		computed:{
			_destory(){
				return uni.$b.isTrue(this.destoryOnHide);
			},
			_repeat(){
				return uni.$b.isTrue(this.repeat) ;
			},
			_duration(){
				return !this.recting ? this.duration : 0 ;
			},
			displaying(){
				let displaying = this.isShowSync || !this._destory || this.recting ;
				return displaying ;
			},
			outTime(){
				let count = this.count < 1 ? 1 : this.count ;
				return this._duration * count + this.delay ;
			},
			myStyle(){
				let count = this.count < 1 ? 'infinite' : this.count  ;
				return uni.$b.getStyle({
					"animation-duration" : `${this._duration}ms` ,
					"animation-delay" : `${this.delay}ms` ,
					"animation-iteration-count" : count 
				});
			},
			myClassName(){
				if (this.recting) {
					return 'hide' ;
				}
				return this.isShowSync ? this.animateClass : 'none' ;
			}
		},
		watch:{
			value(isShow){
				isShow = uni.$b.isTrue(isShow);
				//若值相等，则为内部更改model的场景
				if (this.isShowSync === isShow) {
					return ;
				}
				if (isShow) {
					this.show();
				}else{
					this.hide();
				}
			}
		},
		created() {
			if (uni.$b.isTrue(this.value)) {
				this.show();
			}
		},
		methods: {
			
			click(e){
				this.$emit("click" , e) ;
			},
			
			toggle( callBack , data ){
				if (this.status == 'hiding') {
					return this.show(callBack , data) ;
				}
				if (this.status == 'showing') {
					return this.hide(callBack) ;
				}
				return this.isShowSync ? this.hide(callBack ) : this.show(callBack , data );
			},
			
			show( callBack , data ){
				clearTimeout(this.timeout);
				this.status = "showing" ;
				
				//允许只定义一个参数
				if (uni.$b.isObject(data)) {
					this.data = data ;
				}else if (uni.$b.isObject(callBack)) {
					this.data = callBack ;
				}
				
				this.$emit("beforeShow" , true );
				this.isShowSync = true ;
				this.animateClass = this.inClass ;
				this.timeout = setTimeout(()=>{
					
					uni.$b.isFn(callBack) && callBack(this.isShowSync);
					uni.$b.isFn(data) && data(this.isShowSync);
					
					this.$emit("change", this.isShowSync);
					this.$emit("input", this.isShowSync);
					this.timeout = null ;
					if (this._repeat) {
						this.animateClass = '' ;
					}
					this._stayToHide();
					this.status = "" ;
					
					
					// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ || MP-BAIDU
					//全局通知：通知b-row组件重新获取宽度数据
					this.$nextTick(function(){
						uni.$emit("baseOnAnimateShow");
					});
					// #endif
					
					
				}, this.outTime );
				return this.timeout ;
			},
			
			hide(callBack){
				if (this.count < 1) {
					return ;
				}
				
				clearTimeout(this.timeout);
				this.status = "hiding" ;
				this.$emit("beforeHide", false );
				
				this.animateClass = this.outClass ;
				this.timeout = setTimeout(()=>{
					
					
					//销毁组件时也重置私域变量
					if (this._destory) {
						this.data = {} ;
					}
					this.isShowSync = false ;
					uni.$b.isFn(callBack) && callBack(this.isShowSync);
					this.timeout = null ;
					this.status = "" ;
					
					this.$emit("input", this.isShowSync);
					this.$emit("change", this.isShowSync);
					
				}, this.outTime );
				
				return this.timeout ;
			},
			
			_stayToHide(){
				if (this.stayTime <= 0) {
					return ;
				}
				this.timeout = setTimeout(()=>{
					this.hide();
				} , this.stayTime );
			},
			
			startQuery(){
				//显示测量状态
				this.recting = true ;
			},
			
			stopQuery(){
				this.recting = false ;
			},
			
			queryRect(callBack){
				this.startQuery() ;
				return new Promise(r=>{
					uni.$b.select("#animate",this).then(rect=>{
						this.stopQuery();
						uni.$b.isFn(callBack) && callBack(rect) ;
						r(rect);
					});
				});
			}
		}
	}
</script>