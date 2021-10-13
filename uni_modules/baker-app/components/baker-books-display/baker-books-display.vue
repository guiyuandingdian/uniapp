<template>
	<view>
		<b-navigator url="/uni_modules/baker-app/pages/book/bookInfo" :params="{_id:data._id}">
			
			<view class="father pt mb">
				
				<view class="pl95 ptb3 rds4 father hidden" :style="{background:bgColor}">
					<view class="ptb10 pr">
						<view class="flex mb5">
							<view class="bold">{{data.name}}</view>
							<view class="flex rt" :style="{color:scoreColor}">
								<view class="fz18 bold">{{data.score}} </view>
								分
							</view>
						</view>
						<view class="clip c2 fz14 h40"  :style="{color}">{{data.intro}}</view>
					</view>
				</view>
				
				<baker-cover class="abs left bottom" :src="data.cover" width="160rpx"></baker-cover>
				
			</view>
			
		</b-navigator>
	</view>
</template>

<script>
	export default {
		name:"baker-books-display",
		props:{
			data:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			color:{
				type : String ,
				default : "#658668"
			},
			bgColor:{
				type : String ,
				default : "#EAF6EE"
			},
			scoreColor:{
				type : String ,
				default : "#FCA111"
			}
		}
	}
</script>
