<template>
	<view>
		<view class="flex mtb">
			<view class="fz18 bold" style="songFont">{{data.title}}</view>
			<view class="flex rt cover pl10">
				
				<view class="flex">
					<view style="color:#EDE1D3 ;" :class="{'ml10' : index > 0}" v-for="( item , index) in data.tags" :key="index">
						<text class="bIcon-starFill fz14 mr5"></text>
						<text>{{item}}</text>
					</view>
				</view>
				
				<view @tap="refresh" v-if="data.hasMore" class="gray ml" hover-class="op7">
					<text class="mr5">换一批</text>
					<text class="bIcon-refresh"></text>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-recommend-title",
		props:{
			url : String ,
			data:{
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
		data() {
			return {
				pageNumber : 1 
			};
		},
		methods:{
			async refresh(){
				this.pageNumber ++ ;
				let res = await await uni.$b.call( this.url , {
					pageNumber : this.pageNumber ,
					pageSize : this.data.max ,
					recommendId : this.data._id 
				});
				this.data.books = res.page.list ;
				if (res.page.lastPage) {
					this.pageNumber = 0 ;
				}
			}
		}
	}
</script>
<style>
	.songFont{
		font-family: "宋体";
	}
</style>