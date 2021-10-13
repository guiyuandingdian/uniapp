<template>
	<view class="b-tel" @tap="makePhoneCall">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"b-tel",
		props:{
			phoneNumber : [String,Number]
		},
		methods: {
			makePhoneCall(){
				if(!this.phoneNumber){
					return ;
				}
				uni.makePhoneCall({
					phoneNumber:this.phoneNumber
				})
			}
		}
	}
</script>

<style>

</style>
