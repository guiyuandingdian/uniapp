<template>
	<view class="b-banner" v-if="(listData.length > 0 || !inited) && hasAuth">
	
		<!-- 大图模式 -->
		<block v-if="type == 'big'">

			<view id="observer" class="square" :style="{'padding-top' : _height }">

				<swiper class="swiper item h100p" 
					:circular="ts.circular" 
					:indicator-dots="false" 
					:autoplay="_autoplay"
					:interval="interval" 
					:duration="duration"
					:current="curIndex"
					@change="_onChange">

					<swiper-item @tap="_onTap(item,index)" class="father" v-for="( item , index) in listData" :key="index">
						
						<b-image :src="item.src" :mode="imgMode" :lazy-load="false" class="block" :height="_height" width="100%"></b-image>

						<view class="abs wrapper-bottom z4 pd pb30 bottom op9" v-if="item.title || item.remark">
							<view class="white fz20">{{item.title}}</view>
							<view class="white op9">{{item.remark}}</view>
						</view>

					</swiper-item>

				</swiper>

				<view v-if="ts.indicatorDots" class="flex b abs bottom">
					<view class="flex ct w100p" :style="{'margin-bottom' : indicatorDotsBottom + 'px'}">
						<view class="h5 whiteBg mlr3 transition" :class="index== curIndex ? 'w15 rds13' : 'rds w5 op7'" v-for="( item , index) in listData"
						 :key="index"></view>
					</view>
				</view>

			</view>

		</block>


		<!-- 小图模式 -->
		<block v-if="type == '2d'">

			<view id="observer" class="square" :style="{'padding-top' : _height }">
				
				<swiper class="swiper item h100p" 
					@change="_onChange" 
					:previous-margin="_margin" 
					:next-margin="_margin"
					:indicator-dots="false" 
					:autoplay="_autoplay" 
					:interval="interval" 
					:duration="duration" 
					:circular="ts.circular"
					:current="curIndex">

					<swiper-item @tap="_onTap(item,index)" class="block h100p" v-for="( item , index) in listData" :key="index">
						<image :src="item.src" :mode="imgMode" :lazy-load="false" class="block h100p rds8 transition" :style="item.style"></image>
					</swiper-item>

				</swiper>

				<view v-if="ts.indicatorDots" class="flex ct abs bottom" :style="{bottom : indicatorDotsBottom + 'px'}">
					<view class=" h5  whiteBg mlr3 " :class="index== curIndex ? 'w15 rds13' : 'rds w5 op7'" v-for="( item , index) in list"
					 :key="index" style="transition:0.2s;"></view>
				</view>
				
			</view>

		</block>
	</view>
</template>

