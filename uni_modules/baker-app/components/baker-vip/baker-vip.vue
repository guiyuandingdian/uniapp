<template>
	<view>
		<view class="father hidden" :class="{'activeVip' : active}">
			
			<view class="abs bottom bk-vip-fill vipIcon gray rotate30"></view>
			
			<view class="grayBg bd2 rds10 plr10 text-center">
				<view class="fz14 bold pt35">{{item.title}}</view>
				<view class="flex ct ptb5 bold">
					<b-price :price="item.price" :fixed="2" class="fz25 golden"></b-price>
				</view>
				
				<view class="pb pt5 gray op8">
					<block v-if="item.originPrice">
						<b-price :price="item.originPrice" type="originPrice" class="ml5"></b-price>
					</block>
					<view v-else class="clip c1">
						{{remark}}
					</view>
				</view>
			</view>
			
			<b-tag v-if="item.tag" class="abs top left" bag-img="linear-gradient(to right , #f2ca5b , #ffe292)" text-color="#6c4404" color="#f2ca5b"
			        tag-class="rdsTl10 rdsBr10 fz12 ptb3 plr7">{{item.tag}}</b-tag>

		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-vip" ,
		props:{
			item : Object ,
			active : Boolean 
		},
		computed: {
			remark() {
				let days = parseInt((this.item.price / this.item.days) * 100 ) / 100 ;
				return `${days}元/天` ; 
			}
		}
	}
</script>

<style lang="scss">
	
	.vipIcon{
		font-size: 90px;
		bottom: -90rpx;
		left: -60rpx;
		opacity: 0.07;
	}
	.activeVip{
		.grayBg{
			background-color: #fff5d9;
		}
		.bd2{
			border-color: #f2ca5b;
		}
		.vipIcon{
			color: #CB955A;
		}
	}
</style>
