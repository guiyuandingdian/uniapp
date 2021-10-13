<template>
	<view>
		<b-page url="baker/user/withdrawRecord/page" :page-size="20" v-slot:default="{list}">
			
			<view class="flex bb plr ptb10" v-for="item in list" :key="item._id">
				<view>
					<view>
						{{item.statusStr}}
					</view>
					<view class="fz12 gray pt5">
						<b-time :date="item.createTime"></b-time>
					</view>
				</view>
				<view class="text-right">
					<view class="fz16 green bold">
						<b-price :price="item.amount" :fixed="2" prefix="" :relative-scale="1"></b-price>
					</view>
					<view class="fz12 gray">
						余额：{{item.balance}}
					</view>
				</view>
			</view>
			
		</b-page>
	</view>
</template>
