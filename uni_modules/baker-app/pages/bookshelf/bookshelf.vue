<template>
	<view class="pb80">
		
		<baker-fix-top ref="topBar" bgClass="bg">
		
			<view class="flex">
				
				<view :class="{hide : !editable}" class="w100 flex lt" @tap="changeEdit">
		
					<view v-if="!editing" class="bIcon-editSquare fz17 plr flex ct"></view>
					<view v-else class="plr flex ct">取消</view>
					
				</view>
		
		
				<view class="ptb">
					我的书架
				</view>
		
		
				<view class="w100 flex rt">
					<!-- #ifdef APP-PLUS || H5 -->
					<navigator :url="searchUrl" class="bIcon-search fz17 plr flex ct" hover-class="op8"></navigator>
					<!-- #endif -->
				</view>
				
			</view>
			
		</baker-fix-top>
		
		<b-page ref="page" :url="url" :params="{channel}" @success="page = $event.page;" :show-empty="false">
			
			<!-- #ifdef APP-PLUS || H5 -->
			<view class="bg h40"> <view class="statusBar"></view> </view>
			<!-- #endif -->
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="bg h40"> <view class="statusBar"></view> </view>
			<!-- #endif -->
			
			
			<view class="plr father pb20" style="margin-top: -80rpx;">
				
				<baker-recent-book :recentData="recentData" :editing="editing" @change="chooseOne">
					<b-check ref="checkone" name="ids" :value="recentData.bookId" radius="100%"></b-check>
				</baker-recent-book>
				
				<!-- 登录提示 -->
				<baker-login-tip tips="登录后书籍存在云端永不消失" @logined="logined = true ; $refs.page.refresh();"></baker-login-tip>
				
				
				<baker-bookshelf-item @change="choose(item,index)" :editing="editing" :item="item" v-for="(item,index) in listData" :key="index">
					<b-check ref="check" name="ids" :value="item.bookId" radius="100%"></b-check>
				</baker-bookshelf-item>
				
			</view>
			
			<baker-empty v-if="page.list.length == 0" tips="书架还没有书籍哦~"></baker-empty>
			
		</b-page>
		
		
		<baker-fix-bottom v-if="editing">
			<view class="flex main plr bt">
				<view class="ptb">
					<b-checkAll name="ids" radius="100%" @change="onChange" :value="bookIds">全选</b-checkAll>
				</view>
				<b-btn :url="removeUrl" :params="{bookIds}" :disabled="disabled" confirm="确认从书架移除吗？" @success="onRemoveSuccess" type="text">
					确认删除
				</b-btn>
			</view>
		</baker-fix-bottom>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logined : uni.$b.isLogin() ,
				page:{
					list : []
				},
				channel: uni.getStorageSync("baker_channel"),
				editing : false,
				bookIds : [] ,
				searchUrl : "/uni_modules/baker-app/pages/book/search" ,
				removeUrl : "baker/user/history/removeShelf"
			}
		},
		computed: {
			url(){
				return this.logined ? "baker/user/history/bookshelf" : "baker/api/recommendBook/bookshelf" ;
			},
			recentData() {
				return this.page.list[0] || {} ;  
			},
			listData(){
				return this.page.list.length > 0 ? this.page.list.slice(1) : [];
			},
			disabled(){
				return this.bookIds.length == 0 ;
			},
			editable(){
				return this.page.list.some(item => item.addShelf) && this.logined;
			}
		},
		onPullDownRefresh() {
			this.logined = uni.$b.isLogin();
		},
		onShow() {
			this.logined = uni.$b.isLogin();
			this.reloadData();
		},
		methods: {
			changeEdit(){
				if (!this.editable) {
					return ;
				}
				this.editing = !this.editing ;
				this.bookIds = [];
			},
			onChange(e){
				this.bookIds = e.detail.value ;
			},
			chooseOne(item){
				if (this.editing) {
					this.$refs.checkone.check();
					return ;
				}
				this.open(item);
			},
			choose(item,index){
				if (this.editing) {
					this.$refs.check[index].check();
					return ;
				}
				this.open(item);
			},
			open(data){
				let {bookId,chapterNumber,pageIndex,fontSize,lineHeight} = data ;
				let url = data.isRead ? "/uni_modules/baker-app/pages/book/chapterInfo" : "/uni_modules/baker-app/pages/book/bookInfo" ;
				let params = data.isRead ? {bookId,chapterNumber,pageIndex,fontSize,lineHeight} : { _id : bookId } ;
				uni.$b.open({
					url ,
					params 
				})
			},
			reloadData(){
				this.$nextTick(()=>{
					this.$refs.page && this.$refs.page.refresh();
				});
			},
			onRemoveSuccess(){
				this.editing = false ;
				let list = this.page.list.filter(item => !this.bookIds.includes(item.bookId));
				this.page.list = list ;
				this.bookIds = [];
				if (list.length == 0) {
					this.reloadData();
				}
			}
		}
	}
</script>