<template>
	<view class="b-row" :style="outerStyle" v-if="visiableSync">
		<view id="row" @tap="onTap" class="grid h100p" :class="classNameSync" :style="style">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/**
	* @description Row 响应式布局行，与`b-col`组件一起使用，可以在`手机`、`宽屏手机`、`ipad`、`窄屏PC`、`宽屏PC`等五种常见设备上，构建灵活多变的响应式布局，支持一行任意列布局方式，可以定义任意布局列大小噢。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/row
	* @version     1.0.0
	* 
	* 
	* @ ------------------------------------------
	* Events 事件
	* --------------------------------------------
	* @event    {Function} click                                   点击时触发 ( event )
	* @property {String|Number|Array}            cols              【响应式属性】  单行列数，默认2列
	* @property {String|Number|Array}            gutter            【响应式属性】  每一列子元素的左右内边距，默认10upx，可通过配置文件配置components.row.gutter来修改默认值。
	* @property {String|Number|Array}            gutter-bottom     【响应式属性】  每一列子元素的底部外边距
	* @property {Boolean|String|Number|Array}    gutter-me         【响应式属性】  子元素设置左右内边距时，自身左右两侧各向外延伸相同的距离，默认true。通常用于消除子元素内边距引起的自然塌陷。
	*/
	export default {
		name:"b-row",
		mixins:[uni.$b._mixins.media],
		props:{
			width:[String , Number , Array],
			height:[String , Number , Array],
			cname:[Array,String] ,
			visiable: {
				type : [Array,Boolean,Number,String] ,
				default(){
					return 1 ;
				}
			},
			cols : {
				type : [Number , String , Array],
				default(){
					return 2 ;
				}
			},
			gutter : {
				type: [Number,String,Array] , 
				default(){
					return uni.$b.getValue("components.row.gutter" , "10upx") ;
				}
			},
			gutterBottom : [Number,String,Array] ,
			gutterMe :{
				type : [Boolean,String,Number,Array],
				default : true  
			},
			align :{
				type : [String , Array] ,
				default(){
					return "left" ;
				}
			},
			verticalAlign:{
				type : [String , Array] ,
				default(){
					return "top" ;
				}
			}
		},
		
		data(){
			return {
				rect : {width : 0},
				nameMap:{
					"top" : "t" ,
					"bottom" : "b" ,
					"middle" : "m" ,
					"cover-vertical" : "cv",
					"left" : "lt" ,
					"right" : "rt" ,
					"center" : "ct" ,
					"around" : "ar" ,
					"between" : "sb"
				}
			}
		},
		
		computed:{
			
			classNameSync(){
				//当前设备的类名
				let className = this.getByDevice(this.cname) ;
				//对齐方式
				let align = this.getByDevice(this.align);
				let verticalAlign = this.getByDevice(this.verticalAlign) ;
				//基础类名
				let basicName = `${this.nameMap[align]} ${this.nameMap[verticalAlign]} ${className}`;
				
				// #ifdef MP-BAIDU || MP-WEIXIN || MP-TOUTIAO || MP-QQ 
				return `${this.realWidth > 0 ? basicName : ''}` ;
				// #endif
				
				// #ifndef MP-BAIDU || MP-WEIXIN || MP-TOUTIAO || MP-QQ 
				return `${basicName}` ;
				// #endif
			},
			
			/**
			 * @description 子元素宽度百分比
			 * @return {Number} 返回当前媒体设备每一个子元素所占的宽度百分比，此值可被子元素自身定义的宽度百分比覆盖
			 */
			childPercent(){
				//长度为5的cols数组，表示在各个媒体设备上每一行分别共有多少列
				let cols = parseFloat(this.getByDevice(this.cols)) ;
				//当前媒体设备每一个子元素所占的宽度百分比，此值可被子元素自身定义的宽度百分比覆盖
				return cols <= 0 ? 100 : 100/cols ;
			},
			
			/**
			 * @description 分栏的间隔
			 */
			childGutter(){
				return this.getUnitValue(this.gutter) ;
			},
			
			gutterMeSync(){
				return this.getBoolValue(this.gutterMe) ;
			},
			
			widthSync(){
				return this.getUnitValue(this.width);
			},
			
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ || MP-BAIDU
			
			//是否指定了具体的宽度
			noWidthValue(){
				return uni.$b.isNull(this.widthSync) || this.widthSync.indexOf("auto") > -1 || this.widthSync.indexOf("%") > -1 ;
			},
			
			//可供子元素使用的真实宽度值
			realWidth(){
				if ( this.noWidthValue ) {
					return this.rect.width ;
				}
				return uni.$b.parsePx(this.widthSync) ;
			},
			
			// #endif
			
			heightSync(){
				return this.getUnitValue(this.height);
			},
			
			visiableSync(){
				let visiable = this.getByDevice(this.visiable) ;
				return uni.$b.isNull(visiable) || uni.$b.isUnstrictTrue(visiable) ;
			},
			
			style(){
				let size = this.gutterMeSync ? `-${this.childGutter}` : '' ;
				return uni.$b.getStyle({
					"margin-left" : size ,
					"margin-right" : size ,
					"width" : this.gutterMeSync ? 'auto' : '' 
				});
			},
			
			outerStyle(){
				return uni.$b.getStyle({
					 width : this.widthSync , 
					 height : this.heightSync 
				})
			}
		},
		
		created() {
			
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ || MP-BAIDU
			
			uni.$on("baseOnAnimateShow" , uni.$b.once(this.resize , 200 ));
			
			// #endif
			
		},
		
		mounted() {
			this.resize() ;
		},
		
		methods:{
			onTap(e){
				this.$emit("click" , e);
			},
			
			resize(callback){
				// #ifdef MP-BAIDU || MP-WEIXIN || MP-TOUTIAO || MP-QQ  
				if ( this.noWidthValue ) {
					uni.$b.select( "#row" , this).then(rect=>{
						this.rect = rect ;
						uni.$b.isFn(callback) && callback(rect) ;
					});
				}
				// #endif
			}
		}
	}
</script>
