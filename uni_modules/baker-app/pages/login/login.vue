<template>
	<view>
		<baker-logins mode="display" @loginSuccess="onSuccess"></baker-logins>
	</view>
</template>

<script>
	export default {
		methods: {
			onSuccess(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>
