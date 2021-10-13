<template>
	<view class="fixed" :style="baseStyle" :time="renderTime">
		
		<!-- 测量器 -->
		<view class="abs" style="transform: translateX(-100%);">
			
			<baker-reader-measure ref="measure" v-for="( item , index) in 3" :key="index"
				:pageHeight="pageHeight"
				:fontSize="fontSize"
				:lineHeight="_lineHeight"/>
			
		</view>
		

		<view class="abs pt45s" v-for="( item , index) in renderPages" :key="item.key"
			:class="item.class" 
			:style="item.style"
			 @touchstart="ontouchStart"
			 @touchmove="onTouchMove"
			 @touchend="onTouchEnd">


			 <baker-ad-content
			 	:showAd="item.isAd"
				:activeKey="activeKey"
			 	:chapterPage="item"
			 	:pageHeight="pageHeight"
			 	:fontSize="fontSize"
			 	:lineHeight="_lineHeight"
			 	:auto="auto"
				:key="item.key"
			 	@switchNext="switchNextPage();"/>


		</view>
	
	
	</view>
</template>

<script>
	export {default} from "../../js_sdk/encrypt/baker-reader.js" ;
</script>

<style>
	.shadowRight{
		box-shadow: 4px 0px 8px 1px rgba(0,0,0,0.3);
	}
	.pt45s{
		/* #ifdef APP-PLUS || H5 */
		padding-top: 45px;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 0;
		/* #endif */
	}
</style>
