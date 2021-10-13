<template>
	<view class="b-price" :class="fontClass" :style="boxStyle">
		
		<!-- 单位 -->
		<text :style="fontSize" v-if="showPrefix">{{prefix}}</text>
		
		
		<!-- + - 符号 -->
		<block v-if="price != 0">
			<text v-if="type == 'bill' && posive">
				+
			</text>
			<text v-if="!posive">
				-
			</text>
		</block>
		
		
		{{intPrice}}
		<text class="point" :style="fontSize" v-if="dotPrice">.{{dotPrice}}</text>
		
		
		<!-- 单位 -->
		<text :style="fontSize" v-if="showSuffix">{{suffix}}</text>
	</view>
</template>

<script>
	/**
	* @description Price 价格与金额，价格、金额格式化
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/price
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number}        fixed               小数点四舍五入后保留多少位数，默认-1，表示根据金额自适应，最多保留2位。
	*    @value                        0                   不保留小数
	*    @value                        1                   保留1位小数
	*    @value                        2                   保留2位小数
	* @property {Boolean|String}       prefix              价格单位，位于价格左侧，默认¥，可通过配置文件修改components.price.unit来修改默认值，type为price、originPrice时有效。不需要显示时留空或设置为false均可。
	*    @value                        ￥                   人民币
	*    @value                        $                   美元
	*    @value                        false               不显示价格单位
	* @property {String|Number}        price               价格、金额
	* @property {String|Number}        relative-scale      价格单位、小数点后数字的相对于价格的缩小倍数，默认0.7，type为price、bill时有效。
	*    @value                        0.5                 0.5倍
	*    @value                        0.6                 0.6倍
	*    @value                        0.7                 0.7倍
	*    @value                        0.8                 0.8倍
	*    @value                        0.4                 0.4倍
	* @property {Boolean|String}       suffix              价格单位，位于价格右侧，可通过配置文件配置components.price.suffix来修改默认值。不需要显示时可留空或设置为false。
	*    @value                        元                   元
	*    @value                        元/人                 元/人
	*    @value                        元/课时                元/课时
	* @property {Boolean|String}       thousandth          是否显示千分位，默认false。
	*    @value                        true                显示千分位
	*    @value                        false               不显示千分位
	* @property {String}               type                金额类型，默认price。
	*    @value                        price               价格，含有价格单位符号，价格主体可放大。
	*    @value                        originPrice         原价，含有价格单位符号，有一条删除线。
	*    @value                        bill                账单金额，金额左侧有 +、- 号修饰符。
	* @property {String}               unit                表示当前传入的价格的价格单位，默认yuan，可通过配置文件配置components.price.unit来修改默认值。若传入fen，则表示当前价格是以分为单位的价格，将转换为元后展示。
	*    @value                        yuan                当前价格为以元为单位的价格，无须转换。
	*    @value                        fen                 当前价格是以分为单位的价格，将转换为元后展示。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name: 'b-price',
		props: {
			fontClass : {
				type : String ,
				default : "avanti"
			},
			type : {
				type : String ,
				default : "price"
			},
			unit:{
				type : String ,
				default(){
					return uni.$b.getValue("components.price.unit")
				}
			},
			prefix:{
				type : [String,Boolean] ,
				default(){
					return uni.$b.getValue("components.price.prefix")
				}
			},
			suffix : {
				type : [String,Boolean] ,
				default(){
					return uni.$b.getValue("components.price.suffix")
				}
			},
			thousandth:[String , Boolean],
			price: {
				type: [Number,String],
				default: 0.00
			},
			fixed:{
				type : [String , Number] ,
				default : -1
			},
			relativeScale : {
				type : [String , Number] ,
				default : 0.7
			}
		},
		
		computed: {
			
			ns(){
				return uni.$b.getNumbers.call(this , "price","relativeScale","fixed") ;
			},
			
			isPrice(){
				return this.type == 'price' || this.type == 'originPrice' ;
			},
			
			showPrefix(){
				return !uni.$b.isFalse(this.prefix) && uni.$b.notNull(this.prefix) && this.isPrice ;
			},
			
			showSuffix(){
				return !uni.$b.isFalse(this.suffix) && uni.$b.notNull(this.suffix) && this.isPrice ;
			},
			
			posive(e){
				return this.ns.price > 0 ;
			},
			
			basePrice(){
				return this.unit == 'fen' ? 0.01 : 1 ;
			},
			
			absPrice(){
				return Math.abs( uni.$b.multiply( this.ns.price , this.basePrice ) ) ;
			},
			
			intPrice(e){
				if(uni.$b.isNull(this.ns.price)){
					return "" ;
				}
				let price = this.ns.fixed == 0 ? Math.round(this.absPrice) : Math.floor(this.absPrice) ;
				return this.toThousandth(price)  ;
			},
			
			dotPrice(e){
				if(uni.$b.isNull(this.ns.price)){
					return "" ;
				}
				let dotPrice = this.absPrice % 1 ;
				if ( this.ns.fixed == -1 ) {
					dotPrice = uni.$b.multiply( parseInt( uni.$b.multiply(dotPrice , 100) ) , 0.01) ;
					dotPrice = dotPrice == 0 ? '' : dotPrice.toString().replace("0.","") ;
				}else{
					dotPrice = dotPrice.toFixed(this.ns.fixed) ;
					dotPrice = dotPrice == 1 ? '' : dotPrice.toString().replace("0.","") ;
				}
				return this.toThousandth(dotPrice) ;
			},
			
			fontSize(){
				let percent = this.type == 'originPrice' ? 100 : this.ns.relativeScale * 100 ;
				return `font-size:${percent}%` ;
			},
			
			boxStyle(){
				return uni.$b.getStyle({
					'text-decoration' : this.type == 'originPrice' ? 'line-through' : ''
				})
			}
		},
		
		methods:{
			toThousandth(number){
				let reg = /\d{1,3}(?=(\d{3})+$)/g ;
				return uni.$b.isTrue(this.thousandth) ? number.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(reg,"$&,")+s2;}) : number ;
			}
		}
	}
</script>
<style lang="scss">
	.point{
		letter-spacing: 1px;
	}
</style>