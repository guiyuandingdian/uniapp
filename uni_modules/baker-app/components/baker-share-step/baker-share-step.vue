<template>
	<view>
		
		<baker-tail-title title="简单三步轻松赚金币"></baker-tail-title>
		
		<view class="flex ct ptb text-center">
			<view class="w75">
				<view class="rds w50 center-block orBg">
					<view class="square">
						<view class=" flex ct">
							<view class="baker bk-fenxiang fz22"></view>
						</view>
					</view>
				</view>
				<view class="mt10 fz12">
					<!-- #ifdef APP-PLUS || H5 -->
					<view>分享邀请码</view>
					<!-- #endif -->
					<!-- #ifdef MP -->
					<view>分享小程序</view>
					<!-- #endif -->
					<view>邀请好友</view>
				</view>
			</view>
			
			<view class="w40 pb40 stepLine"></view>
			
			<view class="w75">
				<view class="rds w50 center-block orBg">
					<view class="square">
						<view class=" flex ct">
							<view class="baker bk-qr_code fz22"></view>
						</view>
					</view>
				</view>
				<view class="mt10 fz12 ">
					<!-- #ifdef APP-PLUS || H5 -->
					<view>好友扫码注册</view>
					<!-- #endif -->
					<!-- #ifdef MP -->
					<view>进入小程序注册</view>
					<!-- #endif -->
					<view>绑定关系</view>
				</view>
			</view>
			
			<view class="w40 pb40 stepLine"></view>
			
			<view class="w75">
				<view class="rds w50 center-block orBg">
					<view class="square">
						<view class=" flex ct">
							<view class="baker bIcon-userFill fz28"></view>
						</view>
					</view>
				</view>
				<view class="mt10 fz12 ">
					<view>好友赚金币</view>
					<view>共分奖励</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"baker-share-step"
	}
</script>
<style lang="scss">
	.orBg{
		background-color: rgba(255,255,255,0.2);
		color: #fbc112;
	}
	.stepLine{
		border-top:1px dashed #85819c;
	}
</style>
