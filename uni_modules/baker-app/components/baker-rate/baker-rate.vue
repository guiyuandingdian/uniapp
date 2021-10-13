<template>
	<view class="text-right">
		<view v-if="showScore" class="fz18 bold" style="color: #FFC300;">
			{{score}} <text class="fz12">分</text>
		</view>
		<b-rate active-color="#FFC300" :value="score" size="20rpx" :margin="3" :scale="2" :disabled="true"></b-rate>
	</view>
</template>

<script>
	export default {
		name:"baker-rate",
		props:{
			score : [Number,String],
			showScore:Boolean
		}
	}
</script>
