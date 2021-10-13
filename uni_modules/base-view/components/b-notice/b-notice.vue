<template>
	<view class="b-notice father" v-if="hasAuth || listData.length > 0" :style="boxStyle">
		
		<!-- 背景图 -->
		<view v-if="_showBg" class="abs op1" :style="{'background-color' : color }"></view>
		
		
		<view class="flex father z1" id="observer">
			
			<!-- 左侧图标 -->
			<slot v-if="hasSlot"></slot>
			<view v-else-if="noticeIcon" @tap="$emit('tapLeft')" :class="noticeIcon" class="plr7"></view>
			
			
			<!-- 循环滚动 -->
			<view v-if="_circular" class="h30 cover flex hidden">
				<view class="circular noBreak" :class="{'pause' : !isInView}" :style="circularStyle">
					<text @tap="_open(index , item)" :class="{'ml30' : index > 0}" v-for="( item , index) in listData" :key="index">{{item.title}}</text>
				</view>
			</view>
			
			
			<!-- 轮播滚动 -->
			<swiper v-else
				class="cover h30"
				:indicator-dots="false" 
				:autoplay="isInView" 
				:interval="_interval" 
				:duration="_duration" 
				:vertical="_vertical" 
				:circular="true"
				@change="$emit('change', $event )">
				
				<swiper-item class="flex" @tap="_open(index , item)" v-for="( item , index) in listData" :key="index">
					<view class="clip">
						{{item.title}}
					</view>
				</swiper-item>
				
			</swiper>
			
			
			<!-- 右侧箭头 -->
			<slot v-if="hasArrowSlot"></slot>
			<view v-else-if="arrowIcon" @tap="$emit('tapRight')" class="fz12 plr7">
				<view :class="arrowIcon"></view>
			</view>
			
		</view>
	</view>
</template>

