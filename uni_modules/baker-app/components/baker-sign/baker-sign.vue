<template>
	<view>
		
		<view class="whiteBg bd rds8 shadow pd10 flex">
			<view class="cover">
				<view class="bold">
					<block v-if="!sign.signed">
						首次签到额外奖励 <text class="yellow bold">{{signConfig.firstSignCoins}}</text> 金币
					</block>
					<block v-else-if="sign.noBreakTimes == 0 ">
						尚未签到
					</block>
					<block v-else>
						您已连续签到 <text class="yellow">{{sign.noBreakTimes}}</text> 天
					</block>
				</view>
				<view class="gray fz12">
					<block v-if="sign.hasSuprise">
						看小视频可领取最多{{sign.maxScale}}倍随机奖励
					</block>
					<block v-else>
						签到基础奖励 <text class="yellow bold">{{signCoins}}</text> 金币
					</block>
				</view>
			</view>
			
			<block v-if="sign.hasSuprise">
				<baker-suprise-ad @onAdReward="onAdReward">
					<b-btn class="fz12" ptb="5" radius="20" left-icon="bIcon-playerFill">
						领翻倍金币
					</b-btn>
				</baker-suprise-ad>
			</block>
			
			<b-btn v-else-if="!sign.signedToday" url="baker/user/sign/save" @success="signSuccess"
				class="fz12" plr="20" ptb="5" radius="20" min-width="144rpx">
				签到
			</b-btn>
			
			<block v-else-if="sign.signedToday">
				<view class="rds20 bd text-center gray ptb6 fz12" style="min-width: 144rpx;">
					已签到
				</view>
			</block>

		</view>
		
		
		<!-- 签到成功 -->
		<baker-get-coin ref="modal" :remark="remark">
			<view class="ptb40">
				
				<view class="flex ct">
					<baker-suprise-ad @onAdReward="onAdReward">
						<b-btn left-icon="bIcon-playerFill"
							radius="40" 
							ptb="8"
							plr="20">
							领取翻倍奖励
						</b-btn>
					</baker-suprise-ad>
				</view>
				
				<view @tap="onGiveUp" class="flex ct gray pt10">
					放弃领取
				</view>
				
			</view>
		</baker-get-coin>
		
		<baker-get-coin ref="coinResult" @hide="refresh();"></baker-get-coin>
		
	</view>
</template>

<script>
	export default {
		name:"baker-sign",
		props:{
			sign:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			signConfig:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			signCoins:Number,
			vip : Boolean
		},
		data() {
			return {
				signedData : {
					coin : 50 ,
					maxScale : 3
				}
			};
		},
		computed: {
			remark() {
				return `观看30s小视频可最多获得${this.signedData.maxScale}倍随机金币奖励` ; 
			}
		},
		methods:{
			signSuccess(data){
				this.signedData = data ;
				this.$refs.modal.show(data.coin);
			},
			onAdReward({coin}){
				this.$refs.modal.hide();
				this.$refs.coinResult.show(coin);
			},
			refresh(){
				this.$emit("refresh");
			},
			onGiveUp(){
				this.$refs.modal.hide();
				this.refresh();
			}
		}
	}
</script>
