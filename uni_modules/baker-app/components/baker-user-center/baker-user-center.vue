<template>
	<view class="pb50">
		
		<baker-trans-title :showBack="false" :min="50" :max="100"></baker-trans-title>
		
		<baker-user-data ref="userData" v-slot:default="{data , logined}">
			
			<view class="gradualBg pt60">
				
				<block v-if="!logined">
					<view class="flex plr pb">
						<view class="father">
							<b-image :src="data.avatar" default-src="/static/header.jpg"  img-class="rds" width="60" height="100%"></b-image>
						</view>
						<view class="cover pl">
							<baker-logins>
								<b-btn radius="20" is-plain="true" min-width="60" ptb="2" plr="10s" color="#000" :shadow="false">
									点击登录
								</b-btn>
							</baker-logins>
							<view class="mt10 fz12">登录后阅读可得金币，金币可提现</view>
						</view>
					</view>
				</block>
				<block v-else>
					<navigator class="flex plr pb" url="/uni_modules/baker-app/pages/user/userInfo" hover-class="op9">
						<view class="father">
							<b-image :src="data.avatar" default-src="/static/header.jpg"  img-class="rds" width="60" height="100%"></b-image>
						</view>
						<view class="cover pl">
							<view class="fz16 bold flex lt">
								{{data.nickname}}
								<view v-if="data.baker_vip" class="bk-huiyuan bold ml6 fz20 lh1"></view>
							</view>
							<view class="mt5">
								<view v-if="data.baker_vip" class="flex lt op7">
									<b-time :date="data.baker_vip_time" differ="day" format="yyyy年MM月dd日"></b-time>
									会员到期
								</view>
								<view v-else>
									普通用户
								</view>
							</view>
						</view>
						<view class="bIcon-set fz20 pr"></view>
					</navigator>
				</block>
				
				
				<view class="grid g3 text-center pb20 pt fz18">
					<navigator url="/uni_modules/baker-app/pages/user/coinRecords">
						<view class="bold">{{data.baker_coin || 0}}</view>
						<view class="fz12 op8">我的金币</view>
					</navigator>
					<navigator url="/uni_modules/baker-app/pages/user/coinRecords?isToday=yes" class="bl" style="border-color: #efc10b;">
						<view class="bold">{{data.baker_today_coin || 0}}</view>
						<view class="fz12 op8">今日金币</view>
					</navigator>
					<view class="bl" style="border-color: #efc10b;">
						<view class="bold">{{data.baker_today_minutes || 0}}</view>
						<view class="fz12 op8">今日阅读（分钟）</view>
					</view>
				</view>
				
			</view>
			
			<view class="grid g3 text-center whiteBg ptb mb10">
				<view class="item">
					<baker-logins href="/uni_modules/baker-app/pages/user/luckyDraw">
						<view class="bk-choujiang1 fz25 red"></view>
						<view>幸运大转盘</view>
					</baker-logins>
				</view>
				<view class="item">
					<baker-logins :href="share">
						<view class="bk-yaoqing fz25 green"></view>
						<view>邀请赚钱</view>
					</baker-logins>
				</view>
				<view class="item">
					<baker-logins href="/uni_modules/baker-app/pages/user/vip">
						<view class="bk-huiyuan fz25" style="color: #6181E8;"></view>
						<view>特权会员</view>
					</baker-logins>
				</view>
			</view>
			
			<view class="mb10 bt bb">
				
				<baker-logins :href="history">
					<view class="flex whiteBg pl">
						<view class="w30 ptb">
							<view class="bk-time fz18 mr10 "></view>
						</view>
									
						<view class="cover ptb bb pr">
							<view class="flex">
								<view>阅读历史</view>
								<view class="bIcon-arrowRight fz12 gray"></view>
							</view>
						</view>
					</view>
				</baker-logins>
				
				<baker-logins href="/uni_modules/baker-app/pages/user/withdrawal">
					<view class="whiteBg pl flex">
						<view class="w30 ptb">
							<view class="bk-tixian fz18 mr10 "></view>
						</view>
								
						<view class="cover ptb  pr">
							<view class="flex">
								<view>金币提现</view>
								<view class="bIcon-arrowRight fz12 gray"></view>
							</view>
						</view>
					</view>
				</baker-logins>
				
				<baker-logins href="/uni_modules/baker-app/pages/user/welfare">
					<view class="pl whiteBg flex">
						<view class="w30 ptb">
							<view class="bk-fuli fz18 mr10 "></view>
						</view>
						<view class="cover ptb pr bt">
							<view class="flex">
								<view>福利中心</view>
								<view class="bIcon-arrowRight fz12 gray"></view>
							</view>
						</view>
					</view>
				</baker-logins>
				
			</view>
			
			
			<!-- <navigator url="../user/myComment" class="whiteBg pl flex bb">
				<view class="w30 ptb">
					<view class="bk-pinglun fz18 mr10 "></view>
				</view>
				<view class="cover ptb  pr">
					<view class="flex">
						<view>我的评论</view>
						<view class="bIcon-arrowRight fz12 gray"></view>
					</view>
				</view>
			</navigator> -->
			
			<view class="mb10 bt bb">
				
				<view class="whiteBg pl">
					<view class="ptb pr bb">
						<view class="flex">
							<view>关于{{appName}}</view>
							<view class="flex rt">
								<base-version-update color="#FED22E" class="pr10 grey" ref="version" :cache="false" :showVersion="true" :autoShow="false"></base-version-update>
								<view class="bIcon-arrowRight fz12 gray"></view>
							</view>
						</view>
					</view>
				</view>
				
				<navigator url="/uni_modules/baker-app/pages/user/agreement" class="whiteBg pl">
					<view class="ptb pr bb">
						<view class="flex">
							<view>用户协议</view>
							<view class="bIcon-arrowRight fz12 gray"></view>
						</view>
					</view>
				</navigator>
				
				<navigator url="/uni_modules/baker-app/pages/user/privacy" class="whiteBg pl">
					<view class="ptb pr bb">
						<view class="flex">
							<view>隐私政策</view>
							<view class="bIcon-arrowRight fz12 gray"></view>
						</view>
					</view>
				</navigator>
				
				<navigator url="/uni_modules/baker-app/pages/user/feedback" class="whiteBg pl">
					<view class="ptb pr">
						<view class="flex">
							<view>帮助与反馈</view>
							<view class="bIcon-arrowRight fz12 gray"></view>
						</view>
					</view>
				</navigator>
				
			</view>
			
			
		</baker-user-data>
			
		
	</view>
</template>

<script>
	export default {
		name:"baker-user-center",
		props:{
			history:{
				type : String ,
				default :"/uni_modules/baker-app/pages/user/history"
			},
			share:{
				type : String ,
				default :"/uni_modules/baker-app/pages/user/share"
			}
		},
		data(){
			return {
				appName : process.env.VUE_APP_NAME
			}
		},
		methods:{
			refresh(){
				this.$refs.userData && this.$refs.userData.refresh();
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f1f1f1;
	}
</style>