<template>
	<view class="b-countdown">
		<view class="flex" :class="alignClass" id="observer">
			<slot v-if="hasSlot" :data="data"></slot>
			<block v-else v-for="( item , index) in listData" :key="index">
				<view :class="timeClass">{{item.time}}</view>
				<view :class="unitClass" v-if="item.unit">{{item.unit}}</view>
			</block>
		</view>
	</view>
</template>

<script>
	import inviewMixins from "../../js_sdk/mixins/base-inview-mixins.js" ;
	/**
	* @description Countdown 倒计时，支持天、小时、分钟、秒、毫秒粒度的倒计时组件，支持计时时间重置，组件所处页面隐藏或组件不在页面可见区域内时自动暂停计时，具有良好性能。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/countdown
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot     {Scoped}               default             默认插槽，可用于覆盖默认的倒计时时间字符串，可使用作用域变量data。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              计时触发 | 参数：( e )
	* @event    {Function}             stop                计时停止时触发 | 参数：( e )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          start()             开始计时 --
	* @method                          stop()              停止计时 --
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               day                 天单位，默认天。
	* @property {String|Number|Date}   deadline            倒计时结束时间，支持时间字符串、时间戳、日期类型。
	* @property {String}               fields              计时粒度，默认hour。
	*    @value                        day                 天
	*    @value                        hour                小时
	*    @value                        minute              分钟
	*    @value                        second              秒
	* @property {String}               hour                小时单位，默认为英文冒号。
	* @property {String}               minute              分钟单位，默认为英文冒号。
	* @property {String}               second              秒单位，默认无。
	* @property {Boolean|String}       show-mills          显示毫秒，默认false。
	* @property {String}               time-class          时间的样式类名
	* @property {String}               unit-class          时间单位的样式类名
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name : "b-countdown" ,
		mixins:[inviewMixins],
		props:{
			deadline : {
				type : [String , Date , Number],
				default : "" ,
				required : true 
			},
			fields : {
				type : String ,
				default : "hour"
			},
			showMills : [String,Boolean] ,
			day : String,
			hour : {
				type : String ,
				default : ":"
			},
			minute : {
				type : String ,
				default : ":"
			},
			second  : {
				type : String ,
				default : ""
			},
			timeClass  : {
				type : String ,
				default : ""
			},
			unitClass  : {
				type : String ,
				default : ""
			},
			alignClass  : {
				type : String ,
				default : "lt"
			}
		},
		data() {
			return {
				mills : 0 ,
				timer : null ,
				data : {} 
			}
		},
		computed:{
			hasSlot(){
				return uni.$b.hasSlots.call(this);
			},
			_deadline(){
				return uni.$b.parseDate(this.deadline , new Date() ).getTime() ;
			},
			_showMills(){
				return uni.$b.isTrue(this.showMills) ;
			},
			timerMills(){
				return this._showMills ? 100 : 1000 ;
			},
			_day(){
				return this.day ? this.day : uni.$b.localeB("time.day") ;
			},
			_second(){
				return this.second ? this.second : ( this._showMills ? "." : "" ) ;
			},
			filedsIndex(){
				return ["second","minute","hour","day"].indexOf(this.fileds) ;
			},
			listData(){
				let fields = ["day","hour","minute","second"] ;
				if (this._showMills) {
					fields.push("mill");
				}
				let curIndex = fields.indexOf(this.fields) ;
				return fields.map( (cur,index) => {
					let unit = this[cur] || this[`_${cur}`] || '' ;
					let time = this.data[`${cur}sStr`] ;
					return {
						filed : cur ,
						show : curIndex <= index && !!time ,
						time ,
						unit 
					}
				}).filter(item=>item.show);
			}
		},
		watch:{
			deadline(){
				this.start();
			}
		},
		methods: {
			$$onInView(){
				this.start() ;
			},
			$$onOutView(){
				this.stop();
			},
			start(){
				this.stop() ;
				this.mills = 0 ;
				this._countDown();
				this.timer = setInterval( this._countDown , this.timerMills );
			},
			stop(){
				if (this.timer) {
					clearInterval(this.timer) ;
					this.timer = null ;
					if (this.data.mix <= 0) {
						this.$emit("stop" , this.data );
					}
				}
			},
			_countDown(){
				let mix = this._deadline - Date.now() ;
				if (mix <= 0 ) {
					this.data = this._setStrData({ days : 0 , hours : 0 , minutes : 0 , seconds : 0 , mix : 0 });
					this.stop() ;
					return ;
				}
				let days = Math.floor( mix / (24 * 60 * 60 * 1000) ) ;
				let hours = Math.floor( mix / ( 60 * 60 * 1000) - days * 24 ) ;
				let minutes = Math.floor( mix / ( 60 * 1000 ) - days * 24 * 60 - hours * 60 ) ;
				let seconds = Math.floor( mix / 1000 - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60  ) ;
				this.data = this._getTimeData({ days , hours , minutes , seconds , mix }) ;
				this.$emit("change" , this.data );
			},
			
			_getTimeData({ days , hours , minutes , seconds , mix }){
				let data = {} ;
				if (this.fields == 'second') {
					seconds = Math.floor(mix/1000) ;
					return this._setMillsData({ seconds }) ;
				}
				if (this.fields == 'minute') {
					minutes = minutes + hours * 60 + days * 24 * 60 ;
					return this._setMillsData({ seconds , minutes }) ;
				}
				if (this.fields == 'hour') {
					hours = hours + days * 24 ;
					return this._setMillsData({ seconds , minutes , hours }) ;
				}
				return this._setMillsData({ days , hours , minutes , seconds }) ;
			},
			
			_setMillsData(data){
				if (this._showMills) {
					let mills = this.mills ;
					mills -- ;
					this.mills = mills < 0 ? 9 : mills ;
					data.mills = this.mills ;
				}
				return this._setStrData(data) ;
			},
			
			_setStrData(data){
				for(let key in data){
					data[`${key}Str`] = this._getStr(data[key]) ;
				}
				return data ;
			},
			
			_getStr(num){
				return num > 9 ? num.toString() : `0${num}` ;
			}
		}
	}
</script>
