<template>
	<view class="b-page-nav plr" v-if="showNav">
		
		<view :class="{'flex lt' : isPc}">
			
			<view class="flex ct">
				
				<view class="nav-item ml0 fz12" :class="prevClass" @tap="switchPage(page.pageNumber-1)">
					<view v-if="!!prevText">{{prevText}}</view>
					<view v-else class="bIcon-arrowLeft"></view>
				</view>
				
				<!-- 当前页-->
				<block v-for="( item , index) in list" :key="index">
					<view @tap="switchPage(item.pageNumber)" class="nav-item" :class="item.className">
						<block v-if="item.isPrev">
							<view class="bIcon-moreFill fz12"></view>
							<view class="bIcon-left fz12"></view>
						</block>
						<block v-else-if="item.isNext">
							<view class="bIcon-moreFill fz12"></view>
							<view class="bIcon-right fz12"></view>
						</block>
						<block v-else>
							{{item.pageNumber}}
						</block>
					</view>
				</block>
				
				<view class="nav-item fz12 hoverMain" :class="nextClass" @tap="switchPage(page.pageNumber+1)">
					<view v-if="!!nextText">{{nextText}}</view>
					<view v-else class="bIcon-arrowRight"></view>
				</view>
				
			</view>
			
			<view class="flex ct fz12" :class="{mt : !isPc}">
				
				<view class="ml15">
					到第
				</view>
				<view class="w30 mlr5">
					<input class="ptb5 bd text-center rds2" type="number" min="1" v-model="curPageNum">
				</view>
				<view>
					页，每页
				</view>
				<view class="w30 mlr5">
					<input class="ptb5 bd text-center rds2" type="number" min="1" v-model="curPageSize">
				</view>
				<view class="mr10">
					条
				</view>
				
				<b-btn class="fz12" plr="10" ptb="3" radius="2" :shadow="false" color="#f1f1f1" text-color="#333" @tap="switchPage(curPageNum)">确定</b-btn>
				
				<view class="plr15 gray">共 {{page.totalRow}} 条 </view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	export default {
		name: "paginate",
		mixins:[mediaMixins],
		props: {
			page: {
				type: Object,
				default: function(e) {
					return {
						pageNumber: 1,
						lastPage: true,
						totalPage: 1,
						list: [],
						totalRow: 0,
						pageSize: 10
					};
				}
			},
			pagerCount: {
				type : [Number,String,Array] ,
				default(){
					return [1,3,3,4,5];
				}
			},
			hideOnSinglePage: {
				type : [Boolean,String] ,
				default(){
					return uni.$b.getValue("components.pageNav.hideOnSinglePage")
				}
			},
			prevText : String,
			nextText : String,
			disabled : [Boolean,String] 
		},

		data() {
			return {
				curPageNum: this.page.pageNumber,
				curPageSize : this.page.pageSize
			};
		},
		
		computed:{
			showNav(){
				return (!this._hideOnSinglePage || this.page.totalPage > 1) && (this.page.list.length > 0 || this.page.pageNumber != 1) ;
			},
			_hideOnSinglePage(){
				return this.bv(this.hideOnSinglePage);
			},
			_pagerCount(){
				return this.dv(this.pagerCount);
			},
			prevClass(){
				let disabled = this.page.pageNumber == 1 ;
				return uni.$b.getClassName({
					'plr10' : !!this.prevText,
					'disabled op2' : disabled ,
					'hoverMain' : !disabled
				})
			},
			nextClass(){
				let disabled = this.page.lastPage ;
				return uni.$b.getClassName({
					'plr10' : !!this.nextText,
					'disabled op2' : disabled ,
					'hoverMain' : !disabled
				})
			},
			list(){
				if (this.page.totalRow == 0) {
					return [] ;
				}
				let list = [] ;
				let {pageNumber , totalPage : total} = this.page ;
				let pagerCount = this._pagerCount ;
				let step = 5 ;
				let min = pageNumber - pagerCount ;
				let max = pageNumber + pagerCount ;
				let hasPrev = min > 2 ;
				let hasNext = max < total - 1 ;
				list.push({
					pageNumber : 1 
				});
				if (hasPrev) {
					list.push({
						pageNumber : pageNumber - step < 1 ? 1 : pageNumber - step ,
						isPrev : true 
					})
				}
				for (var i = min; i <= max; i++) {
					if (i > 1 && i < total) {
						list.push({
							pageNumber : i 
						});
					}
				}
				if (hasNext) {
					list.push({
						pageNumber : pageNumber + step > total ? total : pageNumber + step ,
						isNext : true 
					})
				}
				if (total != 1) {
					list.push({
						pageNumber : total 
					});
				}
				
				return list.map(item =>{
					let isCurrent = item.pageNumber == this.page.pageNumber ;
					return {
						...item ,
						className : uni.$b.getClassName({
							'active' : isCurrent ,
							'hoverMain' : !isCurrent 
						})
					}
				}) ;
			}
		},
		
		watch: {
			"page.pageNumber" : function(newValue, oldValue) {
				this.curPageNum = this.page.pageNumber ;
			},
			"page.pageSize" : function(newValue, oldValue) {
				this.curPageSize = this.page.pageSize ;
			}
		},

		methods: {
			
			switchPage: function(pageNum) {
				if (uni.$b.isTrue(this.disabled)) {
					return ;
				}
				let pageSizeChanged = this.curPageSize != this.page.pageSize ;
				if (pageSizeChanged) {
					this.curPageNum = 1 ;
					pageNum = 1 ;
				}
				if (pageNum < 1 || pageNum > this.page.totalPage || (!pageSizeChanged && pageNum == this.page.pageNumber) ) {
					return false;
				}
				this.$emit("switchPage", {
					pageSizeChanged ,
					pageNumber :  pageNum ,
					pageSize : this.curPageSize
				});
			},

		}
	}
</script>
<style lang="scss">
	.nav-item{
		min-width: 27px;
		height: 27px;
		line-height: 27px;
		text-align: center;
		background-color: #f7f7f7;
		color: #30302f;
		border-radius: 2px;
		margin-left: 2px;
		margin-right: 2px;
		padding: 0 5px;
		&.active{
			background-color: $main;
			color: #fff;
		}
		.bIcon-left,.bIcon-right{
			display: none;
		}
		&:hover{
			.bIcon-moreFill{
				display: none;
			}
			.bIcon-left,.bIcon-right{
				display: block;
			}
		}
	}
</style>