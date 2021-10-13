<template>
	<view>
		<!-- 顶部栏 -->
		<view class="fixed top" :style="boxStyle">
			<view class="statusBar"></view>
			<view class="flex">
				<view v-if="showBack" class="h40 flex ct w50" @tap="back">
					<view class="rds w30 h30 flex ct bIcon-arrowLeft bold fz16"></view>
				</view>
				<view class="cover text-center fz16 bold">
					<slot></slot>
				</view>
				<view v-if="showBack" class="h40 w60 op0"></view>
			</view>
		</view>
		
		<!-- 返回按钮 -->
		<view class="fixed top" :style="btnStyle">
			<view class="statusBar"></view>
			<view v-if="showBack" class="flex">
				<view class="h40 flex ct w50" @tap="back">
					<view class="wp7 white rds w30 h30 flex ct bIcon-arrowLeft fz16"></view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"baker-trans-title",
		props:{
			showBack:{
				type : Boolean ,
				default: true 
			},
			zIndex : {
				type : Number ,
				default : 20 
			},
			min : {
				type : Number ,
				default : 100 
			},
			max : {
				type : Number ,
				default : 300 
			},
			bgColor:{
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor") ;
				}
			},
			color:{
				type : String ,
				default(){
					return uni.$b.getValue("components.mainInverse") ;
				}
			},
			backUrl : String ,
			openType : String 
		},
		data() {
			return {
				scrollTop : 0
			}
		},
		computed: {
			boxStyle() {
				return uni.$b.getStyle({
					'z-index' : this.zIndex ,
					'background-color' : this.bgColor ,
					'color' : this.color ,
					'opacity' : this.opacity
				})
			},
			btnStyle(){
				return uni.$b.getStyle({
					'z-index' : this.zIndex ,
					'opacity' : 1 - this.opacity
				})
			},
			opacity(){
				if (this.scrollTop < this.min) {
					return 0 ;
				}
				if (this.scrollTop > this.max ) {
					return 1 ;
				}
				let average = (this.max + this.min) / 2 ;
				return this.scrollTop / average ;
			}
		},
		created() {
			uni.$on("baseOnPageScroll" , this.setScroll ) ;
		},
		destroyed() {
			uni.$off("baseOnPageScroll" , this.setScroll ) ;
		},
		methods: {
			setScroll({scrollTop}){
				this.scrollTop = scrollTop ;
			},
			back(){
				uni.$b.navigateBack({
					url : this.backUrl ,
					openType : this.openType
				});
			}
		}
	}
</script>
