<template>
	<view>
		<view id="box" :style="{'z-index' : zIndex}" :class="boxClass">
			<view class="statusBar"></view>
			<slot></slot>
		</view>
		<view v-if="holder" :style="{height}" :class="bgClass"></view>
	</view>
</template>

<script>
	export default {
		name:"baker-fix-top",
		props:{
			holder : {
				type : Boolean ,
				default : true
			},
			bgClass:{
				type : String ,
				default: ""
			},
			zIndex : {
				type : Number ,
				default : 20
			}
		},
		data() {
			return {
				rect : { height : 0 }
			};
		},
		computed: {
			height() {
				return `${this.rect.height}px` ;
			},
			boxClass(){
				return uni.$b.getClassName({
					"fixed top" : this.rect.height > 0 || !this.holder
				} , this.bgClass);
			}
		},
		mounted() {
			if (this.holder) {
				this.queryRect();
			}
		},
		methods:{
			async queryRect(){
				this.rect = await uni.$b.select("#box",this);
			}
		}
	}
</script>
