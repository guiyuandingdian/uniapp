<template>
	<view class="fixed" :style="baseStyle">
		
		<!-- 前一章 -->
		<baker-content ref="prevChapter" class="abs op0"
			:title="prevChapter.title" 
			:content="prevChapter.content"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="_lineHeight"
			@done="onDone($event,'prevChapter')"></baker-content>
		
		<!-- 当前章节 -->
		<baker-content ref="curChapter" class="abs op0"
			:title="curChapter.title" 
			:content="curChapter.content"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="_lineHeight"
			@done="onDone($event,'curChapter')"></baker-content>
		
		<!-- 下一章节 -->
		<baker-content ref="nextChapter" class="abs op0"
			:title="nextChapter.title" 
			:content="nextChapter.content"
			:pageHeight="pageHeight"
			:fontSize="fontSize"
			:lineHeight="_lineHeight"
			@done="onDone($event,'nextChapter')"></baker-content>
		
		
		<!-- 章节 - 前一页 -->
		<view class="abs z6 pt45s" :class="prevClass" :style="prevPageStyle">
			
			<baker-ad-content
				:showAd="adStatus == 'prev'"
				:adStatus="adStatus"
				:pageChapter="prevPageChapter"
				:pageIndex="prevPageIndex"
				:pageHeight="pageHeight"
				:fontSize="fontSize"
				:lineHeight="_lineHeight" />
			
		</view>


		<!-- 章节 - 当前页 -->
		<view class="abs z4 shadowRight pt45s" :class="themeClass" :style="curPageStyle" 
			@touchstart="ontouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd">
			
			<baker-ad-content
				:showAd="adStatus == 'current'"
				:adStatus="adStatus"
				:pageChapter="curPageChapter"
				:pageIndex="pageIndex"
				:pageHeight="pageHeight"
				:fontSize="fontSize"
				:lineHeight="_lineHeight"
				:auto="auto"
				@switchNext="switchNextPage();adLoad=false;"
				@adLoad="adLoad=true;"/>
			
				
		</view>
		
		
		<!-- 章节 - 下一页 -->
		<view class="abs z2 shadowRight pt45s" :class="themeClass">
			
			<baker-ad-content
				:showAd="adStatus == 'next'"
				:adStatus="adStatus"
				:pageChapter="nextPageChapter"
				:pageIndex="nextPageIndex"
				:pageHeight="pageHeight"
				:fontSize="fontSize"
				:lineHeight="_lineHeight"/>
			
		</view>


	</view>
</template>

