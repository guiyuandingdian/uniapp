<template>
	<view>
		
		<baker-trans-title back-url="/uni_modules/baker-app/pages/userCenter/userCenter" open-type="switchTab" bgColor="#5b3eba" color="#fff" :min="50" :max="150">
			邀请好友赚金币
		</baker-trans-title>
		
		<b-data ref="loader" url="base-fission/user/info" :params="{isCartoon}" @load="onDataLoad">
		
			<view class="pt30" style="background-color: #5c40bb;">
				
				<view class="father yellowRed">
					<image class="w100p block" src="/uni_modules/baker-app/static/share.jpg" mode="widthFix"></image>
					<view class="text-center pt160 abs top">
						<view class="pt6">
							<b-copy :text="data.my_invite_code">
								<view class="fz30 bold text-center flex ct lh1">
									<view class="father ">
										{{data.my_invite_code}}
									</view>
								</view>
								<view class="fz14 op9 mt3">
									我的邀请码
								</view>
							</b-copy>
						</view>
						<view class="white op7">
							<view class="mt60">
								<!-- #ifdef APP-PLUS || H5 -->
								将邀请码分享给好友
								<!-- #endif -->
								<!-- #ifdef MP -->
								将小程序分享给好友
								<!-- #endif -->
							</view>
							<view>
								即可绑定好友关系
							</view>
						</view>
					</view>
				</view>
				
				<view class="pd" >
					
					<view class="pd father z2">
						
						<!-- #ifdef MP -->
						<button open-type="share" class="rds25 ptb10 shareBtn">
							立即邀请好友
						</button>
						<!-- #endif -->
						
						<!-- #ifdef APP-PLUS || H5 -->
						<baker-share :data="data"></baker-share>
						<!-- #endif -->
						
					</view> 
					
					<view class="grid g3 white ptb text-center">
						<view class="text-center">
							<view class="fz30">
								{{data.baker_friends}}
							</view>
							<view class="fz12 op7">邀请好友</view>
						</view>
						
						<view class="text-center">
							<view class="fz30">
								{{data.baker_today_invite_benefits}}
							</view>
							<view class="fz12 op7">今日收益金币</view>
						</view>
						
						<view class="text-center">
							<view class="fz30">
								{{data.baker_invite_benefits}}
							</view>
							<view class="fz12 op7">总收益金币</view>
						</view>
					</view>
					
					<view v-if="showMoreInfo" class="white mt rds7" style="background-color: #3b29a7;">
						<view  class="pd">
							
							<!-- 分享步骤 -->
							<baker-share-step></baker-share-step>
							
							<!-- 分享奖励 -->
							<baker-share-panel title="金币奖励说明">
								<view class="pb black">
									好友参加金币奖励活动获得金币或购买会员消费，您都将获得金币奖励。
								</view>
								
								
								<view class="flex ptb10 plr dataItem" :class="{ 'active' : index % 2 != 0 }" v-for="( item , index) in data.rules" :key="index">
									<view class="bold">{{item.title}}</view>
									<view>
										获得
										<block v-if="item.min > 0">
											<span class='red'>{{item.min}}~</span> 
										</block>
										<span class='red'>{{item.max}}金币</span>
									</view>
								</view>
								
							</baker-share-panel>
							
							
							<!-- 邀请红包 -->
							<baker-redpackets :validFriends="data.validFriends" :received="data.baker_redpackets"></baker-redpackets>
							
							
							<!-- 好友人数 -->
							<baker-share-statistic title="我的好友" tTitle="总邀请好友" subTitle="直邀好友" sSubTitle="扩散好友" unit="人"
								:total="data.baker_friends" :subTotal="data.baker_first_friends" :sSubTotal="data.baker_second_friends"
								subUrl="/uni_modules/baker-app/pages/user/team?type=1"
								sSubUrl="/uni_modules/baker-app/pages/user/team?type=2"></baker-share-statistic>
							
							
							<!-- 金币数量 -->
							<baker-share-statistic title="好友贡献金币" tTitle="好友总贡献" subTitle="直邀好友贡献" sSubTitle="扩散好友贡献" unit="金币"
								:total="data.baker_invite_benefits" :subTotal="data.baker_first_benefits" :sSubTotal="data.baker_second_benefits"
								subUrl="/uni_modules/baker-app/pages/user/firstCoinRecords"
								sSubUrl="/uni_modules/baker-app/pages/user/secondCoinRecords"></baker-share-statistic>
							
							
							<!-- 今日好友贡献金币 -->
							<baker-share-statistic title="今日好友贡献金币" tTitle="好友总贡献" subTitle="直邀好友贡献" sSubTitle="扩散好友贡献" unit="金币"
								:total="data.baker_today_invite_benefits" :subTotal="data.baker_today_first_benefits" :sSubTotal="data.baker_today_second_benefits"
								subUrl="/uni_modules/baker-app/pages/user/firstCoinRecords?isToday=yes"
								sSubUrl="/uni_modules/baker-app/pages/user/secondCoinRecords?isToday=yes"></baker-share-statistic>
							
							
							
							
							<baker-share-panel title="我的邀请人">
								
								<view class="pd pb10 dataItem active">
									
									<view v-if="!!data.inviter" class="flex lt">
										<b-image :src="data.inviter.avatar" default-src="/static/header.jpg"  img-class="rds" width="50" height="100%"></b-image>
										<view class="pl10" @tap="makePhoneCall(data.inviter.mobile)">
											<view class="flex lt">
												<view class="fz16 bold">
													{{data.inviter.nickname || data.inviter.mobile}}
												</view>
												<view class=" underline fz12 ml" style="text-decoration: underline;">联系ta</view>
											</view>
											<view class="fz12">
												他邀请了{{data.inviter.baker_friends}}人，累计收益{{data.inviter.totalAmounts}}元
											</view>
										</view>
									</view>
									
									
									<!-- 绑定邀请人 -->
									<baker-bind-inviter v-else @success="$refs.loader.loadData();"></baker-bind-inviter>
									
								</view>
								
								
							</baker-share-panel>
							
							
							
						</view>
					</view>
					
				</view>
				<!-- 活动区域 -->
				
				<image src="/uni_modules/baker-app/static/clouds.png" mode="widthFix" class="block"></image>
				
			</view>
		
		</b-data>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data : {
					fissionData : {}
				},
				showMoreInfo:false ,
				isCartoon : false 
			}
		},
		
		onLoad({isCartoon}) {
			this.isCartoon = uni.$b.isTrue(isCartoon);
			// #ifdef MP
			uni.showShareMenu();
			// #endif
		},
		
		// #ifdef MP
		onShareAppMessage() {
			let {summary , shareCover , path} = this.data.fissionData ;
			return {
				title : summary ,
				imageUrl : shareCover ,
				path
			}
		},
		// #endif
		
		methods: {
			makePhoneCall(phoneNumber){
				if (!phoneNumber) {
					return ;
				}
				uni.makePhoneCall({
					phoneNumber
				})
			},
			onDataLoad(e){
				this.data = e.data;
				this.$nextTick(() => {
					this.showMoreInfo = true ;
				})
			}
		}
	}
</script>

<style lang="scss">
	.yellowRed{
		color: #bd450a;
	}
	/* #ifdef MP */
	.shareBtn{
		font-size: 16px;
		letter-spacing: 2px;
		color: #e9153e;
		font-weight: bold;
		background-image: linear-gradient(#ffe38e, #fec44d);
		box-shadow: 0 2px 10px #482f9c;
	}
	/* #endif */
</style>
