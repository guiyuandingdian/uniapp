<template>
	<view>

		<b-list url="baker/api/category/listByChannel" @load="listLoad">
			
			<baker-fix-top id="topBar" bgClass="bg" ref="nav">
				<view class="text-center flex cv">
					<navigator url="/uni_modules/baker-app/pages/book/search" class="bIcon-searchFill fz17 plr flex ct" hover-class="op8"></navigator>
					<view class="cover ptb5">
						<b-tab v-model="channel" :list="data" class="bold fz18 black" align="center" :color="activeColor" :active-color="activeColor" ptb="5" :plr="plr"
							:show-track='false' bar-width="20" bar-class="barActiveBg" bar-height='3' active-class="fz20 bold">
						</b-tab>
					</view>
					<view class="bIcon-searchFill fz20 plr op0"></view>
				</view>
			</baker-fix-top>


			<view class="pl100">
			
				<!-- 左侧分类栏目 -->
				<view class="grayBg text-center leftBar fixed top left" :style="{height , top : `${topHeight}px`}">
					
					<b-tab :list="navList"
						height="100%" 
						width="200rpx"
						show-track='false'
						:index-value="true"
						:value="navIndex"
						ptb="36rpx"
						bar-width="3"
						tab-class="fz14 gray" 
						active-class="bold whiteBg"
						active-color="#000"
						placement="right"
						:duration="400"
						bar-class="bar"
						@change="changeNav"></b-tab>

				</view>
				
				<!-- 右侧分类内容区域 -->
				<view class="cover">
					
					<block v-if="navIndex == 0">
						
						<view class="pd">
							<!-- 轮播图 -->
							<b-banner type="big" :list="banners" mode="local"
								:height="80" class="rds7 hidden" img-mode="aspectFill"></b-banner>
							
							<!-- 分类 -->	
							<view class="ptb10">
								<view v-for="(child,index) in categorys" :key="child._id">
									
									<view class="flex ct ptb">
										<view class="bt w40"></view>
										<view class="fz16 bold plr20">
											{{child.name}}
										</view>
										<view class="bt w40"></view>
									</view>
											
									<view class="grid g2 text-center">
										<view class="plr10 mb10 item" v-for="(subChild,subIndex) in child.children" :key="subChild._id">
											<b-navigator url="/uni_modules/baker-app/pages/book/bookList" :params="{categoryId : subChild._id }" hoverClass="op7">
												<view class="grayBg pd10 h100p">
													<view class="fz15">{{subChild.name}}</view>
												</view>
											</b-navigator>
										</view>
									</view>
											
								</view>
							</view>
						</view>
						
					</block>
					<block v-else>
						
						<b-page class="pd pr10" url="baker/api/book/page" :params="{orderBy}" :cache="true" v-slot:default="{list}">
							
							<baker-books-rank :data="item" :index="index + 1" v-for="( item , index) in list" :key="item._id"></baker-books-rank>
							
							<baker-empty v-if="list.length == 0"></baker-empty>
							
						</b-page>
						
					</block>
			
				</view>
			</view>
			
		</b-list>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				channel: 1 ,
				data: [{title:"男频",value:1},{title:"女频",value:2}],
				navIndex : 0 ,
				navList : [
					{title : "全部分类" , value : "category" } ,
					{title : "推荐榜" , value : "recommend" } ,
					{title : "大热榜" , value : "hot" } ,
					{title : "好评榜" , value : "praise" } ,
					{title : "完结榜" , value : "finished" } ,
					{title : "新书榜" , value : "new" } ,
					{title : "热搜榜" , value : "search" } ,
					// {title : "打赏榜" , value : "reward" } ,
					// {title : "粉丝榜" , value : "funs" } ,
					// {title : "分类榜" , value : "category" }
				],
				topHeight : 75 ,
				orderBy : ""
			}
		},
		computed: {
			channelData(){
				return this.data.find(item => item.value == this.channel ) || {} ;
			},
			banners(){
				return this.channelData.banners || [];
			},
			categorys(){
				return this.channelData.children || [];
			},
			height(){
				return `calc(100vh - var(--window-bottom) - ${this.topHeight}px)` ;
			},
			plr() {
				// #ifdef MP-WEIXIN
				return 9 ; 
				// #endif
				
				// #ifdef APP-PLUS || H5
				return 15 ; 
				// #endif
			},
			activeColor(){
				return uni.$b.getValue("components.mainInverse")
			}
		},
		onShow() {
			let {navIndex} = uni.getStorageSync("baker_switchTab") || {} ;
			uni.removeStorageSync("baker_switchTab");
			navIndex = Number(navIndex)
			this.navIndex = !isNaN(navIndex) ? navIndex : this.navIndex ;
		},
		methods: {
			changeNav(e){
				let value = e.detail.value ;
				if (value == 0) {
					this.navIndex = value ;
					return ;
				}
				//未完成
				this.navIndex = value ;
			},
			listLoad(e){
				this.data = e.list;
				this.$nextTick(()=>{
					this.queryRect();
					this.$refs.nav.queryRect();
				})
			},
			async queryRect(){
				let {height} = await uni.$b.select("#topBar" , this);
				this.topHeight = height ;
			}
		}
	}
</script>

<style lang="scss">
	.leftBar{
		height: calc(100vh - var(--window-bottom) - 88rpx);
	}
	/deep/ .barActiveBg{
		background-color: $activeColor!important;
	}
</style>