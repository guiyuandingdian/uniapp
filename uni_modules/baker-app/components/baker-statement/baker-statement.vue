<template>
	<view class="ptb20 fz12 text-center" v-if="isIos">
		本活动与Apple Inc.无关
	</view>
</template>

<script>
	export default {
		name:"baker-statement",
		data() {
			return {
				isIos : uni.getSystemInfoSync().platform == "ios"
			}
		}
	}
</script>
