<template>
	<view class="hh" style="background-color: #F5F5F5;">
		<view class="h10"></view>
		<view class="plr whiteBg">
			<view class="flex  ptb ">
				<view >基本信息</view>
				<view class="bk-youjiantou_huaban1"></view>
			</view>
			<view class="flex ptb bt">
				<view >账号与安全</view>
				<view class="bk-youjiantou_huaban1"></view>
			</view>
			
			<view class="flex ptb bt">
				<view >夜间模式</view>
				<view >
					<b-switch color="#FBD02D"></b-switch>
				</view>
			</view>
			
			<view class="flex ptb bt">
				<view >阅读设置</view>
				<view class="bk-youjiantou_huaban1"></view>
			</view>
			
			<view class="flex ptb bt">
				<view >推送通知</view>
				
				<view>
					<text>已开启</text>
					<text class="bk-youjiantou_huaban1"></text>
				</view>
				
			</view>
			
			<view class="flex ptb bt">
				<view >清理缓存</view>
				<view class="bk-youjiantou_huaban1"></view>
			</view>
			
			<view class="flex ptb bt">
				<view >隐私设置</view>
				<view class="bk-youjiantou_huaban1"></view>
			</view>
		</view>
		
		<view class="mt10">
			<view class="whiteBg plr">
				<view class="flex ptb">
					<view >关于</view>
					<view class="bk-youjiantou_huaban1"></view>
				</view>
			</view>
		</view>
		
		<view class="pd fixed bottom">
			<view class="flex">
				<navigator url="" class="main">《用户协议》</navigator>
				<navigator url="" class="main">《隐私政策》</navigator>
				<navigator url="" class="main">《儿童个人信息保护规则》</navigator>
			</view>
		</view>
		
		<view class="mtb text-center">
			<b-btn type="text" text-color="#999" >退出登录</b-btn>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
