<template>
	<view>
		
		<baker-fix-top ref="topBar" bgClass="bg">
			
			<view class="flex cv">
				
				<!-- #ifdef MP-WEIXIN -->
				<navigator url="/uni_modules/baker-app/pages/book/search" class="bIcon-searchFill fz17 plr flex ct" hover-class="op8"></navigator>
				<!-- #endif -->
				
				<view class="cover">
					<baker-home-channels :value="channel" @change="onChannelChange" @load="$refs.topBar && $refs.topBar.queryRect();"></baker-home-channels>
				</view>
				
				<!-- #ifdef APP-PLUS || H5 -->
				<navigator url="/uni_modules/baker-app/pages/book/search" class="bIcon-searchFill fz17 plr flex ct" hover-class="op8"></navigator>
				<!-- #endif -->
			</view>
			
		</baker-fix-top>
		
		<view class="pt plr bg">
			<b-banner ref="banner" url="base-banner/api/list" :params="{scene : channel}" :loading="{show:false}" 
				mode="remote" type="big" height="240rpx" class="rdsT7 hidden"  img-mode="aspectFill"></b-banner>
		</view>
		
		<baker-choose-channel ref="chooseChannel" @init="channel = $event;">
			
			<view v-if="channel != -1" class="ptb">
				
				<view class="plr">
					
					<view class="gridSm g2">
						<view class="item">
							<navigator url="/uni_modules/baker-app/pages/category/category" open-type="switchTab">
								<view class="flex pd10 rds5" style="background-color: #EDEEFF;">
									<view class="cover">
										<view class="fz16 bold">分类</view>
										<view class="fz12" style="color:#6F7492;">古言·现言</view>
									</view>
									<b-image src="/uni_modules/baker-app/static/novel.png" mode="aspectFill" width="50" height="60"></b-image>
								</view>
							</navigator>
						</view>
						<view class="item">
							<baker-switch-tab url="/uni_modules/baker-app/pages/category/category" :params="{navIndex:1}">
								<view class="flex pd10 rds5" style="background-color: #FFEBEC;">
									<view class="cover">
										<view class="fz16 bold">排行榜</view>
										<view class="fz12" style="color:#896362;">热门·好书</view>
									</view>
									<b-image src="/uni_modules/baker-app/static/novelPic.png" mode="aspectFill" width="50" height="60"></b-image>
								</view>
							</baker-switch-tab>
						</view>
					</view>
					
					<view class="gridSm g3">
						<view class="item">
							<baker-logins href="/uni_modules/baker-app/pages/user/welfare">
								<view class="pd10 rds5 hidden father" style="background-color: #FBF7EC;">
									<view class="bIcon-starFill abs top right bgIcon"></view>
									<view class="father z1">
										<view class="fz16 bold">签到</view>
										<view class="fz12" style="color:#928370;">签到天天领金币</view>
									</view>
								</view>
							</baker-logins>
						</view>
						<view class="item">
							<baker-logins href="/uni_modules/baker-app/pages/user/luckyDraw">
								<view class="pd10 rds5 father hidden" style="background-color: #FBF7EC;">
									<view class="bk-choujiang abs top right bgIcon"></view>
									<view class="father z1">
										<view class="fz16 bold">抽奖</view>
										<view class="fz12 " style="color:#928370;">小手快来抖一抖</view>
									</view>
								</view>
							</baker-logins>
						</view>
						<view class="item">
							<baker-logins href="/uni_modules/baker-app/pages/user/welfare">
								<view class="pd10 rds5 father hidden" style="background-color: #FBF7EC;">
									<view class="bk-liwu abs top right bgIcon"></view>
									<view class="father z1">
										<view class="fz16 bold">福利</view>
										<view class="fz12" style="color:#928370;">边看边玩赚金币</view>
									</view>
								</view>
							</baker-logins>
						</view>
					</view>
					
				</view>
				
				<b-page ref="page" url="baker/api/recommend/page" :params="{channel}" :cache="true" :page-size="2" v-slot:default="{list}" :show-empty="false">
					
					<block v-for="(item,index) in list" :key="item._id">
						
						<view class="pt7 grayBg mt5" v-if="index > 0"></view>
						
						<view class="plr">
							
							<!-- 标题 -->
							<baker-recommend-title :data="item" url="baker/api/recommend/bookPage"></baker-recommend-title>
							
							<block v-if="item.theme == 1">
								
								<view class="gridSm g3">
									
									<view class="item" v-for="(book,bindex) in item.books" :key="bindex">
										<baker-books :data="book" :showCategory="true" :showRate="false"></baker-books>
									</view>
									
								</view>
								
							</block>
							<block v-else-if="item.theme == 2">
								<baker-books-block :data="book" v-for="( book , bindex) in item.books" :key="book._id"></baker-books-block>
							</block>
							<block v-else-if="item.theme == 3">
								<view class="gridSm g4">
									
									<view class="item" v-for="(book,bindex) in item.books" :key="bindex">
										<baker-books :data="book" :showCategory="false" :showRate="true"></baker-books>
									</view>
									
								</view>
							</block>
							<block v-else-if="item.theme == 4">
								<baker-books-theme-4 :data="item"></baker-books-theme-4>
							</block>
							
						</view>
						
					</block>
					
				</b-page>
				 
			</view>
			
			<base-version-update color="#FED22E" ref="version" :showVersion="false" :autoShow="true"></base-version-update>
			
		</baker-choose-channel>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				channel : -1
			}
		},
		
		// #ifndef H5
		onReady() {
			//设置邀请码
			this.$refs.chooseChannel.setInviteCode();
		},
		// #endif
		methods: {
			onChannelChange(e){
				this.channel = e.detail.value ;
				uni.setStorageSync("home_channel" , this.channel);
				this.$nextTick(()=>{
					this.$refs.page.refresh();
					this.$refs.banner.loadData();
				});
			}
		}
	}
</script>
<style>
	.bgIcon{
		font-size: 180rpx;
		color: #f7f1e4;
		right: -30px;
	}
</style>