<script>
	import { store } from "../../js_sdk/baker-reward-ad.js";
	import { userStore } from "../../js_sdk/baker-user-store.js" ;
	export default {
		name:"baker-chapter-reader",
		props: {
			themeClass : String,
			totalHeight: {
				type: Number,
				default: 577
			},
			fontSize: {
				type: Number,
				default: 14
			},
			lineHeight: {
				//行高：字号的倍数
				type: Number,
				default: 1.8
			},
			mode: {
				//slide 、 overlying
				type: String,
				default: "slide"
			},
			//自动翻页
			auto: Boolean,
			adPages: {
				type: Number,
				default: 7
			},
			totalChapters: {
				type: Number,
				default: 1
			},
			value: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				adLoad : false ,
				//原始章节数据
				chapters:{},
				
				prevChapter : {} ,
				prev2Chapter : {} ,
				curChapter : {} ,
				nextChapter : {} ,
				next2Chapter : {} ,
				
				pageIndex : 0 ,
				winWidth : uni.getSystemInfoSync().windowWidth ,
				delta : 0 ,
				startX : 0 ,
				prevX : 0 ,
				direction : "" ,
				animate : false ,
				duration : 400 ,
				pageCount : 2 , //翻页计数器
				adPageCount: 0 //广告页码
			}
		},
		computed: {
			showAd() {
				return store.getters.showAd ;
			},
			prevClass(){
				return uni.$b.getClassName({
					"shadowRight" : this.delta > 10
				} , this.themeClass );
			},
			baseStyle() {
				return uni.$b.getStyle({
					height: `${this.totalHeight + 45 + 28 }px`,
					"font-size": `${this.fontSize}px`,
					"line-height": `${this._lineHeight}px`,
					"text-indent": `${this.fontSize * 2}px`
				});
			},
			
			//具体行高
			_lineHeight() {
				return parseInt(this.lineHeight * this.fontSize);
			},
			//单页高度：行数 * 行高
			pageHeight() {
				let maxLineCount = parseInt(this.totalHeight / this._lineHeight);
				return maxLineCount * this._lineHeight;
			},
			adStatus(){
				if (!this.showAd) {
					return "none" ;
				}
				let pageCount = this.pageCount ;
				let adPages = this.adPages + 1 ;
				if ( pageCount > 0 && pageCount % adPages == 0) {
					return "next" ;
				}
				if ( pageCount > 1 && (pageCount - 1) % adPages == 0 ) {
					return "current" ;
				}
				if ( pageCount > 2 && (pageCount - 2) % adPages == 0 ) {
					return "prev" ;
				}
				return "none" ;
			},
			//是否是当前章节的最后一页
			isLastPage(){
				return this.pageIndex == this.curChapter.totalPage - 1 ;
			},
			isFirstPage(){
				return this.pageIndex == 0 ;
			},
			curPageChapter(){
				return this.curChapter ;
			},
			//前一页章节内容
			prevPageChapter() {
				return this.isFirstPage ? this.prevChapter : this.curChapter ;
			},
			//下一页章节内容
			nextPageChapter(){
				return this.isLastPage ? this.nextChapter : this.curChapter ;
			},
			//下一页章节页码
			nextPageIndex(){
				return this.isLastPage ? 0 : this.pageIndex + 1 ;
			},
			//前一页章节页码
			prevPageIndex(){
				return this.isFirstPage ? this.prevChapter.totalPage - 1 : this.pageIndex - 1 ;
			},
			//前一页样式：主要为偏移值
			prevPageStyle(){
				//向右侧滑动拉出前一页时，前一页移动；否则前一页不动。
				let transX = this.direction == "prev" ? - this.winWidth + this.delta  : - this.winWidth ;
				return uni.$b.getStyle({
					"transform" : `translateX(${transX}px)`,
					"transition" : this.animate ? '0.2s' : ''
				});
			},
			//当前页样式：主要为偏移值
			curPageStyle(){
				//向左侧滑动，拉出下一页时，当前页移动；否则当前页不动，上一页移动。
				let transX = this.direction == "next" ? this.delta : 0 ;
				return uni.$b.getStyle({
					"transform" : `translateX(${transX}px)`,
					"transition" : this.animate ? `${this.duration}ms` : ''
				});
			}
		},
		watch: {
			value:{
				handler(newValue, oldValue) {
					this.pageIndex = newValue ;
				},
				immediate : true
			},
			pageIndex(){
				this.$emit("input" , this.pageIndex);
			}
		},
		created() {
			this.inited = uni.$b.once(this.inited , 50);
		},
		mounted() {
			userStore.dispatch("loadData");
		},
		methods: {
			setChapterData( name , data){
				if (!data || this[name]._id == data._id) {
					return ;
				}
				//保留原始数据
				this.chapters[name] = data ;
				//为当前数据赋值
				this[name] = Object.assign({},data) ;
			},
			onDone({totalHeight , totalPage} , name){
				//字号、行高调整时，避免超出总页码
				if (this.pageIndex > totalPage - 1 && totalPage > 1) {
					this.pageIndex = totalPage - 1 ;
				}
				this.$set(this[name] , "totalPage" , totalPage);
				this.$set(this[name] , "totalHeight" , totalHeight);
				//初始化
				this.inited();
			},
			
			ontouchStart(e){
				this.startX = e.changedTouches[0].clientX ;
				this.direction = "" ;
				this.animate = false ;
			},

			onTouchMove(e){
				let {delta , curX} = this.getDelta(e) ;
				//判断方向
				if (!this.direction) {
					this.direction = delta > 0 ? "prev" : "next" ;
				}
				//到第一页
				let isFirst = this.direction == "prev" && this.curChapter.chapterNumber == 1 && this.isFirstPage ;
				if ( isFirst ) {
					uni.$b.showToast("已经是第一页");
					this.delta = 0 ;
					return ;
				}
				//到最后一页
				let isLast = this.direction == "next" && this.curChapter.chapterNumber == this.totalChapters && this.isLastPage ;
				if ( isLast ) {
					uni.$b.showToast("已经是最后一页");
					this.delta = 0 ;
					return ;
				}
				
				this.delta = delta ;
			},
			onTouchEnd(e){
				let {delta , curX} = this.getDelta(e) ;
				
				//点击
				if (Math.abs(delta) < 8) {
					this.onClick(curX);
					return ;
				}
				
				//取消
				let cancel = Math.abs(delta) < 50 ;
				
				//到第一页、后一页
				let isFirst = this.direction == "prev" && this.curChapter.chapterNumber == 1 && this.isFirstPage ;
				let isLast = this.direction == "next" && this.curChapter.chapterNumber == this.totalChapters && this.isLastPage ;
				if (cancel || isFirst || isLast) {
					this.animate = true ;
					this.delta = 0 ;
					return ;
				}
				
				if (this.direction == "next") {
					this.switchNextPage();
				}else{
					this.switchPrevPage();
				}
			},
			
			//切换至下一页
			switchNextPage(){
				if ( this.curChapter.chapterNumber == this.totalChapters && this.isLastPage ) {
					uni.$b.showToast("已经是最后一页");
					return ;
				} 
				
				//开启动画
				this.animate = true ;
				this.direction = "next" ;
				//切换至下一页
				this.delta = -this.winWidth ;
				
				//切换章节
				let chapterChanged = this.nextPageIndex == 0 ;
				let prevChapter = chapterChanged ? this.curChapter : this.prevChapter ;
				let prev2Chapter = chapterChanged ? this.prevChapter : this.prev2Chapter ;
				let curChapter = chapterChanged ? this.nextChapter : this.curChapter ;
				let nextChapter = chapterChanged ? this.next2Chapter : this.nextChapter ;
				let next2Chapter = chapterChanged ? undefined : this.next2Chapter ;
				let pageIndex = this.nextPageIndex ;
				
				if (this.adStatus == "next") {
					pageIndex = this.pageIndex ;
				}
				
				//预加载下2章节
				if (chapterChanged && !!this.curChapter.chapterNumber) {
					// let chapterNumber = this.next2Chapter.chapterNumber + 1 ;
					let chapterNumber = this.curChapter.chapterNumber + 3 ;
					this.$emit("preload" , { name : "next2Chapter" , chapterNumber });
				}
				
				setTimeout(() => {
					if (this.adStatus == "current") {
						this.adPageCount ++ ;
					}
					//切换页码
					this.switchPageIndex(pageIndex,prevChapter , prev2Chapter , curChapter , nextChapter , next2Chapter , this.pageCount + 1);
				}, this.duration );
			},
			
			//切换至上一页
			switchPrevPage(){
				if ( this.curChapter.chapterNumber == 1 && this.isFirstPage ) {
					uni.$b.showToast("已经是第一页");
					return ;
				}
				//开启动画
				this.animate = true ;
				this.direction = "prev" ;
				//切换至上一页
				this.delta = this.winWidth ;
				//切换章节
				let chapterChanged = this.prevPageChapter._id !== this.curChapter._id ;
				let nextChapter = chapterChanged ? this.curChapter : this.nextChapter ;
				let next2Chapter = chapterChanged ? this.nextChapter : this.next2Chapter ;
				let curChapter = chapterChanged ? this.prevChapter : this.curChapter ;
				let prevChapter = chapterChanged ? this.prev2Chapter : this.prevChapter ;
				let prev2Chapter = chapterChanged ? undefined : this.prev2Chapter ;
				let pageIndex = this.prevPageIndex ;
				
				if (this.adStatus == "prev") {
					pageIndex = this.pageIndex ;
				}
				
				if (chapterChanged && !!this.curChapter.chapterNumber) {
					//预加载前一章节
					// let chapterNumber = this.prev2Chapter.chapterNumber - 1 ;
					let chapterNumber = this.curChapter.chapterNumber - 3 ;
					this.$emit("preload" , { name : "prev2Chapter" , chapterNumber });
				}

				setTimeout(() => {
					if (this.adStatus == "current") {
						this.adPageCount -- ;
					}
					//切换页码
					this.switchPageIndex( pageIndex ,prevChapter , prev2Chapter , curChapter , nextChapter , next2Chapter , this.pageCount - 1 );
				}, this.duration );
			},
			
			onClick(curX){
				if (this.adStatus == "current") {
					return ;
				}
				//点击左侧
				if (curX < this.winWidth / 3 ) {
					this.switchPrevPage();
					return ;
				}
				//点击右侧
				if (curX > this.winWidth / 3 * 2) {
					this.switchNextPage();
					return ;
				}
				//点击中央
				this.$emit("tapCenter" , "xxx");
			},
			
			getDelta(e){
				let curX = e.changedTouches[0].clientX ;
				let delta = curX - this.startX ;
				if (delta < -this.winWidth) {
					delta = -this.winWidth ;
				}
				if (delta > this.winWidth) {
					delta = this.winWidth ;
				}
				return {delta , curX} ;
			},
			switchChapter(prevChapter , prev2Chapter , curChapter , nextChapter , next2Chapter){
				this.setChapterData("curChapter" , curChapter);
				this.setChapterData("prevChapter" , prevChapter);
				this.setChapterData("prev2Chapter" , prev2Chapter);
				this.setChapterData("nextChapter" , nextChapter);
				this.setChapterData("next2Chapter" , next2Chapter);
			},
			switchPageIndex(pageIndex,prevChapter , prev2Chapter , curChapter , nextChapter , next2Chapter , pageCount ){
				this.$nextTick(()=>{
					this.delta = 0 ;
					this.animate = false ;
					this.pageCount = pageCount ;
					
					if (pageIndex == this.pageIndex) {
						return ;
					}
					
					//切换章节
					this.switchChapter(prevChapter , prev2Chapter , curChapter , nextChapter , next2Chapter);
					
					//切换页码
					this.pageIndex = pageIndex ;
					
					//通知计时器重置
					uni.$emit("bakerSwitchChapterPage");
					//通知
					this.$emit("switchPage" , {
						 chapterNumber : curChapter.chapterNumber ,
						 pageNumber : pageIndex + 1 , 
						 totalPage : curChapter.totalPage , 
						 title : curChapter.title 
					});
				})
			},
			
			inited(){
				this.$emit("inited" , {
					 chapterNumber : this.curChapter.chapterNumber ,
					 pageNumber : this.pageIndex + 1 , 
					 totalPage : this.curChapter.totalPage , 
					 title : this.curChapter.title 
				});
			}
		}
	}
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