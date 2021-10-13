<template>
	<view v-if="isShowAd">
		<baker-reward-ad ref="ad"
			@adEnd="getNoAdReward"
			@onAdShow="$emit('onAdShow' , true)" 
			@cancel="$emit('cancel' , false)">
			<slot></slot>
		</baker-reward-ad>
	</view>
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	import {userStore} from "../../js_sdk/baker-user-store.js" ;
	export default {
		name:"baker-no-ad",
		props:{
			debug : Boolean 
		},
		computed: {
			adpid(){
				return store.state.adpid ;
			},
			remainCount() {
				return store.state.remainCount ; 
			},
			isShowAd(){
				return store.getters.showAd && !!this.adpid ;
			}
		},
		created() {
			userStore.dispatch("loadData");
		},
		methods:{
			async getNoAdReward(){
				let { noAdTime , minutes } = await this.bakerApi.getNoAdReward();
				store.commit("changeNoAdTime", noAdTime);
				uni.$b.showModal({
					title: "恭喜您获得免广告特权" ,
					content: `现在起${minutes}分钟内，您可享受阅读器内免广告阅读，今日还有${this.remainCount}次机会。`,
					showCancel: false ,
					confirmText:"知道了"
				});
				this.$emit("onAdReward" , { noAdTime , minutes });
			},
			showAd(){
				this.$refs.ad && this.$refs.ad.showAd();
			}
		}
	}
</script>
