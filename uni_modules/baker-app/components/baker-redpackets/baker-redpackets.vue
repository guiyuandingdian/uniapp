<template>
	<view>
		<b-list url="baker/api/redpacket/list" :cache="true" @load="dataLoad" :showEmpty="false">
			<baker-share-panel v-if="isShow" title="邀请人数奖励">
					<view class="pb black">
						邀请好友人数达到要求，即可领取相应的奖励，奖励以金币形式发放，可直接兑换现金。
					</view>

					<view class="grid g3 ptb10 plr10" style="background-color: #f19c38;">
						
						<view @tap="receive(item)" v-for="item in listData" :key="item._id">
							<baker-redpacket :friends="item.friends" :amount="item.amount" :received="item.received"></baker-redpacket>
						</view>
						
					</view>
				
					<view class="ptb black fz12 op6">
						注：累计获得{{data.validFriendCoins}}金币奖励的好友为有效好友，好友人数奖励仅统计有效好友人数，现在你有<text class="orange bold">{{validFriends}}</text>位有效好友。
					</view>
			</baker-share-panel>
		</b-list>
		
		<baker-get-coin ref="coinResult" remark="邀请好友任务完成，奖励已到账。"></baker-get-coin>
		
	</view>
</template>

<script>
	export default {
		name:"baker-redpackets",
		props:{
			received:{ //已领取红包ID
				type : Array ,
				default(){
					return [] ;
				}
			},
			validFriends : Number
		},
		data() {
			return {
				list : [],
				data : {},
				curReceived : []
			}
		},
		computed: {
			isShow() {
				return this.list.length > 0 ; 
			},
			listData(){
				return this.list.map((item,index) => {
					item.received = this.received.includes(item._id) || this.curReceived.includes(item._id) ;
					item.disabled = item.friends > this.validFriends ;
					return item ;
				})
			}
		},
		methods: {
			dataLoad({list,data}){
				this.list = list ;
				this.data = data ;
			},
			async receive({received,disabled,_id}){
				if (received ) {
					return ;
				}
				if (disabled) {
					uni.$b.showToast("人数不足");
					return ;
				}
				let {coin} = await this.bakerApi.receivePacket(_id);
				this.$refs.coinResult.show(coin);
				this.curReceived.push(_id);
			}
		}
	}
</script>
