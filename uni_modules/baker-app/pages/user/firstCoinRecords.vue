<template>
	<view>
		<baker-coin-records :fromLevel="1" :isToday="isToday" :ready="ready"></baker-coin-records>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				isToday : "" ,
				ready : false 
			} ;
		},
		onLoad({isToday}) {
			this.isToday = isToday ;
			this.ready = true ;
		}
	}
</script>