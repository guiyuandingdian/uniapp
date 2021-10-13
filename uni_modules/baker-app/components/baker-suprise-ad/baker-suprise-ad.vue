<template>
	<view>
		<baker-reward-ad ref="ad"
			@adEnd="getSuprise"
			@onAdShow="$emit('onAdShow' , true)" 
			@cancel="$emit('cancel' , false)">
			<slot></slot>
		</baker-reward-ad>
	</view>
</template>

<script>
	export default {
		name:"baker-suprise-ad",
		methods:{
			async getSuprise(data){
				let { coin } = await this.bakerApi.getSupriseReward();
				this.$emit("onAdReward" , { coin });
			},
			showAd(){
				this.$refs.ad.showAd();
			}
		}
	}
</script>
