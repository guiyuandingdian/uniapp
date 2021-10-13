<template>
	<view class="hidden plr text-justify father" :style="boxStyle">
		<!-- 章节内容 -->
		<view id="chapter" v-if="show">
			<!-- 标题 -->
			<view :style="titleStyle">
				{{data.title}}
			</view>
			<!-- 内容 -->
			<view class="paragraph" v-for="(item,index) in data.contents" :key="index">
				{{ item }}
			</view>
		</view>
		
	</view>
</template>

<script>
	export {default} from "../../js_sdk/encrypt/baker-reader-measure.js" ;
</script>