<script>
	/**
	* @description Notice 公告，轮播公告，支持横向轮播、纵向轮播、连续滚动轮播三种轮播方式，可自定义左右两侧公告图标；支持自动加载远程公告数据，并对数据进行本地缓存，退出应用前多次进入公告页面不再向服务端请求公告数据；当所在页面隐藏、组件划出页面可见区域时自动暂停动画，具有良好性能。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/notice
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽，用于覆盖左侧公告图标。
	* @slot                            arrow               右侧箭头插槽，用于覆盖右侧箭头。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             load                列表数据加载完成时触发 | 参数：( res )
	* @event    {Function}             loading             开始请求服务端数据时触发 | 参数：--
	* @event    {Function}             error               请求服务端数据失败时触发 | 参数：( err )
	* @event    {Function}             onTap               点击公告时触发 | 参数：( e )
	* @event    {Function}             change              circular为false，切换公告时触发。 | 参数：( e )
	* @event    {Function}             tapLeft             点击左侧图标时触发 | 参数：--
	* @event    {Function}             tapRight            点击右侧图标时触发 | 参数：--
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               arrow-icon          右侧箭头图标类名，默认bIcon-arrowRight，可同时传入定义图标样式的类名，如：“bIcon-arrowRight fz15 grey”，设置为空则不显示图标。
	* @property {Boolean|String}       circular            衔接滚动，默认true。
	* @property {String}               color               背景与文字颜色，默认为#f69c00（黄色）。
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
	* @property {Number}               duration            circular为false时表示公告切换动画时间，单位ms，默认300。若circular为true时表示滚动速度：px/秒。
	* @property {String|Number}        interval            停留时间，单位ms，默认3000，circle为false时有效。
	* @property {Array}                list                公告数据列表，mode为local时传入有效。若mode为remote时，服务端返回的数据列表的结构应与list一致。
	* @property {String}               mode                列表数据加载模式，默认remote，从远程加载数据，需要配置url作为数据请求接口地址。
	*    @value                        local               从list属性传入的本地数据加载列表数据
	*    @value                        remote              从url接口地址远程请求列表数据
	* @property {String}               notice-icon         公告图标类名，默认bIcon-noticeFill，可同时传入设置图标样式的类名，如："bIcon-noticeFill fz15 green"，设置为空则不显示图标。
	* @property {Boolean|String}       show-background     显示背景色，默认true。
	* @property {Boolean|String}       vertical            竖向滚动，circular为false时有效，默认true。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}       cache               启用客户端本地缓存，默认true。
	* @property {Boolean|String}       call-on-created     创建时自动请求列表数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求列表数据。
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示组件，有权限则通过url远程请求数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	* @property {Boolean|String}       handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	* @property {Object}               header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {String}               method              请求方法，api-type为http时有效，默认get。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Boolean|String}       page-params         请求数据调用接口时，是否自动携带当前页面的参数，默认false。
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {String}               url                 请求列表数据时的接口地址，允许携带参数，设置mode属性为remote时有效。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 键名类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名，无键名时可设置为空。
	* @property {String}               open-type-key       列表数据中链接打开方式字段的键名，默认openType。
	* @property {String}               title-key           列表数据中公告标题的键名，默认title，在配置文件中，通过配置components.titleKey来修改默认值。
	* @property {String}               url-key             数据列表中表示跳转链接字段的键名，默认url。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-notice",
		mixins:[uni.$b._mixins.requestList , uni.$b._mixins.inview ],
		props:{
			color : {
				type : String ,
				default : "#f69c00"
			},
			showBackground:{
				type : [String , Boolean] ,
				default : true 
			},
			vertical : {
				type : [String , Boolean] ,
				default : true 
			},
			circular : {
				type : [String , Boolean] ,
				default : true 
			},
			urlKey:{
				type : String ,
				default : "url"
			},
			openTypeKey:{
				type : String ,
				default : "openType"
			},
			interval : {
				type : [String , Number] ,
				default : 3000
			},
			duration : {
				type : [String , Number] ,
				default : 80
			},
			noticeIcon:{
				type : String ,
				default : "bIcon-noticeFill"
			},
			arrowIcon:{
				type : String ,
				default : "bIcon-arrowRight"
			},
			cache: {
				type: [String, Boolean],
				default: true
			},
			detailUrl : String ,
			idKey:{
				type : String ,
				default(){
					return uni.$b.getValue("response.idKey")
				}
			},
			openType : String 
		},
		data(){
			return {
				textRect : { width : 0 }
			}
		},
		computed:{
			hasSlot(){
				return uni.$b.hasSlots.call(this) ; 
			},
			hasArrowSlot(){
				return uni.$b.hasSlots.call(this,"arrow") ; 
			},
			_circular(){
				return uni.$b.isTrue(this.circular) ;
			},
			_showBg(){
				return uni.$b.isTrue(this.showBackground) ;
			},
			_interval(){
				return Number(this.interval) ;
			},
			_duration(){
				let duration = Number(this.duration) ;
				if (!this._circular || this.textRect.width == 0) {
					return duration ;
				}
				return this.textRect.width / duration ;
			},
			circularStyle(){
				return uni.$b.getStyle({
					'animation-duration' : `${this._duration}s` ,
				});
			},
			_vertical(){
				return uni.$b.isTrue(this.vertical) ;
			},
			boxStyle(){
				return uni.$b.getStyle({
					'color' : this.color 
				})
			},
			listData(){
				return this.listSync.map(item=>{
					item = uni.$b.isObject(item) ? {...item} : { [this.titleKey] : item } ;
					let url = item[this.urlKey] ;
					if(!url && uni.$b.notNull(this.detailUrl)){
						url = `${this.detailUrl}${item[this.idKey]}` ;
					}
					return {
						url ,
						title : item[this.titleKey] ,
						openType : item[this.openTypeKey] || this.openType
					};
				});
			}
		},
		watch:{
			circular(){
				this._queryRect();
			},
			listSync(){
				this._queryRect();
			}
		},
		mounted() {
			this._queryRect();
		},
		methods: {
			_open(index , item){
				this.$emit("onTap" , { item : this.listSync[index] , index }) ;
				uni.$b.open(item) ;
			},
			async _queryRect(){
				this.textRect = await uni.$b.select(".circular" , this) ;
			}
		}
	}
</script>
<style lang="scss">
	@keyframes circular {
	  from {
	    transform: translate3d(0, 0, 0);
	  }
	  to {
	    transform: translate3d(-100%, 0, 0);
	  }
	}
	.circular{
		padding-left: 100%;
		animation: circular infinite linear both;
		&.pause{
			animation-play-state:paused;
		}
	}
</style>