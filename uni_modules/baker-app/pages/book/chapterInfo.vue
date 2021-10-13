<template>
	<view class="hh" :class="_themeClass">
		
		<!-- 顶部操作栏 -->
		<view class="fixed z20 top">
			<b-animate :value="showTools" in-class="fadeInDownSm" out-class="fadeOutUpSm">
				<view class="darkBg">
					<!-- #ifdef APP-PLUS -->
					<view class="statusBar"></view>
					<!-- #endif -->
					<baker-chapter-header
						:bookId="bookId"
						:add="bookInfo.addShelf"
						:chapterNumber="chapterNumber"
						@onAdChange="toggleTools()"></baker-chapter-header>
				</view>
			</b-animate>
		</view>
		
		
		<view class="father">
			
			<!-- #ifdef APP-PLUS || H5 -->
			<view class="holder fz12 father z10 fixed top flex op6 plr" style="height: 45px;">
				
				<!-- 顶部快捷操作区域 书籍名称 -->
				<baker-back-shelf class="cover clip c1" :bookId="bookId" :chapterNumber="chapterNumber" :add="bookInfo.addShelf">
					<text class="bIcon-arrowLeft mr5"></text>
					{{title}}
				</baker-back-shelf>
				
				<view @tap="toggleTools" class="pl flex rt">
					
					<baker-read-time ref="readTime"></baker-read-time>
					
					<view class="ptb1 plr8 rds20 bd themeBorder">
						<text class="bIcon-listFill mr5"></text> 菜单
					</view>
				</view>
				
			</view>
			<view style="height: 45px;"></view>
			<!-- #endif -->
			
			<!-- #ifdef MP -->
			<view class="none">
				<baker-read-time ref="readTime"></baker-read-time>
			</view>
			<!-- #endif -->
			
			
			
			
			<!-- 章节内容 -->
			<baker-reader ref="reader"
				:fontSize="fontSize"
				:lineHeight="lineHeight"
				:totalHeight="totalHeight"
				:auto="autoPage"
				:mode="slideType"
				:adPages="7"
				:totalChapters="bookInfo.totalChapters" 
				:themeClass="_themeClass"
				@switchChapter="onSwitchChapter"
				@switchPage="onPageChange"
				@tapCenter="toggleTools"
				@inited="onPageInit"/>
			
			
			
			<!-- 底部广告位占位 -->
			<view class="holder fz12 father z10 fixed bottom">
				<view class="flex plr op6" style="height: 28px;">
					
					<!-- #ifdef APP-PLUS -->
					<!-- 电量、系统时间 -->
					<view class="flex lt w55">
						<baker-battery class="mr3" :themeClass="_themeClass"></baker-battery>
						<baker-system-time></baker-system-time>
					</view>
					
					<!-- 提示语 -->
					<view class="cover text-center">
						{{tips}}
					</view>
					<!-- #endif -->
					
					
					<!-- #ifdef MP-WEIXIN || H5 -->
					<view class="cover">
						{{tips}}
					</view>
					<!-- #endif -->
					
					
					<!-- 阅读进度 -->
					<view class="w55 text-right" v-if="percent">{{percent}}%</view>
				</view>
				
				<!-- 广告位置 -->
				<!-- <view v-if="showAd" class="h50 father adBg flex ct">
					<view class="fz18 op2">贝壳阅读 书中有座黄金屋</view>
					<baker-ad v-if="!showTools && !showDeepTools&& !showAutoTools" class="abs"></baker-ad>
				</view> -->
				
			</view>
			
			
			<!-- 底部操作区域 -->
			<baker-fix-bottom :holder="false" bgClass=" ">
				<b-animate :value="showTools" in-class="fadeInUpSm" out-class="fadeOutDownSm">
					<view class="plr ptb30 darkBg">
						
						<!-- 章节切换 -->
						<baker-chapter-switch 
							:chapterNumber="chapterNumber" 
							:totalChapters="bookInfo.totalChapters" 
							@change="switchChapter"></baker-chapter-switch>
						

						<view class="flex">
							
							<!-- 目录 -->
							<view @tap="showCatalogue" class="text-center">
								<view class="bk-mulu"></view>
								<view class="fz12">目录</view>
							</view>
							
							<!-- 夜间模式 -->
							<view class="text-center">
								<baker-night v-model="isNight"></baker-night>
							</view>
							
							<!-- 自动翻页 -->
							<view class="text-center">
								<baker-auto-page v-model="autoPage" @input="showTools=false;"></baker-auto-page>
							</view>
							
							<!-- 阅读设置 -->
							<view @tap="showTools=false;showDeepTools=true;" class="text-center">
								<view class="bk-shezhi1"></view>
								<view class="fz12">阅读设置</view>
							</view>
								
						</view>
					</view>
				</b-animate>
			</baker-fix-bottom>
			
			
			<!-- 章节目录 -->
			<baker-catalogue ref="chapterList" url="baker/api/chapter/catalogue" :bookId="bookId" :bookInfo="bookInfo" @choose="switchChapter($event.chapterNumber)"></baker-catalogue>
			
			
			<!-- 二级工具栏 -->
			<baker-fix-bottom :holder="false" bgClass="noBg">
				<b-animate :value="showDeepTools" in-class="fadeInUpSm" out-class="fadeOutDownSm">
					<view class="pd darkBg">
						<view class="flex lt mb">
							<view class="w50">字号</view>
							<view class="cover">
								<baker-font-size v-model="fontSize"></baker-font-size>
							</view>
						</view>
						<view class="flex mb">
							<view class="w50">背景</view>
							<view class="cover">
								<baker-theme v-model="themeClass" @input="isNight=false;"></baker-theme>
							</view>
						</view>
								
						<view class="flex">
							<view class="w50">间距</view>
							<view class="cover">
								<baker-line-height v-model="lineHeight"></baker-line-height>
							</view>
						</view>
								
						<!-- <view class="flex">
							<view class="w50">翻页</view>
							<view class="cover">
								<baker-page-slider v-model="slideType"></baker-page-slider>
							</view>
						</view> -->
						
					</view>
				</b-animate>
			</baker-fix-bottom>
			
			
			<!-- 自动翻页速度控制面板 -->
			<baker-fix-bottom :holder="false" bgClass="noBg">
				<b-animate :value="showAutoTools" in-class="fadeInUpSm" out-class="fadeOutDownSm">
					<view class="darkBg">
						<view class="flex lt pd ptb20">
							<view class="w50">速度</view>
							<view class="cover">
								<baker-auto-page-speed v-model="speed"></baker-auto-page-speed>
							</view>
						</view>
						<view @tap="exitAutoPage" hover-class="op7" class="flex ct ptb bt" style="border-color: #3e3e3e;">
							<view class="bk-tuichu mr10"></view>
							退出自动翻页
						</view>
					</view>
				</b-animate>
			</baker-fix-bottom>
			
			
			<!-- 加入书架 -->
			<view v-if="!bookInfo.addShelf" class="fixed z15 right top mt100">
				<baker-logins 
					url="baker/user/history/addShelf" 
					:params="{ bookId }" 
					@success="addShelfSuccess"
					@showLoginPanel="toggleTools();">
					
					<b-animate :value="showAutoTools || showTools || showDeepTools" in-class="fadeInRightSm" out-class="fadeOutRightSm">
						<view class="darkBg rdsL23 plr ptb5">
							加入书架
						</view>
					</b-animate>
					
				</baker-logins>
			</view>
			
		
		</view>
		
		
		<!-- 进入VIP购买页 -->
		<baker-logins ref="vip" href="/uni_modules/baker-app/pages/user/vip"></baker-logins>
		
		
	</view>
</template>

<script>
	export {default} from "./js/chapterInfo" ;
</script>