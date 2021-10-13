<template>
	<view>
		<b-drawer ref="drawer"
			drawer-class="bookBg"
			body-class="bookBg" 
			header-class="bookBg"
			footer-class="bookBg pd"
			placement="left"
			width="70%"
			z-index="25"
			:show-cancel="false"
			:show-confirm="false"
			:destory-on-hide="true"
			@beforeShow="inited = true;">
			
			<view slot="header" class="plr bookBg brown" :style="{'padding-top' : top }">
				
				<view class="flex pb5" v-if="showBook">
					<view class="flex">
						<baker-cover :src="bookInfo.cover" width="40"></baker-cover>
						<view class="cover pl10">
							<view class="fz16 bold">{{bookInfo.name}}</view>
							<view class="fz12 mt10 lightBrown">{{bookInfo.author}}</view>
						</view>
					</view>
					<view class="bIcon-arrowRight"></view>
				</view>
				
				<view class="flex fz12 bookBg">
					<view @tap="chooseChapter(bookInfo.totalChapters)" class="lightBrown cover clip c1">更新至{{bookInfo.lastChapterTitle}}</view>
					<view @tap="isDesc=!isDesc;$refs.page.refresh();" class="pl20">
						<text :class="isDesc ? 'bk-daoxu':'bk-shijianzhengxu'"></text>
						{{isDesc ? '正序' : '倒序'}}
					</view>
				</view>
			</view>
			
			<scroll-view v-if="inited" class="pt10 h100p" :scroll-y="true" @scrolltolower="$refs.page.getMore();" :style="{'padding-bottom' : bottom}">
				<b-page ref="page" :url="url" :params="{bookId,isDesc}" :cache="false" :autoGetMore="false" v-slot:default="{list}" :page-size="60">
					<view @tap="chooseChapter(item.chapterNumber);" class="ptb7 plr" v-for="(item,index) in list" :key="index">
						<view class="clip c1 cover">{{item.title}}</view>
					</view>
				</b-page>
			</scroll-view>
			
		</b-drawer>
	</view>
</template>

<script>
	/**
	 * @property {Number} bookId 
	 * @property {Object} bookInfo 
	 * @event {Function} choose 
	 */
	export default {
		name:"baker-catalogue",
		props: {
			showBook : {
				type : Boolean ,
				default : false 
			} ,
			top : [Number,String] ,
			bottom : [Number,String] ,
			bookId: Number,
			bookInfo:{
				type : Object,
				default(){
					return {} ;
				}
			},
			openType : String ,
			href : String ,
			url : String 
		},
		
		data() {
			return {
				isDesc : false ,
				inited : false
			};
		},
		methods:{
			
			chooseChapter(chapterNumber){
				this.toggle();
				let params = {
					bookId : this.bookId ,
					chapterNumber
				};
				if (this.openType && this.href) {
					uni.$b.open({
						url : this.href ,
						params ,
						openType : this.openType
					})
					return ;
				}
				this.$emit("choose" , params);
			},
			
			toggle(){
				this.$refs.drawer.toggle();
			}
		}
	}
</script>
<style>
	.brown{
		color: #827451;
	}
	.lightBrown{
		color: #907E5A!important;
	}
</style>