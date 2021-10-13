<template>
	<view>
		<block v-if="!hasAdCount || value">
			<view class="rds20 bd text-center gray ptb6 fz12" style="min-width: 79px;">
				已完成
			</view>
		</block>
		<block v-else-if="!value">
			<baker-reward-ad :debug="true" @adEnd="getCoinReward">
				<b-btn class="fz12" radius="23" left-icon="bIcon-playerFill">
					领金币
				</b-btn>
			</baker-reward-ad>
		</block>
		
		<baker-get-coin ref="coinResult" @hide="onSuccess"></baker-get-coin>
		
	</view>
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	export default {
		name:"baker-coin-task",
		props:{
			value : Boolean 
		},
		computed: {
			hasAdCount() {
				return store.getters.hasAdCount ;
			}
		},
		methods:{
			onSuccess(){
				this.$emit("success");
			},
			//获取金币奖励
			async getCoinReward(){
				let {coin , videoRemainTimes} = await this.bakerApi.getCoinReward();
				this.$emit("input" , videoRemainTimes <= 0 );
				this.$refs.coinResult.show(coin);
			}
		}
	}
</script>
