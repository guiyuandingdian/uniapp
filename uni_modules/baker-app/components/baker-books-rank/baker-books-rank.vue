<template>
	<view>
		<b-navigator :url="url" :params="{_id : data._id}">
			<view class="flex mb10 cv">
				<baker-cover :src="data.cover" width="50"></baker-cover>
				<view class="cover plr10 flex vertical t">
					<view class="fz14 bold">
						<view class="clip c1">
							{{data.name}}
						</view>
						<view class="flex lt lh1 pt3">
							<baker-rate :score="data.score"></baker-rate>
							<view class="pl7 normal gray fz12">{{data.score}}分</view>
						</view>
					</view>
					
					<view class="gray fz13">
						{{data.categoryName}} · {{data.finishedStr}}
					</view>
				</view>
				<block v-if="index < 4">
					<image :src="`/uni_modules/baker-app/static/rank${index}.png`" mode="widthFix" class="w35 h35"></image>
				</block>
				<view v-else>
					<view class="fz16 text-center bold w35 op7">
						{{index}}
					</view>
				</view>
			</view>
		</b-navigator>
	</view>
</template>

<script>
	export default {
		name:"baker-books-rank",
		props:{
			flag : {
				type :String ,
				default : "novel"
			},
			data:{
				type : Object,
				default(){
					return {} ;
				}
			},
			index : Number
		},
		computed:{
			url(){
				return this.flag == "novel" ? "/uni_modules/baker-app/pages/book/bookInfo" : "/uni_modules/baker-app-cartoon/pages/cartoon/bookInfo" ;
			}
		}
	}
</script>
