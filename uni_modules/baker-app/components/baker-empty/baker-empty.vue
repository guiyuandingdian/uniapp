<template>
	<view>
		<b-empty :ptb="ptb" :is-show="true" :tips="tips" :color="color">
			
			<image slot="icon" :src="`/uni_modules/baker-app/static/${imgName}`" mode="widthFix" class="w150 h150"></image>
			
			<slot></slot>
			
		</b-empty>
	</view>
</template>

<script>
	export default {
		name:"baker-empty",
		props:{
			ptb:{
				type : [String,Number,Array],
				default : 40
			},
			imgName : {
				type : String ,
				default : "noData.png"
			},
			tips : {
				type : String ,
				default : "抱歉，暂无相关书籍~"
			},
			color : String
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
