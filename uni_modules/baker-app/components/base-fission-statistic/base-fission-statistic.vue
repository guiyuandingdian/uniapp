<template>
	<view>
		
		<b-data ref="loader" url="base-fission/user/info" @load="data = $event.data;">
			
			<view class="abs top h200 gradualBg white">
				<view class="bIcon-shareFill abs top right op1" style="font-size: 120px;"></view>
				<view class="bIcon-shareFill abs top left op1 rotate180" style="font-size: 280px;"></view>
			</view>
			
			<view class="father z1 pd">
				
				<view class="text-center ptb30">
					<b-copy :text="data.my_invite_code">
						<view class="fz30 bold text-center flex ct">
							<view class="father">
								<text>{{data.my_invite_code}}</text>
								<view class="abs top right op9" style="top:-40rpx;right: -80rpx;">
									<b-tag tag-class="rdsTl13 rdsBr13 ptb2 plr5 fz12" color="rgba(255,255,255,0.4)" text-color="#3e3e3e">复制</b-tag>
								</view>
							</view>
						</view>
						<view class="fz14 op8">
							我的邀请码
						</view>
					</b-copy>
				</view>
				
				<view class="rds10 whiteBg shadow mt20">
					
					<b-title more-text="查看" :bar-color="color" :url="teamUrl" :params="{type:1}">
						<view class="fz18 bold">我的好友</view>
					</b-title>
					
					<view class="grid g3 text-center ptb20 fz20">
						
						<view class="bold" :style="colorStyle">
							<b-navigator :url="teamUrl" :params="{type:1}">
								<view>{{data.baker_friends}}</view>
								<view class="fz12 gray normal">总邀请好友</view>
							</b-navigator>
						</view>
						
						<view  class="bold" :style="colorStyle">
							<b-navigator :url="teamUrl" :params="{type:1}">
								<view>{{data.baker_first_friends}}</view>
								<view class="fz12 gray normal">直邀好友</view>
							</b-navigator>
						</view>
						
						<view  class="bold" :style="colorStyle">
							<b-navigator :url="teamUrl" :params="{type:2}">
								<view>{{data.baker_second_friends}}</view>
								<view class="fz12 gray normal">扩散好友</view>
							</b-navigator>
						</view>
						
					</view>
					
					<view class="pd20 plr50 father z2">
						<baker-share :data="data"></baker-share>
					</view>
					
				</view>
				
				
				<view class="rds10 whiteBg shadow mt20">
					<b-title more-text="玩法规则" :bar-color="color">
						<view class="fz18 bold">好友累计给我赚钱</view>
					</b-title>
					
					<view class="grid g3 text-center pt20 pb30 fz20">
						
						<view  class="bold" :style="colorStyle">
							<b-price :price="data.baker_invite_benefits" :fixed="2"></b-price>
							<view class="fz12 gray normal">合计</view>
						</view>
						
						<view  class="bold" :style="colorStyle">
							<b-price :price="data.baker_first_benefits" :fixed="2"></b-price>
							<view class="fz12 gray normal">直邀好友贡献</view>
						</view>
						
						<view  class="bold" :style="colorStyle">
							<b-price :price="data.baker_second_benefits" :fixed="2"></b-price>
							<view class="fz12 gray normal">扩散好友贡献</view>
						</view>
						
					</view>
					
				</view>
				
				
				<view class="rds10 whiteBg shadow mt20">
					<b-title more-text="10人活跃" :bar-color="color">
						<view class="fz18 bold">今日好友给我赚钱</view>
					</b-title>
					
					<view class="grid g3 text-center pt20 pb30 fz20">
						
						<view  class="bold" :style="colorStyle">
							<b-price :price="data.baker_today_invite_benefits" :fixed="2"></b-price>
							<view class="fz12 gray normal">合计</view>
						</view>
						
						<view  class="bold" :style="colorStyle">
							<b-price :price="data.baker_today_first_benefits" :fixed="2"></b-price>
							<view class="fz12 gray normal">直邀好友贡献</view>
						</view>
						
						<view  class="bold" :style="colorStyle">
							<b-price :price="data.baker_today_second_benefits" :fixed="2"></b-price>
							<view class="fz12 gray normal">扩散好友贡献</view>
						</view>
						
					</view>
					
				</view>
				
				
				<view class="rds10 whiteBg shadow mt20">
					
					<b-title @tapMore="makePhoneCall(data.inviter.mobile)" more-text="联系ta" :bar-color="color" :showMore="!!data.inviter_uid && !!data.inviter && !!data.inviter.mobile">
						<view class="fz18 bold">我的邀请人</view>
					</b-title>
					
					<view v-if="!!data.inviter" class="pt20 pb30 flex lt plr">
						
						<b-image :src="data.inviter.avatar" default-src="/uni_modules/baker-app/static/header.jpg"  img-class="rds" width="50" height="100%"></b-image>
						
						<view class="pl">
							他邀请了{{data.inviter.baker_friends}}人，累计收益 <text class="main">{{data.inviter.baker_invite_benefits}}</text> 元
						</view>
						
					</view>
					
					<!-- 绑定邀请人 -->
					<baker-bind-inviter v-else @success="$refs.loader.loadData();"></baker-bind-inviter>
					
				</view>
				
			</view>
			
			
		</b-data>
		
		
	</view>
</template>

<script>
	export default {
		name : "base-fission-statistic" ,
		props:{
			color : {
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor") ;
				}
			},
			teamUrl : {
				type : String ,
				required:true 
			} ,
			shareUrl : {
				type : String ,
				required:true 
			} 
		},
		computed: {
			colorStyle() {
				return `color:${this.color}`;
			}
		},
		created() {
			uni.$b.call("base-fission/user/countFirendsByLevel");
		},
		data() {
			return {
				data : {} 
			}
		},
		methods: {
			makePhoneCall(phoneNumber){
				if (!phoneNumber) {
					return ;
				}
				uni.makePhoneCall({
					phoneNumber
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #f1f1f1;
}
</style>
