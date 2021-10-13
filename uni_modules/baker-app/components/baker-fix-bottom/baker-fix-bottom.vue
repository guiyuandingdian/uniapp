<template>
	<view>
		<view id="box" class="fixed bottom safeBottom" :style="{'z-index' : zIndex}" :class="bgClass">
			<slot></slot>
		</view>
		<view v-if="holder" :style="{height}"></view>
	</view>
</template>

<script>
	export default {
		name:"baker-fix-bottom",
		props:{
			holder : {
				type : Boolean ,
				default : true
			},
			bgClass:{
				type : String ,
				default : "whiteBg"
			},
			zIndex : {
				type : Number ,
				default : 20
			}
		},
		computed: {
			height() {
				return `${this.rect.height}px`;
			}
		},
		data() {
			return {
				rect : { height : 50 }
			};
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