<template>
	<view class="hidden plr text-justify father" :style="boxStyle">
		<!-- 章节内容 -->
		<view id="chapter" :style="chapterStyle">
			<!-- 标题 -->
			<view :style="titleStyle">
				{{title}}
			</view>
			<!-- 内容 -->
			<view class="paragraph" v-for="(item,index) in contents" :key="index">
				{{ item }}
			</view>
		</view>
		
		<!-- 自动翻页指示器 -->
		<block v-if="auto">
			<baker-auto-timer v-if="isFirst" key="first" @change="$emit('switchNext');"></baker-auto-timer>
			<baker-auto-timer v-else key="seconed" @change="$emit('switchNext');"></baker-auto-timer>
		</block>
		
	</view>
</template>

<script>
	import { reader } from "../../js_sdk/encrypt/baker-reader-content";
	export default {
		name: "baker-content",
		props: {
			auto : Boolean ,
			pageHeight: {
				type : [Number,String] ,
				default : "auto"
			},
			lineHeight: {
				type: Number,
				default: 1.8
			},
			fontSize: {
				type: Number,
				default: 16
			},
			title: String,
			content: String ,
			pageIndex :  {
				type: Number,
				default: 0
			}
		},
		created() {
			uni.$on("bakerSwitchChapterPage" , () => {
				this.isFirst = !this.isFirst ;
			})
		},
		computed: {
			boxStyle(){
				return uni.$b.getStyle({
					height : this.pageHeight + 'px' 
				});
			},
			chapterStyle(){
				let transY = - this.pageIndex * this.pageHeight ;
				return uni.$b.getStyle({
					transform : `translateY(${transY}px)`
				});
			},
			titleStyle() {
				return uni.$b.getStyle({
					"font-size": `${this.fontSize * 1.5}px`,
					"line-height": `${this.lineHeight * 2}px`,
					"text-indent": `0px`
				});
			},
			contents() {
				return reader.getContents(this.content);
			}
		},
		data() {
			return {
				isFirst : true 
			}
		}
	}
</script>
