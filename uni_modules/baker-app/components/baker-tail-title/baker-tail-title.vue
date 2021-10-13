<template>
	<view class="flex ct ptb10">
		<view class="w60 h2 gradualLeft"></view>
		<view class="plr fz16">{{title}}</view>
		<view class="w60  h2 gradualLeft rotate180"></view>
	</view>
</template>

<script>
	export default {
		name: "baker-tail-title",
		props: {
			title: String
		}
	}
</script>

<style lang="scss">
	.gradualLeft {
		background-image: linear-gradient(to right, rgba(#fff, 0.1), #fff);
	}
</style>
