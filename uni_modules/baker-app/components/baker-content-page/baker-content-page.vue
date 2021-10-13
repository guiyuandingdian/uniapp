<template>
	<view class="text-justify father" :style="{height : pageHeightPx}">
		
		<!-- 前一章 -->
		<baker-content ref="preChapter" class="abs op0"
			:title="preChapter.title" 
			:content="preChapter.content"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="_lineHeight"
			:key="preChapter._id"></baker-content>
		
		<!-- 当前章节 -->
		<baker-content ref="curChapter" class="abs op0"
			:title="curChapter.title" 
			:content="curChapter.content"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="_lineHeight"
			:key="curChapter._id"></baker-content>
		
		<!-- 下一章节 -->
		<baker-content ref="nextChapter" class="abs op0"
			:title="nextChapter.title" 
			:content="nextChapter.content"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="_lineHeight"
			:key="nextChapter._id"></baker-content>
		
		
		
		
		
		<swiper :style="swiperStyle" 
			:indicator-dots="false" 
			:duration="duration" 
			:current="currentIndex" 
			@change="_onChangePage" 
			@transition="_onTransition">
			
			<swiper-item v-for="( item  , index) in pageAdData" :key="item.sid" >
				
				<view :style="{height : pageHeightPx}" class="hidden father">
					
					
					<!-- 广告 -->
					<view v-if="item.type == 'ad'" class="h100p">
						<view class="h70p"></view>
						
						<view class="h30p flex ct fz18 pt20">
							滑动可继续阅读
						</view>
					</view>
					
					<!-- 章节内容 -->
					<view v-else :id="item.sid" :style="{'transform' : `translateY(-${item.offset}px)`}" class="plr">
						
						<block v-for="(content,cIndex) in item.paragraphs" :key="cIndex">
							
							<!-- 第一页 第一段落 渲染标题 -->
							<view  v-if="item.pageIndex == 0 && cIndex == 0" class="paragraph" :style="titleStyle">
								{{item.totalHeight}}
								{{content}}
							</view>
							
							<!-- 渲染当前页的段落 -->
							<view v-else class="paragraph">
								{{ content }}
							</view>
							
							<!-- 占位 -->
							<view :style="{height : _lineHeight + 'px'}"></view>
							
						</block>
					
					</view>
					
					
					<!-- 工具栏区域 -->
					<view @tap="_switchPage(currentIndex - 1)" class="abs left w50p"></view>
					<view @tap="_switchPage(currentIndex + 1)" class="abs right w50p"></view>
					<view @tap="$emit('tapCenter')" class="abs center w200 h80p"></view>
					
					
					<!-- 自动翻页指示器 -->
					<baker-auto-timer 
						v-if="index == currentIndex && auto"
						:key="item.sid" 
						@change="_switchPage(currentIndex + 1)"></baker-auto-timer>
					
				</view>
				
			</swiper-item>
			
		</swiper>
		
		<view v-if="isAdPage" class="abs top pt20 plr" :class="adLoad ? 'h70p' : 'h100p'">
			<view class="grayBg">
				<baker-ad :debug="true" @onAdReward="onAdReward" @load="adLoad = true;"></baker-ad>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @property {Number} totalHeight 可用总高度
	 */
	import contentPageMixins from "./baker-content-page.js" ;
	export default {
		name: "baker-content-page",
		mixins: [contentPageMixins],
		data(){
			return {
				// #ifdef H5
				adLoad : true ,
				// #endif
				// #ifndef H5
				adLoad : false 
				// #endif
			}
		}
	}
</script>

