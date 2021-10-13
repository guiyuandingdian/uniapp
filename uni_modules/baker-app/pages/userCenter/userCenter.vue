<template>
	<view>
		<baker-user-center ref="userCenter"></baker-user-center>
	</view>
</template>

<script>
	export default {
		onShow() {
			this.$refs.userCenter && this.$refs.userCenter.refresh();
		},
		onPullDownRefresh() {
			this.$refs.userCenter.refresh();
		}
	}
</script>