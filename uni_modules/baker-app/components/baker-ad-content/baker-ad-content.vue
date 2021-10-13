<template>
	<view>
		
		<!-- 广告贴片 -->
		<view class="pd20" v-if="showAd && isShowAd">
			
			<view class="father">
				<view :class="{'none' : isAdPage}" class="abs top pd ti0 whiteBg">
					<view class="h170 grayBg flex ct">
						<b-loading></b-loading>
					</view>
					<view class="mt10 fz20 op0">千亿总裁意外获得六个奶娃，从此开始了奶爸生涯~</view>
					<view class="gray pt fz16 op0">人前千亿总裁，人后全能奶爸</view>
				</view>
				<baker-ad v-if="isAdPage"></baker-ad>
			</view>
			
			<view class="abs bottom pb100 flex ct fz18 op7 ti0">
				滑动可继续阅读
			</view>
			
		</view>
		
		<baker-content v-else
			:title="chapterPage.title" 
			:content="chapterPage.content"
			:pageIndex="chapterPage.pageIndex"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="lineHeight"
			:auto="auto"
			@switchNext="$emit('switchNext')"></baker-content>

	</view>
</template>

<script>
	import {store} from "../../js_sdk/baker-reward-ad.js" ;
	export default {
		name:"baker-ad-content",
		props:{
			auto : Boolean ,
			activeKey : String ,
			curKey : String ,
			showAd : Boolean ,
			pageHeight : Number ,
			fontSize : Number ,
			lineHeight : Number ,
			chapterPage:{
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
		computed:{
			bannerAdpid(){
				return store.state.bannerAdpid ;
			},
			isShowAd(){
				return store.getters.showAd && !!this.bannerAdpid ;
			},
			isAdPage(){
				return this.activeKey == this.chapterPage.key ;
			}
		}
	}
</script>