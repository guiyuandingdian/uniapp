<template>
	<view>
		<b-time :date="now" format="HH:mm"></b-time>
	</view>
</template>

<script>
	export default {
		name:"baker-system-time",
		data() {
			return {
				now : Date.now()
			};
		},
		created() {
			this.timer = setInterval(()=>{
				this.now = Date.now();
			},60000);
		}
	}
</script>

<style>

</style>
