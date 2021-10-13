<template>
	<view class="b-tab" :style="tabStyle" :class="_tabBoxClass" v-if="isShow">
		
		<view class="father hidden" id="tab" :style="boxStyle">

			<!-- 用于尺寸测量的虚拟元素-->
			<scroll-view 
				id="computeView"
				style="z-index: -1;"
				class="abs top pointer op0"
				:class="scrollX?'noBreak':'break'"
				:style="computeStyle"
				:scroll-y="false" 
				:scroll-x="false">


				<!-- computeItem此处用于计算节点信息 -->
				<view class="computeItem _tabItem" 
					:class="[ scrollY ? 'block' : 'inline' , item.class ]" 
					:style="item.style" 
					v-for="( item , index) in listData" :key="index">
					
					<view class="father inline">
						<block v-if="slots.option">
							<slot name="option" :title="item.title" :value="item.value" :data="item" :choosed="item.choosed" :disabled="item.disabled"></slot>
						</block>
						<block v-else>
							<text class="mr5" :class="item.icon" v-if="item.icon"></text>
							<text class="noTransition">{{item.title}}</text>
						</block>
					</view>
					
				</view>
				
			</scroll-view>
			<!-- 用于尺寸测量的虚拟元素-->
			
			
			
			<!-- 左侧控制阀 -->
			<view v-if="showLeftArrow" @tap="_scrollToX(false)" class="rightShadow abs z4 left whiteBg flex ct bIcon-arrowLeft gray hoverMain fz12"></view>
			
			<!-- 右侧控制阀 -->
			<view v-if="showRightArrow" @tap="_scrollToX(true)" class="leftShadow abs z4 right whiteBg flex ct bIcon-arrowRight gray hoverMain fz12"></view>
			
			<!-- 顶部控制阀 -->
			<view v-if="showTopArrow" @tap="_scrollToY(false)" class="topShadow abs z4 top whiteBg flex ct bIcon-arrowUp gray hoverMain fz12"></view>
			
			<!-- 底部控制阀 -->
			<view v-if="showBottomArrow" @tap="_scrollToY(true)" class="bottomShadow abs z4 bottom whiteBg flex ct bIcon-arrowDown gray hoverMain fz12"></view>
			
			
			<!-- 滚动轨道 -->
			<view class="_track abs z2" :class="_trackClass" :style="_trackStyle"></view>
			
			
			<!-- 父级 -->
			<scroll-view class="father z2"
				:scroll-y="scrollY"
				:scroll-x="scrollX"
				:scroll-left="translateX"
				:scroll-top="translateY"
				:scroll-with-animation="true"
				:style="scrollStyle"
				@scrolltolower="_scrolltolower">
				
				
				<view id="scrollInner" class="father pointer" 
					:class="scrollX?'noBreak':'break'"
					:style="boxStyle">
					
					<!-- 子元素，item -->
					<view class="tab-item _tabItem"
						:class="item.class" 
						:style="item.style" 
						@tap.stop="select(index)" 
						v-for="( item , index) in listData" :key="index">
					
					
						<view class="father inline">
							
							
							<block v-if="slots.option">
								<slot name="option" :title="item.title" :value="item.value" :data="item" :choosed="item.choosed" :disabled="item.disabled"></slot>
							</block>
							<block v-else>
								
								<view :class="{'hover7' : !item.choosed && !item.disabled }">
									
									<!-- 图标 -->
									<text class="mr5" :class="item.icon" v-if="item.icon"></text>
									
									<!-- 文字 -->
									<text class="noTransition">{{item.title}}</text>
									
								</view>
								
								
								<!-- 数字角标 -->
								<view class="_badge badge abs z4 top rds flex ct fz12 right" v-if="item.count > 0">
									
									{{item.count}}
									
								</view>
								
							</block>
							
						</view>
					</view>
					
					
					<!-- 底部滚动块 -->
					<view class="_slideBlock abs z3 rds20"
						v-if="ts.showBar"
						:class="_barClass"
						:style="_barStyle"></view>
					
					
				</view>
				
				
			</scroll-view>
			
		</view>
	</view>
