<template>
	<view v-if="!!recentData.name">
		<view class="flex whiteBg bd rds8 shadow pd10" @tap="$emit('change' , recentData)">
			<view class="cover">
				<view  class="flex cv">
					<baker-cover :src="recentData.cover" width="45"></baker-cover>
					<view class="cover ml10 pr10 flex vertical t">
						<view class="lh1 fz15">
							<text>{{recentData.name}}</text>
							<text class="bk-icon-test ml5 w20 fz18" style="color: #FF6740;"></text>
						</view>
						<view v-if="!recentData.isRead" class="clip c2 gray fz12 text-justify" style="max-height: 76rpx;">
							{{recentData.intro}}
						</view>
						<view v-else class="break gray fz12 mt5">
							<b-time class="inline" :date="recentData.updateTime" differ="month"></b-time>
							<view class="mr10">读到：{{recentData.title}}</view>
							<view class="inline yellow mt2">继续阅读 ></view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="editing" class="w40 flex rt">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-recent-book",
		props:{
			editing : Boolean ,
			recentData : {
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
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
