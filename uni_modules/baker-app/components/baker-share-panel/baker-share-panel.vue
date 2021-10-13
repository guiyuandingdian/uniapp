<template>
	<view>
		<view class="rds8 pd mt30 father whiteBg" style="background-color: #fed156;">
			<view class="abs top" style="top:-18rpx;">
				<image class="w200 center-block h40"  src="/uni_modules/baker-app/static/shape.png" mode="widthFix"></image>
				<view class="abs fz16 flex ct black">{{title}}</view>
			</view>
			<view class="pt30">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-share-panel",
		props:{
			title : String 
		}
	}
</script>
