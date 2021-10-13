<template>
	<view class="pd">
		<view class="rds8 bg plr pt">
			<view class="fz16">金币余额</view>
			<view class="flex mt10">
				<view>
					<view class="flex lt">
						<view class="bold fz20">235</view>
						<view>
							<b-tag tag-class="rds20 rdsBl0 fz12 ptb3 plr7 ml3" color="#FC5D14" text-color="#fff">约0.23元</b-tag>
						</view>
					</view>
				</view>
				<view>
					<b-btn is-plain="true" radius="20" color="#000" ptb="5"  class="fz12">立即提现</b-btn>
				</view>
			</view>
			
			<view class="flex lt mt pb20 bb" style="color: #886F03;border-color: #e4bf08;">
				<view class="br pr20" style="border-color:#e4bf08 ;">
					<view style="color: #886F03;">今日金币</view>
					<view style="color: #886F03;">0</view>
				</view>
				<view class="ml20">
					<view>累计赚取金币</view>
					<view>300</view>
				</view>
			</view>
			
			<view class="flex ptb7" style="color: #886F03;">
				<view>10000金币=1元</view>
				<view>金币说明 <text class="bk-help ml5"></text></view>
			</view>
		</view>
		
		<view class="flex  mt30 mb">
			<view class="fz18 bold">金币明细</view>
		</view>
		
		<view class="flex ptb10 bb" v-for="(item,index) in 3" :key="index">
			<view>
				<view>幸运大转盘</view>
				<view class="gray fz12 mt5">2021-03-11</view>
			</view>
			<view class="main  bold">+ 88金币</view>
		</view>
		
		<view class="text-center fz12 gray ptb">系统只保留最近100条的金币明细</view>
		
		<view class="text-center mt">
			<b-btn radius="20" plr="50" ptb="8" class="bold">金币提现</b-btn>
		</view>
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

<style>

</style>
