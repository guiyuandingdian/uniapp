<template>
	<view>
		<baker-trans-title back-url="/uni_modules/baker-app/pages/index/index" open-type="switchTab" bgColor="#6339b5" color="#fff" :min="300" :max="500">幸运大转盘</baker-trans-title>
		
		<view class="father" :class="{'op0' : !ready}">
			
			<b-data ref="loader" url="baker/user/lucky/count" @load="dataLoad">
				
				<image src="/uni_modules/baker-app/static/lucky-bgs.jpg" mode="widthFix" class="block w100p"></image>
				<view class="abs top pt130">
					
					<!-- 抽奖转盘 start-->
					<baker-lucky-draw ref="luckyDraw" :prizeList="prizeList" @finished="onFinished" @start="onStart" @end="onEnd" :times="times" :totalTimes="totalTimes" :prizeIndex="prizeIndex" :todayTimes="todayTimes" :hasAdCount="hasAdCount"></baker-lucky-draw>
					<!-- 抽奖转盘 end-->
					
					
					<view class="flex ct pt20 white">
						<view class="text-center rds23 ptb7 gradualPinkBg fz15 plr30">
							剩余抽奖次数：<text class="bold main">{{remainTimes}}</text>
						</view>
					</view>
					
					<view class="pd white">
						
						<baker-tail-title title="规则说明"></baker-tail-title>
						
						<view class="op6 mtb10 text-justify plr10">
							<view class="flex t mb">
								<view class="pt3">
									<view class="w15 h15 rds4 whiteBg flex ct fz12 mr10">1</view>
								</view>
								<view class="cover">成功登录后，每人每天有{{totalTimes}}次抽奖机会，第1次可以直接抽奖，其余{{totalTimes-1}}次机会可通过观看视频来获取，每完整看完一次即可进行一次抽奖。</view>
							</view>
							
							<view class="flex t mb">
								<view class="pt3">
									<view class="w15 h15 rds4 whiteBg fz12 flex ct mr10">2</view>
								</view>
								<view class="cover">观看视频过程中请勿退出，若退出则视为放弃本次抽奖机会。</view>
							</view>
							
							<view class="flex t">
								<view class="pt3">
									<view class="w15 h15 rds4 whiteBg fz12 flex ct mr10">3</view>
								</view>
								<view class="cover">抽奖机会将在每日凌晨0点刷新。</view>
							</view>
						</view>
					</view>
					
					
					<baker-statement class="white op5"></baker-statement>
					
				</view>
			</b-data>
			
			<b-result  ref="modal" title="抽奖机会已用完" remark="观看小视频可领取一次抽奖机会" icon="bIcon-warnFill" color="#FFDB3C" :showClose="false" :closeByMask="false">
				
				<view class="ptb40">
					
					<view class="flex ct">
						<baker-reward-ad ref="ad"
							@adEnd="getChance"
							@onAdShow="$emit('onAdShow' , true)" 
							@cancel="$emit('cancel' , false)">
							<b-btn left-icon="bIcon-playerFill"
								radius="40" 
								ptb="8"
								plr="20">
								领取抽奖机会
							</b-btn>
						</baker-reward-ad>
					</view>
					
					<view @tap="$refs.modal.hide();" class="flex ct gray pt">
						放弃领取
					</view>
					
				</view>
				
			</b-result>
			
			
			<!-- 金币奖励结果 -->
			<baker-get-coin ref="coinResult" remark="恭喜获得金币奖励，奖励已到账。"></baker-get-coin>
			
			
			
			
		</view>
	</view>
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	export default {
		data() {
			return {
				ready : false ,
				//剩余抽奖次数
				times : 0 ,
				prizeList : [] ,
				totalTimes : 5 ,
				todayTimes : 0 ,
				prizeIndex : -1 ,
				prizeCoin : 0 
			}
		},
		computed: {
			remainTimes(){
				return this.totalTimes - this.todayTimes + this.times ;
			},
			hasAdCount(){
				return store.getters.hasAdCount ;
			}
		},
		onLoad() {
			// this.baker.fullscreen(true); 
		},
		onUnload() {
			// this.baker.fullscreen(false); 
		},
		methods: {
			
			dataLoad({ times, todayTimes , totalTimes , prizeList}){
				this.times = times ;
				this.todayTimes = todayTimes ;
				this.totalTimes = totalTimes ;
				this.prizeList = prizeList || this.prizeList ;
				this.$nextTick(()=>{
					if (!this.ready) {
						uni.showLoading({
							title:"准备中..."
						});
					}
				})
			},
			
			onStart(){
				if (this.times > 0) {
					//抽取奖励
					this.$refs.luckyDraw.start();
					this.getResult();
					return ;
				}
				//可用抽奖次数已用尽
				if (this.todayTimes < this.totalTimes) {
					//视频已看完
					if( !this.hasAdCount ) {
						uni.$b.showToast("今日视频已看完");
						return ;
					}
					//可以看视频抽奖
					this.$refs.modal.show();
					return ;
				}
				uni.$b.showToast("今日抽奖机会已用完");
			},
			
			async onEnd(prize){
				if (!prize) {
					return ;
				}
				this.$refs.coinResult.show(this.prizeCoin , prize.prizeImage);
			},
			
			//获取抽奖机会
			async getChance(data){
				let { luckyData } = await this.bakerApi.getChanceReward();
				if (luckyData) {
					this.dataLoad(luckyData);
					this.$refs.modal.hide();
					if(luckyData.times > 0) uni.$b.showToast("已获得一次抽奖机会");
				}
			},
			
			//获取抽奖结果
			async getResult(){
				let res = await this.bakerApi.getLuckyResult();
				//发生错误
				if (res.code != "ok") {
					uni.$b.showToast(res.message);
					this.prizeIndex = -1 ;
					return ;
				}
				this.prizeIndex = res.index ;
				this.prizeCoin = res.coin ;
				this.dataLoad(res);
			},
			
			refresh(){
				this.$refs.loader.loadData();
			},
			
			onFinished(){
				this.ready = true ;
				this.$nextTick(()=>{
					uni.hideLoading();
				})
			}
		}
	}
</script>
<style lang="scss">
	page{
		background-color: #6339b5;
	}
	.gradualPinkBg{
		background-color: #804fe0;	
	}
</style>