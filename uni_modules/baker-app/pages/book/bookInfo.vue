<template>
	<view class="father">
		
		<b-data url="baker/api/book/info" :params="{preview:true}" :page-params="true" :cache="true" @load="onDataLoad">
			<b-empty :is-show="!hasData" tips="抱歉，暂无书籍信息">
				<view class="pd flex ct">
					<b-btn href="/uni_modules/baker-app/pages/index/index" open-type="switchTab" radius="23">去首页看看</b-btn>
				</view>
			</b-empty>
			
			<block v-if="hasData">
				
				<baker-trans-title back-url="/uni_modules/baker-app/pages/index/index" open-type="switchTab">{{data.name}}</baker-trans-title>
				
				<view class="w100p abs top">
					<image :src="data.cover" class="block w100p" mode="widthFix"></image>
					<view class="abs wper"></view>
				</view>
				
				
				<view class="white" style="position: relative;z-index: 1;padding-top: 300px;">
					<view class=' plr'>
						<view class="fz30">{{data.name}}</view>
						
						<view class="flex">
							<view>
								<view class="mtb5" style="color: #BCC3CB;">
									{{data.categoryName}}  ·  {{data.author}}著
								</view>
								<view class="flex lt " style="color: #BCC3CB;">
									<baker-finished :finished="data.finished"></baker-finished>
									<baker-words class="ml10 white" :words="data.words"></baker-words>
								</view>
							</view>
							<baker-rate :score="data.score" :showScore="true"></baker-rate>
						</view>
						
					
						<view class="rds10 pd mtb10" style="background-color: #1B2838;">
							<view style="color: #BABDC2;">
								<baker-content :content="data.intro" :showGutter="false"></baker-content>
							</view>
						</view>
						
						
						
						<view @tap="$refs.chapterList.toggle();" class="rds10 pd mtb10 flex ct" style="background-color: #1B2838;">
							<view class="flex lt">
								<text class="bIcon-listFill mr5"></text>
								目录
							</view>
							<view class="cover flex fz12 text-right ml5" style="color: #BCC3CB;">
								<view class="ml5">
									{{data.finished ? "已完结" : "连载中"}}
									更新至第{{data.totalChapters}}章
								</view>
								<view>
									<b-time class="inline" :date="data.lastUpdateTime" differ="month"></b-time>
									更新
								</view>
							</view>
							<view class="pl10 fz12 bIcon-arrowRight" style="color: #BCC3CB;"></view>
						</view>
						
						
						<!-- 角色 -->
						<!-- <baker-role></baker-role> -->
						
						
						<!-- <view class="mb pt20 fz16">精彩评论</view>
						<baker-comments></baker-comments> -->
						
					</view>
					
					<view class="whiteBg plr">
						<view class="pd7 fz12 rdsB5 white inline" style="background-image: linear-gradient(#6571BB,#3C4678)">章节试读</view>
						<view class="pt20 fz17">{{chapter.title}}</view>
						<view class="pt10 pb father" style="text-indent: 20px;text-align: justify;line-height: 22px;">
							<baker-content :content="chapter.content" :showGutter="true"></baker-content>
						</view>
					</view>
				</view>
				
				<baker-fix-bottom v-if="!!data._id">
					
					<view class="flex plr ptb10 bt">
						
						<baker-logins url="baker/user/history/addShelf" :params="{ bookId:data._id }" @success="changeShelf">
							<view class="text-center" :class="data.addShelf ? 'gray op7' :''" >
								<view class="bk-wodeshujia fz20 lh1"></view>
								<view class="fz12">
									{{data.addShelf ? "已在书架" : "加入书架"}}
								</view>
							</view>
						</baker-logins>
						
						<baker-chapter href="/uni_modules/baker-app/pages/book/chapterInfo" :bookId="data._id" :chapterNumber="chapter.chapterNumber">
							<b-btn radius="23" min-width="104">
								立即阅读
							</b-btn>
						</baker-chapter>
						
					</view>
					
				</baker-fix-bottom>
				
				
				
			</block>
		</b-data>
		
		
		<!-- 章节目录 -->
		<baker-catalogue ref="chapterList" 
			url="baker/api/chapter/catalogue" href="/uni_modules/baker-app/pages/book/chapterInfo" :bookId="data._id" :bookInfo="data" openType="navigateTo" top="20rpx" bottom="20rpx" :show-book="false"></baker-catalogue>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data : {} ,
				chapter : {} 
			}
		},
		computed: {
			hasData() {
				return null != this.data ;
			}
		},
		onReady() {
			// this.baker.fullscreen(true);
		},
		onUnload() {
			// this.baker.fullscreen(false);
		},
		onPageScroll({scrollTop}) {
			// #ifdef APP-PLUS
			// if (scrollTop > 100) {
			// 	this.baker.fullscreen(false);
			// }else{
			// 	this.baker.fullscreen(true);
			// }
			// #endif
		},
		methods: {
			async onDataLoad({data,chapter}){
				this.data = data ;
				this.chapter = chapter ;
				if (this.data) {
					uni.setNavigationBarTitle({
						title: this.data.name
					})
				}
			},
			changeShelf(){
				this.$set( this.data , 'addShelf' , !this.data.addShelf);
			}
		}
	}
</script>

<style lang="scss">
	.wper {
		background-image: linear-gradient(rgba(#1E2F41, 0.1) 0%,
			rgba(#1E2F41, 0.8) 90%,
			rgba(#1E2F41, 0.9) 95%,
			rgba(#1E2F41, 1) 100%)
	}
	page {
		background-color: #1E2F41;
	}
</style>

