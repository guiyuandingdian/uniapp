<template>
	<view v-if="hasAdCount" @tap="showAd">
		<slot></slot>
	</view>
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	import AD from "./ad-helper.js" ;
	/**
	 * @property {String} type 
	 * 		@value RewardedVideo 激励视频
	 * 		@value FullScreenVideo 全屏视频
	 * @event {Function} success (data) 包含保存的广告视频观看记录的_id 
	 */
	export default {
		name:"baker-reward-ad",
		props:{
			saveUrl : {
				type : String ,
				default : "baker/api/ad/save"
			},
			type : {
				type : String ,
				default : "RewardedVideo" //RewardedVideo 、FullScreenVideo
			},
			//设置为空时不显示
			cancelTips : {
				type : String ,
				default : "视频播放中止，未获得奖励"
			}
		},
		data() {
			return {
				hasCount : false 
			};
		},
		computed: {
			adpid(){
				return store.state.adpid ;
			},
			hasAdCount() {
				return store.getters.hasAdCount ;
			},
			adData(){
				return {
					adpid : this.adpid ,
					adType: this.type
				};
			}
		},
		mounted() {
			this.$nextTick(async () => {
				//初始化广告剩余数据
				await store.dispatch("init"); 
				
				//预加载广告数据
				this.preloadAd();
			})
		},
		methods:{
			//预加载广告数据
			preloadAd(){
				if (!this.hasAdCount) {
					return ;
				}
				// #ifdef APP-PLUS
				if (!this.adData.adpid) console.error("adpid is undefined");
				AD.load(this.adData);
				// #endif
			},
			
			//展示广告
			showAd(){
				let isDebug = uni.$b.getValue("debug") ;
				if ( isDebug ) {
					this.showDebugAd();
				}else{
					AD.show( this.adData , this.onSuccess , this.onError ) ;
				}
				this.$emit("onAdShow");
			},
			
			showDebugAd(){
				uni.$b.showModal({
					content:"当前测试环境将不进行广告播放，点击按钮直接体验广告播放后的效果。" ,
					confirmText:"播放结束" ,
					cancelText:"中途退出",
					success: (e) => {
						this.onSuccess({isEnded : e.confirm});
					}
				});
			},
			
			onSuccess({isEnded} = {}){
				if (isEnded) {
					this.onEnd();
				}else{
					uni.$b.showToast(this.cancelTips);
					this.$emit("cancel");
				}
			},
			
			async onEnd(){
				this.$emit("adEnd");
				store.commit("used" , 1);
			},
			
			onError(err){
				console.log("err: ",err);
				// uni.showModal({
				// 	content: JSON.stringify(err)
				// })
				uni.$b.showToast("广告加载失败");
			},
			
		}
	}
</script>