<script>
	/**
	* @description Banner 轮播图，基于数据驱动的轮播图组件
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/banner
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             load                轮播图列表数据加载完成时触发 | 参数：( res )
	* @event    {Function}             error               请求列表数据失败时触发 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                          loadData()          请求轮播图列表数据，默认使用组件相关属性作为参数，也可直接传入参数。 ( config )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       autoplay            自动播放，默认true。
	* @property {Boolean|String}       circular            循环滚动，默认true。
	* @property {String|Number}        duration            切换动画时长，单位ms，默认300。
	* @property {String|Number|Array}  height              【响应式属性】 轮播图的高度，若为百分比，则表示占宽度的百分比。
	* @property {String}               img-mode            图片裁剪模式，默认aspectFill。
	*    @value                        scaleToFill         不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
	*    @value                        aspectFit           保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
	*    @value                        aspectFill          保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
	*    @value                        widthFix            宽度不变，高度自动变化，保持原图宽高比不变
	*    @value                        heightFix           高度不变，宽度自动变化，保持原图宽高比不变 App 和 H5 平台 HBuilderX 2.9.3+ 支持、微信小程序需要基础库 2.10.3
	*    @value                        top                 不缩放图片，只显示图片的顶部区域
	*    @value                        bottom              不缩放图片，只显示图片的底部区域
	*    @value                        center              不缩放图片，只显示图片的中间区域
	*    @value                        left                不缩放图片，只显示图片的左边区域
	*    @value                        right               不缩放图片，只显示图片的右边区域
	*    @value                        top left            不缩放图片，只显示图片的左上边区域
	*    @value                        top right           不缩放图片，只显示图片的右上边区域
	*    @value                        bottom left         不缩放图片，只显示图片的左下边区域
	*    @value                        bottom right        不缩放图片，只显示图片的右下边区域
	* @property {Boolean|String}       indicator-dots      显示指示器，默认true。
	* @property {String|Number|Array}  indicator-dots-bottom 【响应式属性】 指示器距离底部的距离，默认10。
	* @property {String|Number}        interval            停留时间，单位ms，默认3000。
	* @property {Array}                list                轮播图数据列表，mode为local时传入有效。若mode为remote时，服务端返回的数据列表的结构应与list一致。
	* @property {String|Number|Array}  margin              【响应式属性】 前后边距，可以用露出前一项、后一项的一小部分，默认30。
	* @property {String}               mode                轮播图列表数据加载模式，默认remote。
	*    @value                        local               从list属性传入的本地数据加载列表数据
	*    @value                        remote              从url接口地址远程请求列表数据
	* @property {String|Number}        scale               【响应式属性】 前一项缩小倍数，默认0.9，type为2d时有效，可配合marigin属性一起调整效果。
	* @property {String}               type                类型，默认2d。
	*    @value                        2d                  2D效果
	*    @value                        big                 大图
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                        uniCloud            云开发接口
	*    @value                        http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {String}               auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}       call-on-created     组件创建时自动请求数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求数据。
	* @property {Boolean|String}       check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不显示组件，有权限则通过url远程请求数据。若设置为false，则不进行权限校验，可请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	* @property {Boolean|String}       handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	* @property {Object}               loading             请求接口时加载状态的配置项
	* @property {String}               method              请求方法，api-type为http时有效，默认get。
	*    @value                        post                POST请求
	*    @value                        get                 GET请求
	* @property {Boolean|String}       page-params         请求数据调用接口时，是否自动携带当前页面的参数，默认false。
	* @property {Object}               params              发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {String}               url                 请求轮播图列表数据的接口地址，允许携带参数，设置mode属性为remote时有效。
	* @property {Boolean|String}       usable              发送远程请求接口是否可用，传入url属性后有效，默认true。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 键名类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。
	* @property {String}               open-type-key       列表数据中链接打开方式字段的键名，默认openType。
	* @property {String}               remark-key          列表数据中副标题字段的键名，默认remark，在配置文件中，通过配置components.remarkKey来修改默认值。
	* @property {String}               src-key             列表数据中图片链接字段的键名，默认src。
	* @property {String}               title-key           列表数据中标题的键名，默认title，在配置文件中，通过配置components.titleKey来修改默认值。
	* @property {String}               url-key             列表数据中跳转链接字段的键名，默认url。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name: "b-banner",
		mixins: [uni.$b._mixins.requestList, uni.$b._mixins.media ],
		props: {
			value: {
				type: [String, Number],
				default: 0
			},
			type: {
				type: String,
				default: "2d"
			},
			circular: {
				type: [Boolean, String],
				default: true
			},
			indicatorDots: {
				type: [Boolean, String],
				default: true
			},
			indicatorDotsBottom: {
				type: [String,Number,Array],
				default: 10
			},
			autoplay: {
				type: [Boolean, String],
				default: true
			},
			interval: {
				type: [String, Number],
				default: 3000
			},
			duration: {
				type: [String, Number],
				default: 300
			},
			height: {
				type: [String, Number, Array],
				default () {
					return 280
				}
			},
			cache: {
				type: [Boolean, String],
				default: true
			},
			srcKey: {
				type: String,
				default:"src"
			},
			urlKey: {
				type: String,
				default:"url"
			},
			openTypeKey: {
				type: String,
				default:"openType"
			},
			imgMode: {
				type: String,
				default: "aspectFill"
			},
			scale:{
				type : [String , Number, Array],
				default : 0.9
			},
			margin:{
				type : [String,Number , Array] ,
				default(){
					return 30 ;
				}
			}
		},
		data() {
			return {
				curIndex: 0 
			}
		},
		computed: {
			
			ts(){
				return uni.$b.getTrues.call(this,"circular","indicatorDots","autoplay") ;
			},
			
			_autoplay(){
				return this.ts.autoplay ;
			},
			
			_height() {
				return this.uv(this.height);
			},
			
			_scale(){
				return Number(this.dv(this.scale)) ;
			},
			
			_margin(){
				return this.pv(this.margin) ;
			},
			
			listData() {
				return this.listSync.map((cur, index) => {
					let item = uni.$b.isObject(cur) ? { ...cur
					} : {
						[this.srcKey]: cur
					};
					return {
						title : item[this.titleKey] ,
						remark : item[this.remarkKey] ,
						src: item[this.srcKey],
						url: item[this.urlKey],
						openType: item[this.openTypeKey] ,
						style : uni.$b.getStyle({
							"transform" : index != this.curIndex ?  `scale(${this._scale})` : ''
						})
					}
				});
			}
		},
		watch: {
			value: {
				handler(v) {
					this.curIndex = Number(v);
				},
				immediate: true
			}
		},

		methods: {
			_onChange(e){
				this.curIndex = e.detail.current ;
				this.$emit("input" , this.curIndex ) ;
				this.$emit("change" , e );
			},
			_onTap: function({
				url,
				src,
				openType
			}, current) {
				this.$emit("click", {
					url,
					src,
					current
				});
				uni.$b.open({
					openType,
					url
				})
			},
			$handleSuccess(res){
				this.curIndex = 0 ;
			}
		}
	}
</script>

<style lang="scss">
	.smallScale {
		transform: scale(0.93);
		transition: 0.2s;
	}
</style>
