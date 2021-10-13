<template>
	<view class="father text-center" :class="{'op5' : received}">
		<image v-if="received" class="w90p" src="/uni_modules/baker-app/static/redpacketed.png" mode="widthFix"></image>
		<image v-else class="w90p" src="/uni_modules/baker-app/static/redpacket.png" mode="widthFix"></image>
		<view class="abs red top flex ct fz12" style="top:10rpx">
			￥ <span class="fz25 bold">{{amount}}</span>
		</view>
		<view class="abs bottom fz12 flex ct" style="bottom:26%;color: #fafafa;">好友{{friends}}人</view>
	</view>
</template>

<script>
	export default {
		name:"baker-redpacket",
		props:{
			received : Boolean ,
			amount : Number ,
			friends : Number
		}
	}
</script>