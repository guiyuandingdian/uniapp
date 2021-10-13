<template>
	<view class="pd30 lh9">
		<view class="bold mb5">一、注销账号必须符合以下条件：</view>
		<view class="pl gray">1.不存在正在审核中的提现申请；</view>
		<view class="pl gray">2.账号处于正常状态，不存在被禁用等限制情形。</view>
		
		<view class="bold mt mb5">二、注销后的账号，相关信息会被清空且无法找回，无法进行相关操作：</view>
		<view class="pl gray">1.无法登录、使用已注销的账号；</view>
		<view class="pl gray">2.账号中的书架记录将被清空；</view>
		<view class="pl gray">3.账号中的会员权益将被清空；</view>
		<view class="pl gray">4.账号中的邀请好友关系将被清空；</view>
		<view class="pl gray">5.账号中的签到记录将被清空；</view>
		<view class="pl gray">6.账号中的金币余额将被清空。</view>
		
		<view class="ptb30">
			<b-btn type="block" radius="23px" confirm="注销后无法恢复，确认注销账号吗？" url="baker/user/user/cancelAccount" @success="onSuccess">
				同意并申请注销账号
			</b-btn>
		</view>
		
		<baker-user-data ref="userData"></baker-user-data>
		
	</view>
</template>

<script>
	export default {
		methods: {
			onSuccess(){
				uni.setStorageSync("baker_history" , []);
				this.$refs.userData.quit();
				uni.switchTab({
					url:"/uni_modules/baker-app/pages/userCenter/userCenter"
				})
			}
		}
	}
</script>
