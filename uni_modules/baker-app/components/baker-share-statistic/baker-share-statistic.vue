<template>
	<view>
		<baker-share-panel :title="title">
			
			<view class="flex ptb10 pl pr10 dataItem">
				<view class="bold">{{tTitle}}</view>
				<view class="flex rt">
					<view class='red'>{{total}}</view>{{unit}}
					<view class="bIcon-arrowRight ml7 fz12 op0"></view>
				</view>
			</view>
			
			<navigator :url="subUrl" class="flex ptb10 pl pr10 dataItem active">
				<view class="bold">{{subTitle}}</view>
				<view class="flex rt">
					<view class='red'>{{subTotal}}</view>{{unit}}
					<view class="bIcon-arrowRight ml7 fz12"></view>
				</view>
			</navigator>
			
			<navigator :url="sSubUrl" class="flex ptb10 pl pr10 dataItem">
				<view class="bold">{{sSubTitle}}</view>
				<view class="flex rt">
					<view class='red'>{{sSubTotal}}</view>{{unit}}
					<view class="bIcon-arrowRight ml7 fz12"></view>
				</view>
			</navigator>
			
		</baker-share-panel>
	</view>
</template>

<script>
	export default {
		name:"baker-share-statistic",
		props:{
			title : String ,
			tTitle : String ,
			subTitle : String ,
			sSubTitle : String ,
			subUrl : String ,
			sSubUrl : String ,
			unit : String ,
			total : Number ,
			subTotal : Number ,
			sSubTotal : Number
		}
	}
</script>