<template>
	<view>
		
		<b-data ref="loader" url="baker/user/user/signInfo"  v-slot:default="{data}">
			
			<!-- 个人金币信息 -->
			<view class="bg pd h90">
				<navigator url="/uni_modules/baker-app/pages/user/coinRecords" class="flex" hover-class="op9">
					<view>
						<view class="flex lt">
							<view >我的金币：{{data.baker_coin}}</view>
							<view>
								<b-tag tag-class="rds20 rdsBl0 fz12 ptb3 plr7" class="ml" text-color="#fff" color="#FF6013">
									约{{data.amount}}元
								</b-tag>
							</view>
						</view>
					</view>
					<view class="bk-youjiantou_huaban1 fz18"></view>
				</navigator>
			</view>
			
			
			<!-- 签到 -->
			<view class="plr" style="margin-top: -70rpx;">
				<baker-sign :sign="data.signData" :signConfig="data.config" :signCoins="data.signCoins" :vip="data.baker_vip" @refresh="$refs.loader.loadData();"></baker-sign>
			</view>
			
			
			
			<view class="whiteBg plr bb">
				
				<view class="flex bb ptb pr10">
					<view>
						<view class="flex lt">
							<view class="fz16">幸运大转盘</view>
							<view class="ml10">
								<text class="bk-liwu mr5 yellow"></text>
								<text class="fz12 yellow">海量金币</text>
							</view>
						</view>
						<view class="gray fz12">
							小手快来抖一抖，海量金币赢不停
						</view>
					</view>
					<view>
						<b-btn href="/uni_modules/baker-app/pages/user/luckyDraw" class="fz12" radius="23" left-icon="bk-choujiang">去抽奖</b-btn>
					</view>
				</view>
				
				<baker-no-ad>
					<view class="flex ptb bb pr10">
						<view>
							<view class="fz16">观看视频免广告</view>
							<view class="gray fz12">
								观看小视频立享30分钟无广告阅读
							</view>
						</view>
						<view>
							<b-btn left-icon="bIcon-playerFill" class="fz12" radius="23">免广告</b-btn>
						</view>
					</view>
				</baker-no-ad>
				
				<view class="flex ptb pr10">
					<view>
						<view class="flex lt">
							<view class="fz16">看视频领金币</view>
							<view class="ml10">
								<text class="yellow bk-jinbi mr5"></text>
								<text class="yellow" v-if="!!data.config">+{{data.baker_vip ? data.config.vipVideoCoins : data.config.videoCoins}}金币</text>
							</view>
						</view>
						<view class="gray fz12">
							观看小视频，得丰厚金币奖励
						</view>
					</view>
					<view>
						<baker-coin-task v-model="data.videoTaskCompleted" @success="$refs.loader.loadData();"></baker-coin-task>
					</view>
				</view>
			
			</view>
			
			
			<!-- 阅读奖励 -->
			<baker-read-reward :readCoins="data.readCoins" :minutes="data.baker_today_minutes" :completes="data.baker_read_completes"></baker-read-reward>
			
			<baker-statement class="gray"></baker-statement>
			
		</b-data>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>
