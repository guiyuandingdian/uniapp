<template>
	<view>

		<base-fission-team color="#FCA111" :type="type"></base-fission-team>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type : 0
			}
		},
		onLoad({type}) {
			this.type = Number(type);
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
