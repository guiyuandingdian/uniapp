<template>
	<view class="normal">
		
		<view @tap="$refs.vip.show();">
			<slot></slot>
		</view>
		
		<!-- 权益说明 start -->
		<b-modal ref="vip" modal-class="whiteBg rds10" show-cancel='true' z-index="22" :show-close="false">
			<view class="text-center bold fz16 mb20 pt" slot='header'>权益说明</view>
			<view class="flex t">
				<view class="w40 center-block">
					<view class="square">
						<view class="rds bg op2"></view>
						<view class="bk-adblock main fz25 flex ct"></view>
					</view>
				</view>
				<view class="cover ml">
					<view class="bold ">阅读无广告</view>
					<view class="gray">开通VIP会员即可享受阅读无广告，畅享纯净阅读。</view>
				</view>
			</view>
		
			<view class="flex mt t">
				<view class="w40 center-block">
					<view class="square">
						<view class="rds bg op2"></view>
						<view class="bk-jinbi main fz25 flex ct"></view>
					</view>
				</view>
				<view class="cover ml">
					<view class="bold ">额外金币</view>
					<view class="gray">开通VIP会员的用户每日阅读满30分钟、60分钟、90分钟、180分钟，可获得双倍金币奖励。</view>
				</view>
			</view>
			<view class="flex mt t">
				<view class="w40 center-block">
					<view class="square">
						<view class="rds bg op2"></view>
						<view class="bk-jinbi main fz25 flex ct"></view>
					</view>
				</view>
				<view class="cover ml">
					<view class="bold ">尊贵标识</view>
					<view class="gray">开通VIP会员即可点亮尊贵标识，即可彰显与众不同的身份。</view>
				</view>
			</view>
		
			<view class="flex ct ptb20" slot="footer">
				<b-btn radius="40" ptb="8" width="120" @tap="$refs.vip.hide()">我知道啦</b-btn>
			</view>
		</b-modal>
		<!-- 权益说明 end -->
		
	</view>
</template>

<script>
	export default {
		name:"baker-vip-remark"
	}
</script>
