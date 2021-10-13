<template>
	<view>
		
		<!-- #ifdef H5 -->
		<view class="grayBg father">
			<image :src="adSrc" mode="aspectFill" class="block h200"></image>
			<view class="pd10 whiteBg fz12 gray ti0">
				开通广告后显示真实广告（当前未开通）
			</view>
			<view @tap="onClose" class="abs bottom right pb10 pr bIcon-multiply bold fz16"></view>
		</view>
		<!-- #endif -->
		
		
		<!-- #ifdef MP-WEIXIN -->
		<view @tap="onClose" class="abs bottom right pb10 pr bIcon-multiply bold fz16"></view>
		<!-- #endif -->
		
		<!-- <b-btn @tap="showActions">关闭广告</b-btn> -->
		
		<view key="firstAd" v-if="showFirstAd">
			<ad :adpid="adpid" :unit-id="adpid" @load="onload" @error="onerror" @close="onClose"></ad>
		</view>
		
		<view key="secondAd" v-else>
			<ad :adpid="adpid" :unit-id="adpid" @load="onload" @error="onerror" @close="onClose"></ad>
		</view>
		
		<baker-no-ad ref="rewardAd" @onAdReward="onAdReward" :debug="debug"></baker-no-ad>

	</view>
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	export default {
		name: "baker-ad",
		props: {
			debug: Boolean
		},
		data() {
			return {
				showFirstAd: true,
				showHolder: false
			};
		},

		computed: {
			adpid(){
				return store.state.bannerAdpid ;
			},
			//测试代码
			adSrc() {
				let domain = "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-50b20889-219e-4ebc-99a4-e844865e8d0b/";
				return domain + (parseInt(Math.random() * 100) % 2 == 0 ? "3534d163-b2ce-4083-84b2-5158dfdc8515.jpg" :
					"f538c551-6617-4459-b049-06d7d1c6a843.jpg"); 
			}
		},
		
		async mounted() {
			await store.dispatch("init");
			this.showHolder = !this.adpid ;
		},

		methods: {
			onload(e) {
				this.$emit("load");
			},
			onerror(e) {
				this.showHolder = true;
				this.$emit("error");
				console.log("onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
			},
			onClose(e) {
				this.$nextTick(() => {
					this.showFirstAd = !this.showFirstAd ;
				})
				this.showActions();
			},
			showActions() {
				uni.showActionSheet({
					itemList: ["看小视频免广告", "VIP会员免广告"],
					success: ({
						tapIndex
					}) => {
						if (tapIndex == 0) {
							this.$refs.rewardAd.showAd();
						} else if (tapIndex == 1) {
							uni.$b.navigateTo({
								url:"/uni_modules/baker-app/pages/user/vip"
							})
						}
					}
				})
			},
			onAdReward() {
				this.$emit("onAdReward");
			}
		}
	}
</script>
