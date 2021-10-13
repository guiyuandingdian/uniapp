<template>
	<view v-if="list.length > 0">
		<view class="pd5 grayBg"></view>
		<view class="pb">
			<view class="flex  mtb mb plr">
				<view class="fz18 bold">
					每日阅读福利
				</view>
				<view>
					<text class="mr5 gray">今日已读：{{minutes}}分钟</text>
				</view>
			</view>
			
			<view class="plr">
				<view class="flex bt ptb pr10" v-for="(item,index) in list" :key="index">
					<view>
						<view class="flex lt">
							<view class="fz16">阅读达到{{item.minutes}}分钟</view>
							<view class="ml">
								<text class="yellow bk-jinbi mr5"></text>
								<text class="yellow">+{{item.coin}}金币</text>
							</view>
						</view>
					</view>
					<view>
						<block v-if="item.status == 1">
							<b-btn href="/uni_modules/baker-app/pages/index/index" open-type="switchTab" is-plain="true" class="fz12" color='#999' text-color="#000" radius="23"  min-width="77" :shadow="false">去阅读</b-btn>
						</block>
						<block v-else-if="item.status == 2">
							<b-btn url="baker/user/readReward/save" :params="{minutes : item.minutes}" @success="onSuccess(item)" class="fz12" radius="23" min-width="77">
								领取奖励
							</b-btn>
						</block>
						<block v-else-if="item.status == 3">
							<view class="rds20 bd text-center gray ptb6 fz12" style="min-width: 79px;">
								已完成
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		
		<baker-get-coin ref="coinResult"></baker-get-coin>
		
	</view>
</template>

<script>
	export default {
		name:"baker-read-reward",
		props:{
			minutes:Number,
			readCoins:Number,
			completes : {
				type : Array ,
				default(){
					return [] ;
				}
			}
		},
		data() {
			return {
				completed : []
			}
		},
		computed: {
			list() {
				if (!this.readCoins) {
					return [] ;
				}
				let list = [1,3,6,10,15,24] ;
				return list.map((item,i)=>{
					let coin = (i == 0 ? item : item - list[i-1] ) * this.readCoins ;
					let minutes = item * 10 ;
					let status = this.minutes < minutes ? 1 : 2 ;
					if (this.completes.includes(minutes) || this.completed.includes(minutes)) {
						status = 3 ;
					}
					return {
						minutes , 
						coin ,
						status
					} ;
				})
			},
			activeIndex(){
				let index = -1 ;
				for (var i = 0; i < this.list.length; i++) {
					let {minutes} = this.list[i] ;
					if (this.minutes >= minutes) {
						index = i ;
					}
				}
				return index ;
			}
		},
		methods: {
			onSuccess({minutes , coin}){
				this.completed.push(minutes);
				this.$refs.coinResult.show(coin);
			}
		}
	}
</script>
