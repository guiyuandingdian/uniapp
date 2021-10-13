<template>
	<view class="b-navigator" :hover-class="hoverClass" @tap="open">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"b-navigator",
		props:{
			url : String ,
			params:{
				type : Object ,
				default(){
					return {};
				}
			},
			openType : String ,
			hoverClass:{
				type : String ,
				default : "hover8"
			}
		},
		methods: {
			open(){
				uni.$b.open({
					url : this.url ,
					params : this.params ,
					openType : this.openType
				})
			}
		}
	}
</script>
