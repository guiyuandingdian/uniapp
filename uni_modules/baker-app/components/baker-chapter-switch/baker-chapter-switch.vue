<template>
	<view>
		<view class="flex">
			<view @tap="switchChapter(chapterNumber - 1)" :class="{disabled : chapterNumber <= 1}">上一{{unit}}</view>
			<view class="cover plr">
				<b-slider
					:range="false"
					:showTooltip="false"
					:step="1"
					:min="1"
					:max="totalChapters"
					:value="chapterNumber"
					:size="18"
					active-color="#FEA00A"
					background-color="#BABABA"
					 @change="changeChapter"
					 @changing="changing"></b-slider>
				
			</view>
			<view @tap="switchChapter(chapterNumber + 1 )" :class="{disabled : chapterNumber >= totalChapters}">下一{{unit}}</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description  切换章节
	 * @property {Number} totalChapters 总章节数 
	 * @property {Number} chapterNumber 当前章节数
	 * @event {Function} change  
	 */
	export default {
		name:"baker-chapter-switch",
		props:{
			totalChapters : Number ,
			chapterNumber : {
				type : Number ,
				default : 1
			},
			unit:{
				type : String ,
				default : "章"
			}
		},
		methods:{
			changing(e){
				uni.$b.showToast(`第${e.detail.value}${this.unit}`);
			},
			changeChapter(e){
				let chapterNumber = e.detail.value ;
				this.switchChapter(chapterNumber);
			},
			switchChapter(chapterNumber){
				if (chapterNumber < 1 || chapterNumber > this.totalChapters || chapterNumber == this.chapterNumber) {
					return ;
				}
				this.$emit("change" , chapterNumber);
			},
		}
	}
</script>
