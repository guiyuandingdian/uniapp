<template>
	<view @tap="switctTab">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"baker-switch-tab",
		props:{
			url : String ,
			params : {
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
		methods:{
			switctTab(){
				uni.setStorageSync("baker_switchTab" , this.params);
				uni.switchTab({
					url: this.url 
				})
			}
		}
	}
</script>
