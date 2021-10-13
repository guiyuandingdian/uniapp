<template>
	<view>
		<b-navigator :url="href" :params="{_id:data._id}">
			
			<view class="flex cv mb20">
				<baker-cover :src="data.cover" :width="width" :tag="data.finishedStr"></baker-cover>
				
				<view class="cover pl">
					<view class="flex h100p vertical t">
						<view>
							<view class="flex">
								<view class="cover">
									<view class="clip bold fz">{{data.name}}</view>
								</view>
								<view class="pl text-right orange noBreak">
									<text class="bold fz18">{{data.score ? data.score : '9.8'}}</text>
									<text class="fz12 ml3">分</text>
								</view>
							</view>
							
							<view class="gray clip c3 fz12">{{data.intro}}</view>
						</view>
						
						<view class="fz12 gray mb3 flex lt">
							{{data.categoryName}} 
							<view class="plr2">·</view>
							<block v-if="flag == 'novel'">
								<baker-words :words="data.words"></baker-words>
							</block>
							<block>
								{{data.area}}
							</block>
						</view>
						
					</view>
					
				</view>
			</view>
			
		</b-navigator>
	</view>
</template>

<script>
	export default {
		name:"baker-books-block",
		props:{
			flag : {
				type : String ,
				default: "novel"
			},
			data:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			showRank : Boolean,
			showCategory : Boolean ,
			width : {
				type : [String , Number],
				default : "160rpx"
			}
		},
		computed:{
			href(){
				return {
					"novel" : "/uni_modules/baker-app/pages/book/bookInfo" ,
					"cartoon" : "/uni_modules/baker-app-cartoon/pages/cartoon/bookInfo"
				}[this.flag] ;
			}
		}
	}
</script>
