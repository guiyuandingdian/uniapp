<template>
	<view v-if="ready">
		<b-page url="baker/user/coin/page" :params="{fromLevel , createTimeStart}" :page-size="20" v-slot:default="{list}">
			
			<view class="flex bb plr ptb10" v-for="item in list" :key="item._id">
				<view>
					<view>
						{{item.remark}}
					</view>
					<view class="fz12 gray pt5">
						<b-time :date="item.createTime"></b-time>
					</view>
				</view>
				<view class="text-right">
					<view class="fz16" :class="item.isIncome?'green':'red'">
						<text v-if="item.isIncome">+</text>
						<text>{{item.coin}}</text>
					</view>
					<view class="fz12 gray">
						余额：{{item.balance}}
					</view>
				</view>
			</view>
			
		</b-page>
	</view>
</template>

<script>
	export default {
		name:"baker-coin-records",
		props:{
			fromLevel : Number ,
			isToday : String ,
			ready : Boolean
		},
		computed:{
			createTimeStart(){
				return !!this.isToday ? new Date().setHours(0, 0, 0, 0) : "" ;
			}
		}
	}
</script>
