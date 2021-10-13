<template>
	<view>
		<navigator url="/uni_modules/baker-app/pages/book/bookInfo" class="fixAutoNoPd mb20" v-for="(item,index) in 3" :key="index">
			<view class="80">
				<b-image width="80" height="140%" class="rds4 bd shadow " :src="src"></b-image>
			</view>
			
			<view >
				<view class="ml">
					<view class="flex">
						<view class="cover">
							<view class="clip bold fz">这是小说这是小说这是小说这是小是小说这是小是小说这是小</view>
						</view>
						<view class="pl text-right orange noBreak">
							<text class="bold fz20">9.2</text>
							<text class="fz12 ml3">分</text>
						</view>
					</view>
					
					<view class="gray clip c2 fz12" style="height: 38px;">这是是小说这是小说这是是小说这是小说这是</view>
					<view class="fz12 gray mb3">豪门总裁·167.5万字·连载</view>
					
					<view class="flex lt">
						<b-tag color="#EAF6F2" text-color="#249F75" type="solid" class="mr8">娱乐圈</b-tag>
						<b-tag color="#FAEFEB" text-color="#D28971" type="solid" class="mr8">娱乐圈</b-tag>
						<b-tag color="#EAF6F2" text-color="#249F75" type="solid">娱乐圈</b-tag>
					</view>
					
				</view>
				
			</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		name:"block-novels",
		data() {
			return {
				src:'https://img0.baidu.com/it/u=3807055533,2054552347&fm=26&fmt=auto&gp=0.jpg'
			};
		}
	}
</script>

<style>

</style>