</template>

<script>
	import media from "../../js_sdk/mixins/base-media-mixins.js" ;
	import requestList from "../../js_sdk/mixins/base-request-list-mixins.js" ;
	/**
	* @description Tab 标签页，这是一个响应式的标签页，在各种设备上具有良好的适配性，并提供了一些响应式属性来自由配置在不同设备上的展现形式。通过简单的配置可以实现标签页与页面元素双向联动的效果；当你不确定标签数量时，它可以通过计算，确定适合平均分布布局时，展现为平均分布布局；它支持使用本地数据，也可以通过配置一个接口地址，来加载远程数据；在权限控制方面，它允许你将个别的标签只展示给拥有某项权限的用户。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/tab
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                  change              当标签切换时触发 | 参数：( event )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                               refreshAll()        刷新标签页，重新计算标签页的各项数据。 --
	* @method                               select()            选中标签项，通常用于初始化标签默认选中项。 ( index )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}            disabled            禁用
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String}            index-value         当前选中的标签值是否为数组下标，否则为选项数据中的value字段值，默认false。
	*    @value                             true                
	*    @value                             false               
	* @property {Array}                     list                标签数据列表，mode为local时传入有效。若mode为remote时，服务端返回的数据列表的结构应与list一致。
	* @property {String|Number}             min                 最少标签数量，少于该数量时不显示b-tab组件，默认最少2个时展示。
	*    @value                             2                   小于2个标签时隐藏
	*    @value                             1                   小于1个标签时隐藏
	*    @value                             0                   不限制标签数量，均显示
	* @property {String}                    mode                列表数据加载模式，默认local，从list属性加载数据；若为remote，需要配置url作为数据请求接口地址。
	*    @value                             local               从list属性传入的本地数据加载列表数据
	*    @value                             remote              从url接口地址远程请求列表数据
	* @property {Boolean|String|Array}      show-arrow          【响应式属性】 当标签数量较多发生滚动时，是否显示左右、上下切换滚动的箭头按钮，默认值为[0,0,0,1]。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String}            show-bar            是否展示滑动条，默认true。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String}            show-track          显示滚动轨道，默认true。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String|Number}     v-model             双向绑定tab的值，与value属性二选一选择使用。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String|Number}     value               选中的标签的value，注意与value-type属性搭配使用。也可使用v-model替代，进行数据双向绑定。
	*    @value                             true                
	*    @value                             false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                    api-type            API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                             uniCloud            云开发接口
	*    @value                             http                常规服务端接口，如java、php、python等语言做服务端接口
	* @property {String}                    auth-url            权限验证url，auth-url如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}            cache               发送远程请求时进行本地缓存，默认false。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String}            call-on-created     若设置mode为remote，标签创建时自动请求列表数据，可以使用page-params参数来让它自动携带当前页面参数，也可以在onLoad中为params参数赋值，携带你自定义的参数，默认true。为false时，你可以在需要的时候手动调用内置的loadData()方法请求标签列表数据。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String}            check-auth          是否开启权限校验，设置为true时，将进行权限校验，无权限则不请求接口，有权限则通过url远程请求tab数据。若设置为false，则不进行权限校验，直接请求接口数据。默认false，可通过修改配置文件配置checkAuth来修改默认值。
	*    @value                             true                
	*    @value                             false               
	* @property {Boolean|String}            handled             执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                             true                
	*    @value                             false               
	* @property {Object}                    header              设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {Object}                    loading             请求接口时加载状态的配置项
	* @property {String}                    method              请求方法，api-type为http时有效，默认get。
	*    @value                             post                POST请求
	*    @value                             get                 GET请求
	* @property {Boolean|String}            page-params         发送远程请求时，是否自动携带当前页面的参数，默认false。
	*    @value                             true                
	*    @value                             false               
	* @property {Object}                    params              发送远程请求时携带的参数，参数也可以自行追加到url属性中。
	* @property {String}                    url                 远程接口地址，用于请求标签列表数据，mode为remote时有效，接口返回数据结构参见list属性说明。开启权限验证后，若auth-url为空，则使用url进行权限验证。
	* @property {Boolean|String}            usable              发送远程请求接口是否可用，传入url属性后有效，默认true。
	*    @value                             true                
	*    @value                             false               
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Array}              active-class        【响应式属性】 选中标签页样式类名，可通过配置文件配置components.tab.activeClass来修改默认值。
	* @property {String}                    active-color        选中颜色，默认为主题色，可通过修改配置文件配置components.mainColor来修改默认值。
	*    @value                             #e1251b             红色
	*    @value                             #e1251b             黄色
	*    @value                             #07c160             绿色
	*    @value                             #F74F0E             橘色
	*    @value                             #0081ff             蓝色
	*    @value                             #8B4512             棕色
	*    @value                             #6739b6             紫色
	*    @value                             #82939c             玄灰
	*    @value                             #777                灰色
	* @property {String|Array}              bar-class           【响应式属性】 滑动块样式类名
	* @property {String|Number|Array}       bar-height          【响应式属性】 滑动块高度，纵向tab设置为auto时，为当前选中tab元素的高度。
	* @property {String|Number|Array}       bar-width           【响应式属性】 滑动块的宽度，横向tab中设置为auto，则为当前选中的tab元素的宽度。
	* @property {String}                    color               未选中标签的文字颜色
	* @property {String|Number|Array}       height              【响应式属性】 高度，纵向标签通常需要设置该属性值。更多情况下，推荐使用max-height来控制最大高度，实际高度根据标签数量的多少自适应。
	* @property {String|Array}              justify             【响应式属性】 标签的分布排列方式，默认start。
	*    @value                             start               宽度根据标签内容自适应，从左侧向右、顶部向下依次排开。
	*    @value                             average             根据父级容器的宽度平均分布
	*    @value                             auto                父级容器内可以平均分布时为average，否则为start。
	* @property {String|Number|Array}       max-height          【响应式属性】 最大高度，纵向的tab常用属性。
	* @property {String|Array}              placement           【响应式属性】 标签页相对文档的位置，默认top。
	*    @value                             top                 文档顶部位置，横向标签页
	*    @value                             left                文档左侧位置，纵向标签页
	*    @value                             right               文档右侧位置，纵向标签页
	* @property {String|Number|Array}       plr                 【响应式属性】 左右内边距，默认15px。
	* @property {String|Number|Array}       ptb                 【响应式属性】 上下内边距，横向tab默认12px，纵向tab默认7px。
	* @property {String|Array}              tab-class           【响应式属性】 标签样式类名，可通过配置文件配置components.tab.tabClass来修改默认值。
	* @property {String|Number|Array}       width               【响应式属性】 标签容器的宽度，纵向标签通常需要设置该属性值。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 键名类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                    count-key           列表数据中表示数量字段的键名，默认count。
	* @property {String}                    disabled-key        列表数据中字段禁用状态的键名，默认disabled，在配置文件中，通过配置components.disabledKey来修改默认值。
	* @property {String}                    icon-key            列表数据中表示图标类名的字段的键名，默认icon。
	* @property {String}                    list-key            从服务端响应结果中取列表数据的键名，支持深层键名，默认list，可在配置文件中，通过listKey来配置默认键名。
	* @property {String}                    title-key           列表数据中标签标题的键名，默认title，在配置文件中，通过配置components.titleKey来修改默认值。
	* @property {String}                    value-key           列表数据中选中标签值字段的键名，默认value，在配置文件中，通过配置components.valueKey来修改默认值。
	* 
	* @property {String}                    ref                  获取组件对象，通常用于调用组件内置方法。
	* @property {String}                    v-slot:default       默认插槽作用域变量
	*/
	export default {
		name : 'b-tab' ,
		mixins:[ media , requestList ] ,
		props:{
			mode:{
				type : String ,
				default : "local"
			},
			value : [String , Number , Boolean],
			color : {
				type : String ,
				default : '#000'
			},
			activeColor:{
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor");
				}
			},
			showTrack:{
				type : [Boolean,String,Array,Number] ,
				default(){
					return true ;
				}
			},
			iconKey :{
				type : String ,
				default : "icon"
			},
			countKey :{ //数量
				type : String ,
				default : "count"
			},
			justify:{
				type : [String,Array] , 
				default(){
					return "start" ;
				}
			},
			plr:{
				type : [String,Number,Array] ,
				default(){
					return 15 ;
				}
			},
			align: [String , Array],
			ptb: [String,Number,Array],
			width:[String,Number,Array],
			height:[String,Number,Array],
			maxHeight:[String,Number,Array],
			barWidth : [Number,String,Array] ,
			barHeight : [String,Number,Array] ,
			showBar : {
				type : [String,Boolean] ,
				default : true 
			} ,
			indexValue : {
				type : [String,Boolean] ,
				default(){
					return uni.$b.getValue("components.tab.indexValue")
				}
			},
			tabClass : {
				type : [String,Array] ,
				default(){
					return uni.$b.getValue("components.tab.tabClass") 
				}
			} ,
			activeClass: {
				type : [String,Array] ,
				default(){
					return uni.$b.getValue("components.tab.activeClass") ;
				}
			},
			barClass: {
				type : [String,Array] ,
				default(){
					return uni.$b.getValue("components.tab.barClass") 
				}
			},
			placement:{
				type : [String , Array] ,
				default(){
					return 'top' ;
				}
			},
			disabled : [String,Boolean] ,
			showArrow : {
				type : [String,Boolean,Array],
				default(){
					return [0,0,0,1];
				}
			},
			min:{
				type :[String,Number],
				default : 2
			},
			duration:{
				type : [String , Number] ,
				default : 600 
			}
		},
		
		data(e){
			return {
				isComputed : false ,
				maxScroll : null ,
				valueSync : 0 ,
				childRects : [] , //子元素的节点信息
				canAverage : false , //子元素是否可以平分
				tabRect : {} ,
				scrolling : false , //页面是否内部滚动
				translateX : 0 , //x轴偏移量
				translateY : 0 
			} ;
		},
		
		computed:{
			slots(){
				return uni.$b.getSlots.call( this , "option") ;
			},
			ts(){
				return uni.$b.getTrues.call(this , "showTrack" , "showBar" , "showArrow" , "disabled") ;
			},
			
			dvs(){
				return this.getDvs("placement","activeClass","tabClass","barClass","justify","align");
			},
			
			uvs(){
				return this.getUvs("plr","ptb","width","height");
			},
			
			_tabBoxClass(){
				return `placement_${this.dvs.placement}`;
			},
			
			_align(){
				let align = this.dvs.align ;
				if (uni.$b.notNull(align)) {
					return align ;
				}
				if (this.scrollX) {
					return this._justify == 'average' ? 'center' : 'left' ;
				}
				return this.dvs.placement == 'left' ? 'right' : 'left' ;
			},
			
			_justify(){
				if ( this.dvs.justify != 'auto') {
					return this.dvs.justify ;
				}
				return this.canAverage ? 'average' : 'start' ;
			},
			
			_ptb(){
				let defaultPtb = this.scrollY ? "7px" : "12px" ;
				return this.uvs.ptb || defaultPtb ;
			},
			
			activeRect(){
				return this.childRects.length == 0 ? {} : this.childRects[this.curIndex] || {} ;
			},
			
			/**
			 * @description 获取滚动块的宽度
			 * @return {Number} 以px为单位的数值
			 */
			_barWidth(){
				//当前设备的bar宽度，单位：px、rpx、%、auto等
				if ( this.activeRect.width === undefined ) {
					return 0 ;
				}
				let defaultWidth = this.scrollY ? 1 : 30 ;
				let barWidth = uni.$b.isNull(this.barWidth)  ? defaultWidth : this.uv( this.barWidth ) ; 
				let {width} = this.activeRect ;
				//以px为单位的数值
				let widthValue = uni.$b.parsePx( barWidth , width ) || width ;
				if (this.scrollY || barWidth != 'auto') {
					return widthValue ;
				}
				//自适应宽度 = 当前选中元素宽度 - plr*2
				let plrValue = uni.$b.parsePx( this.uvs.plr , width ) ;
				return widthValue - plrValue * 2 ;
			},
			
			_barHeight(){
				if ( this.activeRect.height === undefined ) {
					return 0 ;
				}
				let defaultHeight = this.scrollY ? 15 : 2 ;
				let barHeight = uni.$b.isNull(this.barHeight) ? defaultHeight : this.uv(this.barHeight) ;
				let {height} = this.activeRect ;
				let heightValue = uni.$b.parsePx( barHeight , height ) || height ;
				if ( this.scrollX || barHeight != 'auto' ) {
					return heightValue ;
				}
				//自适应高度 = 当前选中元素高度 - ptb*2
				let ptbValue = uni.$b.parsePx( this._ptb , height ) ;
				return heightValue - ptbValue * 2 ;
			},
			
			scrollY(){
				return this.dvs.placement == 'left' || this.dvs.placement == 'right' ;
			},
			
			scrollX(){
				return this.dvs.placement == 'top' ;
			},
			
			computeStyle(){
				return uni.$b.getStyle({
					"text-align" : this._align ,
					'height' : this.scrollY ? this.uvs.height : '',
					'max-height' : this.scrollY ? this._maxHeight: '',
					"left" : this.scrollY ? "100%" : '' ,
					"top" : this.scrollX ? "100%" : ''
				});
			},
			
			//当前选中的下标
			curIndex(){
				return this.listData.findIndex(item=>item.choosed) ;
			},
			
			_barClass(){
				return uni.$b.getClassName({
					'bottom left' : this.scrollX ,
					'top right' : this.dvs.placement == 'left' ,
					'top left' : this.dvs.placement == 'right'
				} , this.dvs.barClass );
			},
			
			_barStyle(){
				return uni.$b.getStyle({
					"background-color" : this.activeColor ,
					"height" : `${this._barHeight}px` ,
					"width" : `${this._barWidth}px` ,
					'transform' : this.scrollX ? `translate(${this.barLeft}px , 0 )` : `translate( 0 , ${this.barTop}px )` ,
					'transition' : this.isComputed ? `all ${this.duration}ms` : ''
				});
			},
			
			barLeft(){
				let { width , left } = this.activeRect ;
				return left - this.tabRect.left + width / 2 - this._barWidth / 2 ;
			},
			
			barTop(){
				let { height , top } = this.activeRect ;
				return top - this.tabRect.top + height / 2  - this._barHeight / 2 ;
			},
			
			scrollList(){
				return this.listData.map((cur,index)=>({...cur,_dataIndex:index})).filter(item => !!item.scrollTo);
			},
			
			_trackStyle(){
				let border = this.ts.showTrack ? `1px solid #e0e0e0` : '' ;
				return uni.$b.getStyle({
					'border-bottom' : this.dvs.placement == 'top' ? border : '' ,
					'border-left' : this.dvs.placement == 'right' ? border : '' ,
					'border-right' : this.dvs.placement == 'left' ? border : ''
				});
			},
			
			_trackClass(){
				return uni.$b.getClassName({
					'bottom' : this.dvs.placement == 'top' ,
					'left' : this.dvs.placement == 'right' ,
					'right' : this.dvs.placement == 'left' 
				});
			},
			
			boxStyle(){
				return uni.$b.getStyle({
					"width" : this.uvs.width ||  (this.scrollY ?  `${this.tabRect.width}px` : '') ,
					"height" : this.uvs.height || `${this.tabRect.height}px`
				});
			},
			
			tabStyle(){
				return uni.$b.getStyle({
					"width" : this.uvs.width ,
					"height" : this.uvs.height ,
					"max-height" : this._maxHeight 
				});
			},
			
			scrollStyle(){
				return uni.$b.getStyle({
					"text-align" : this._align ,
					"width": this.scrollY ? `calc( ${this.tabRect.width}px + 50px)` : '' ,
					"height" : this.scrollX ? `calc( ${this.tabRect.height}px + 50px)` : ''
				});
			},
			
			totalWidth(){
				return this.childRects.reduce((t,c)=>t+c.width , 0) ;
			},
			
			totalHeight(){
				return this.childRects.reduce((t,c)=>t+c.height , 0) ;
			},
			
			//是否为滚动tab
			isScroll(){
				let scrollX = this.scrollX && this.totalWidth > this.tabRect.width ;
				let scrollY = this.scrollY && this.totalHeight > this.tabRect.height ;
				return scrollX || scrollY ;
			},
			
			_maxHeight(){
				return this.pv(this.maxHeight , uni.$b.getSafeArea().height) ;
			},
			
			showLeftArrow(){
				return this.ts.showArrow && this.isScroll && this.scrollX && this.translateX > 0 ;
			},
			
			showRightArrow(){
				return this.ts.showArrow && this.isScroll && this.scrollX && (null == this.maxScroll || this.translateX < this.maxScroll - 5) ;
			},
			
			showTopArrow(){
				return this.ts.showArrow && this.isScroll && this.scrollY && this.translateY > 0 ;
			},
			
			showBottomArrow(){
				return this.ts.showArrow && this.isScroll && this.scrollY && (null == this.maxScroll || this.translateY < this.maxScroll  - 5) ;
			},
			
			isShow(){
				let minlength = Number(this.min);
				return this.listData.length >= minlength ;
			},
			
			averageSize(){
				let len = this.authListData.length ;
				let unit = this.scrollX ? "width" : "height" ;
				return this.tabRect && this.tabRect[unit] && len > 0 ? this.tabRect[unit]/len : 0 ;
			},
			
			listData(){
				return this.authListData.map( (item,index) => {
					let value = item[this.valueKey] ;
					let title = item[this.titleKey] ;
					let icon = item[this.iconKey] ;
					let count = item[this.countKey] ;
					let choosed = (value === this.valueSync && this.isValue ) || ( index === parseInt(this.valueSync) && !this.isValue ) ;
					let disabled = this.ts.disabled || item[this.disabledKey] ;
					
					return {
						value , title , icon , count , choosed , disabled ,
						_index : item._index ,
						scrollTo : item.scrollTo ,
						offsetTop : item.offsetTop ,
						vm : item.vm ,
						style : uni.$b.getStyle({
							'padding' : `${this._ptb} ${this.uvs.plr}` ,
							'color' : choosed ? this.activeColor : this.color ,
							'width' : this._justify == 'average' && this.scrollX ? `${this.averageSize}px` : '' ,
							'height' : this._justify == 'average' && this.scrollY ? `${this.averageSize}px` : '' 
						}),
						class : uni.$b.getClassName({
							'inline' : this.scrollX ,
							'flex' : this.scrollY ,
							'rt' : this.dvs.placement == 'left' ,
							'disabled' : disabled , 
							'text-center' : this._justify == 'average' && this.scrollX ,
						} , choosed ? this.dvs.activeClass : this.dvs.tabClass )
					}
				});
			}
		},
		
		watch:{
			
			value(e){
				this.valueSync = this.value ;
				this._changeIntoView();
			},
			
			indexValue(n,o){
				if (uni.$b.isTrue(n)) {
					let index = this.listData.findIndex(item=>item.value === this.valueSync) ;
					this.select( index , true );
				}else{
					this.select( this.valueSync , true );
				}
			},
			
			list(){
				if (this.isLocalMode) {
					this.refreshAll();
				}
			},
			
			_align(e){
				this.refreshAll();
			},
			
			averageSize(){
				this.refreshAll();
			},
			
			justify(e){
				this.refreshAll();
			},
			
			_justify(e){
				this.refreshAll();
			},
			
			placement(){
				this.refreshAll();
			}
		},
		
		created() {
			//初始化value、list
			this.valueSync = this.value ;
			
			this._onScrollPage = uni.$b.once(this._onScrollPage , 200 ) ;
			this.refreshAllDelay = uni.$b.once(this.refreshAllDelay , 100 ) ;
			
			uni.$on("baseOnPageScroll" , this._onScrollPage );
			uni.$on("baseMediaChange", this.refreshAll );
		},
		
		mounted() {
			this.$nextTick(()=>{
				this.refreshAll();
			})
		},
		
		beforeDestroy() {
			uni.$off("baseOnPageScroll" , this._onScrollPage );
			uni.$off("baseMediaChange", this.refreshAll );
		},
		
		methods:{
			
			_onScrollPage(e){
				if (this.scrollList.length == 0 || this.scrolling) {
					return ;
				}
				let promises = this.scrollList.map(async item=>{
					return uni.$b.select(item.scrollTo , item.vm || await uni.$b.getRoot() ) ;
				});
				Promise.all(promises).then( res=>{
					//筛选出已划出屏幕范围的元素
					let nears = res.filter( (r,index)=> r.top <= this.scrollList[index].offsetTop || 0 );
					//找到top值最大的（离可见区域最近的）元素
					let maxTop = Math.max.apply(Math , nears.map(n=>n.top));
					let currentIndex = nears.findIndex(item=>item.top === maxTop);
					if (currentIndex > -1 ) {
						let scrollItem = this.scrollList[currentIndex] ;
						let index = scrollItem._dataIndex ;
						this.select( index , true );
					}
				})
			},
			
			/**
			 * @description 选中
			 * @param {Object} index
			 * @param {Object} isAuto 是否为内部自动触发，否则为手动触发
			 */
			async select( index , isAuto){
				if ( index < 0 || index > this.listData.length - 1 ) {
					return ;
				}
				let item = this.listData[index] ;
				if (item.disabled) {
					return ;
				}
				
				this.valueSync = this.isValue ? item.value : index ;
				this.$emit("input" , this.valueSync);
				this.$emit("change" , { detail : { value : this.valueSync , index : item._index , item : this.listSync[item._index] } } );
				
				await this.refreshAll();
				// this._changeIntoView();
				
				if (isAuto) {
					return ;
				}
				
				//页面滚动
				let scrollTo = this.listData[index].scrollTo ;
				if (uni.$b.notNull(scrollTo)) {
					//标记为主动滚动，不再对tab进行页面滚动监听
					this.scrolling = true ;
					//将页面滚动延迟执行，防止页面卡顿
					this.$nextTick(async ()=>{
						uni.$b.scrollTo({
							selector : scrollTo , 
							top : this.listData[index].offsetTop || 30 , 
							duration : 100 
						}, this.listData[index].vm || await uni.$b.getRoot() ) ;
					})
					//恢复页面滚动监听
					setTimeout(e => {
						this.scrolling = false ;
					} , 200);
				}
			},
			
			_changeIntoView(index){
				this.setScrollLeft();
				this.setScrollTop() ;
			},
			
			setScrollLeft(){
				if ( !this.scrollX ) {
					this.translateX = 0 ;
					return ;
				}
				let {width : itemWidth , left : itemLeft } = this.activeRect ;
				let {width : boxWidth , left : boxLeft } = this.tabRect ;
				
				let centerX = boxLeft + boxWidth / 2 ;
				let itemCenterX = itemLeft + itemWidth/2 ;
				this.translateX = itemCenterX - centerX ;
			},
			
			setScrollTop(){
				if ( !this.scrollY ) {
					this.translateY = 0 ;
					return ;
				}
				let {height : itemHeight , top : itemTop } = this.activeRect ;
				let {height : boxHeight , top : boxTop } = this.tabRect ;
				
				let centerY = boxTop + boxHeight / 2 ;
				let itemCenterY = itemTop + itemHeight/2 ;
				this.translateY = itemCenterY - centerY ;
			},
			
			async _queryRect(callback){
				//查询子元素的节点信息、父级节点信息
				let promises = [uni.$b.selectAll(".computeItem" , this) , uni.$b.select("#computeView",this)] ;
				let [childRects , tabRect] = await Promise.all(promises) ;
				this.childRects = childRects ;
				this.tabRect = tabRect ;
				uni.$b.isFn(callback) && callback(this.childRects , this.tabRect) ;
			},
			
			async _queryAverage(){
				if (this.dvs.justify != 'auto') {
					this.canAverage = false ;
					this.changeComputed();
					return ;
				}
				let promises = [uni.$b.selectAll(".computeItem" , this) , uni.$b.select("#computeView",this)] ;
				let [rects , tabRect] = await Promise.all(promises);
				this.tabRect = tabRect ;
				//自适应时需要测量是否可以平均分
				this.canAverage = this._getCanAverage( this.tabRect , rects);
				this.changeComputed();
			},
			
			changeComputed(){
				setTimeout((res)=>{
					this.isComputed = true ;
				}, Number(this.duration) + 10 );
			},
			
			//子元素是否可以平均分布
			_getCanAverage(fatherRect , rects){
				if( null == fatherRect || fatherRect.width == 0 || fatherRect.height == 0 || rects.length == 0){
					return false ;
				}
				let unit = this.scrollY ? "height" : "width" ;
				var maxSize = fatherRect[unit] ;
				var perSize = maxSize / rects.length ; //若均分，每一份的宽度、高度
				var allContain = true ; //均分的宽度、高度是否可以容纳所有的元素
				var totalSize = rects.reduce( (total,item)=>{
					if ( item[unit] > perSize ) {
						allContain = false ;
					}
					return total + item[unit] ;
				},0);
				return totalSize <= maxSize && allContain ;
			},
			
			$handleSuccess(res){
				this.$nextTick(async ()=>{
					await this.refreshAll();
					this.$emit("success" , res);
				});
			},
			
			_scrolltolower(){
				this.maxScroll = this.scrollX ? this.translateX : this.translateY ;
			},
			
			_scrollToX(isAdd){
				let width = this.showLeftArrow ? 40 : 0 ;
				width += this.showRightArrow ? 40 : 0 ;
				let offsetX = this.tabRect.width - width ;
				if (isAdd) {
					let x = this.translateX + offsetX ;
					let max = this.maxScroll || this.totalWidth - this.tabRect.width ;
					if (x > max) {
						x = max ;
					}
					this.translateX = x ;
				}else{
					let x = this.translateX - offsetX ;
					if (x < 0) {
						x = 0 ;
					}
					this.translateX = x ;
				}
			},
			
			_scrollToY(isAdd){
				let height = this.showTopArrow ? 40 : 0 ;
				height += this.showBottomArrow ? 40 : 0 ;
				let offsetY = this.tabRect.height - height ;
				if (isAdd) {
					let y = this.translateY + offsetY ;
					let max = this.maxScroll || this.totalHeight - this.tabRect.height ;
					if (y > max) {
						y = max ;
					}
					this.translateY = y ;
				}else{
					let y = this.translateY - offsetY ;
					if (y < 0) {
						y = 0 ;
					}
					this.translateY = y ;
				}
			},
			
			async refreshAllDelay(){
				await Promise.all([ this._queryRect() , this._queryAverage() ]);
				this._changeIntoView();
			},
			
			async refreshAll(){
				await Promise.all([ this._queryRect() , this._queryAverage() ]);
				this._changeIntoView();
				// #ifdef APP-PLUS
				this.refreshAllDelay();
				// #endif
			}
			
		}
	}
</script>
<style lang="scss">
	.badge{
		top: -5px;
		right: -12px;
		min-width: 16px;
		height: 16px;
		background-color: #e1251b;
		color: #fff;
	}
	.noTransition{
		transition-duration: 0s !important;
	}
	.autoWidth{
		width: auto!important;
	}
	.rightShadow{
		border-right: 1px solid #f1f1f1;
		width: 35px;
		box-shadow: 10px 0 16px -14px rgba(0, 0, 0, 0.5) ;
	}
	.leftShadow{
		border-left: 1px solid #f1f1f1;
		width: 35px;
		box-shadow: -10px 0 16px -14px rgba(0, 0, 0, 0.5) ;
	}
	.topShadow{
		border-bottom: 1px solid #f1f1f1;
		height: 35px;
		box-shadow:0 10px  16px -14px rgba(0, 0, 0, 0.5) ;
	}
	.bottomShadow{
		border-top: 1px solid #f1f1f1;
		height: 35px;
		box-shadow:0 -10px  16px -14px rgba(0, 0, 0, 0.5) ;
	}
	.hover7{
		opacity: 1!important;
		&:hover{
			opacity: 0.7!important;
		}
	}
</style>