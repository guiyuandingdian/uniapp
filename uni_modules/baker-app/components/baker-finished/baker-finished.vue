<template>
	<view>
		{{finished ? "完结" : "连载"}}
	</view>
</template>

<script>
	export default {
		name:"baker-finished",
		props:{
			finished : Boolean
		}
	}
</script>
