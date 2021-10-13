<template>
	<view>
		<view class="flex t mb" v-for="(item,index) in 3" :key="index">
				<view class="w35 ">
					<b-image src="/uni_modules/baker-app/static/novelPic.png" img-class="rds" width="100%"></b-image>
				</view>
				<view class="cover ml">
					<view class="fz15 mb5">小迷糊</view>
					<view class="clip c3" style="color: #BCC3CB;">
						这里是评
						论是评论是评论是评论是评论是评论是评论是评论
						论是评论是评论是评论是评论是评论是评论是评论
						论是评论是评论是评论是评论是评论是评论是评论
						论是评论是评论是评论是评论是评论是评论是评论
						论是评论是评论是评论是评论是评论是评论是评论
						论是评论是评论是评论是评论是评论是评论是评论
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-comments",
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
