<template>
	<view class="statusBar" :class="bg">
		<view class="statusBar fixed top z20" :class="bg"></view>
	</view>
</template>

<script>
	export default {
		name:"baker-statusbar",
		props:{
			bg:{
				type:String,
				default : "bg"
			}
		}
	}
</script>
