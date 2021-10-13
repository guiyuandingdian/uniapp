<template>
	<view>
		
		<!-- 顶部区域 -->
		<view class="flex plr darkBg">
			
			<!-- #ifdef APP-PLUS || H5 -->
			<baker-back-shelf :bookId="bookId" :chapterNumber="chapterNumber" :add="add" :bookInfoUrl="bookInfoUrl" :url="addShelfUrl">
				<view class="flex lt">
					<view class="bIcon-arrowLeft mr10"></view>
					<view>返回</view>
				</view>
			</baker-back-shelf>
			<!-- #endif -->
			
			<view class="cover">
				<view class="flex rt fz12">
					
					<!-- '$refs.reward.toggle()' -->
					<!-- <view @tap='devTip();' class="text-center ptb7 plr10 disabled" hover-class="op8">
						<view class="bk-fuli fz18 lh1"></view>
						<view>打赏</view>
					</view> -->
					
					<!-- <view @tap='devTip();' class="text-center  ptb7 plr10 disabled" hover-class="op8">
						<view class="father">
							<view class="bIcon-comment fz18 lh1"></view>
							<view style="background-color: #343436;top:-5px;right:-3px" class="abs right fz12 h15">456</view>
						</view>
						<view>书评</view>
					</view> -->
					
					<slot></slot>
					
					
					<baker-no-ad @onAdReward="onAdEnd" @onAdShow="onAdShow" @cancel="onAdCancel" :debug="true">
						<view class="text-center ptb7 plr10" hover-class="op8">
							<view class="bIcon-player fz18 lh1"></view>
							<view>免广告</view>
						</view>
					</baker-no-ad>
					
					<b-navigator :url="bookInfoUrl" :params="{_id:bookId}" :openType="openType" class="text-center ptb7 plr10" hover-class="op8">
						<view class="bk-wp-sj-2 fz18 lh1"></view>
						<view>详情</view>
					</b-navigator>
					
					<!-- <view class="text-center ptb7 pl10">
					
						<b-popover ref="popover" ptb="7" offset="2" trigger="click" placement="bottomRight" bg-color="#343436" border-color="#343436">
							<view hover-class="op8">
								<view class="bk-gengduo fz18 lh1"></view>
								<view type="text">更多</view>
							</view>
							<view slot="content" class="noBreak fz14">
								
								<view @tap='devTip();' class="flex lt text-center ptb7 disabled">
									<view class="bk-shuqian mr10"></view>
									<view>添加书签</view>
								</view>
								
								<b-navigator url="/uni_modules/baker-app/pages/book/bookInfo" :params="{_id:bookId}" openType="redirectTo" class="flex lt text-center ptb7">
									<view class="bk-wp-sj-2 mr10"></view>
									<view>书籍详情</view>
								</b-navigator>
								
								
								<baker-no-ad @onAdReward="onAdEnd" @onAdShow="onAdShow" @cancel="onAdCancel" :debug="true">
									<view class="flex lt text-center ptb7">
										<view class="bIcon-player mr10"></view>
										<view>看视频去广告</view>
									</view>
								</baker-no-ad>
								
								
								<view @tap='devTip();' class="flex lt text-center ptb7 disabled">
									<view class="bk-VIP mr10"></view>
									<view>VIP免广告</view>
								</view>
					
								<view @tap='devTip();' class="flex lt ptb7 text-center disabled">
									<view class="bk-chakantiezigengduojubao mr10"></view>
									<view>举报</view>
								</view>
							</view>
						</b-popover>
					
					
					</view> -->
					
				</view>
			</view>
		</view>
		
		
		<!-- 打赏 -->
		<!-- <baker-reward ref="reward" :zIndex="20"></baker-reward> -->
		
	</view>
	
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	export default {
		name:"baker-chapter-header",
		props:{
			addShelfUrl : {
				type : String ,
				default: "baker/user/history/addShelf"
			},
			bookInfoUrl:{
				type : String ,
				default : "/uni_modules/baker-app/pages/book/bookInfo"
			},
			bookId : {
				type : Number,
				required: true
			},
			chapterNumber : {
				type : Number,
				required: true
			},
			//是否已加入书架
			add : Boolean
		},
		
		computed: {
			openType() {
				let pages = getCurrentPages();
				if (pages.length < 2) {
					return "redirectTo" ;
				}
				let bookInfoPage = pages[pages.length-2];
				return bookInfoPage.route == "uni_modules/baker-app/pages/book/bookInfo" ? "navigateBack" : "redirectTo" ; 
			}
		},
		
		methods:{
			async onAdEnd(){
				this.$emit("onAdChange" , true );
			},
			
			onAdCancel(){
				this.$emit("onAdChange" , false);
			},
			
			onAdShow(){
				this.hidePopover();
				this.$emit("onAdShow");
			},
			
			hidePopover(){
				this.$refs.popover && this.$refs.popover.hide();
			}
		}
	}
</script>
