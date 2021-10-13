<template>
	<view>
		<view class="flex t mb">
			<view class="w35 ">
				<b-image src="/uni_modules/baker-app/static/novelPic.png" radius="100%" width="100%"></b-image>
			</view>
			<view class="cover ml">
				<view class="gray fz15 mb5">小迷糊</view>
				<view class="clip c5">这里是评
				论是评论是评论是评论是评论是评论是评论是评论
				论是评论是评论是评论是评论是评论是评论是评论
				论是评论是评论是评论是评论是评论是评论是评论
				论是评论是评论是评论是评论是评论是评论是评论
				论是评论是评论是评论是评论是评论是评论是评论
				论是评论是评论是评论是评论是评论是评论是评论
				</view>
				
				<view class="flex fz12 gray mtb10">
					<view>1分钟前</view>
					<view>删除</view>
					<view>
						<view class="flex" >
							<view>
								0
								<text class="bIcon-editSquare ml5"></text>
							</view>
							<view class="ml20">
								点赞
								<text class="bIcon-good ml5"></text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="grayBg rds5 plr10 ptb5 mt  bb fz12">
					<view style="color: #929292;" class=" mb3">
						<text style="color: #185c9e;">小迷糊：</text>
						这里是评论是评论是评论是评论是评论是评论是评论是评论是评论
					</view>
					
					<view style="color: #929292;" class="mb3">
						<text style="color: #185c9e;">我回复你：</text>
						这里是回复
					</view>
					
					<navigator url="" style="color: #185c9e;">查看共385条回复></navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'comment',
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
