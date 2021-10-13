<template>
	<view>
		<b-drawer ref="reward" :z-index="zIndex" show-confirm='false' show-cancel='false' drawer-class="rdsT10 whiteBg" placement="bottom">
			
			<view @tap="toggle();" class="bIcon-arrowDown fz20"></view>
				
			<view class="mtb20">
				<view class="flex">
					<view class="w35">
						<b-image radius="100%" width="100%" src="/uni_modules/baker-app/static/novelPic.png"></b-image>
					</view>
					<view class="cover ml">
						<view class="flex lt">
							<view>射雕英雄传 · 金庸著</view>
						</view>
						<view style="color: #5A5A5A;">感谢支持，您对本书的打赏是我的最大动力！</view>
					</view>
				</view>
			</view>
				
				
			<view>
				<b-radio width="33.333%" :list="src" type="badge">
					<template v-slot:option="{title,checked,value}">
						<view class="father">
							<image class="w100p h100p" :src="`/uni_modules/baker-app/static/${checked?value:title}`" mode="widthFix"></image>
							<view class="abs bottom gray" style="bottom: 8px;left:35%">￥10</view>
						</view>
					</template>
				</b-radio>
			</view>
				
			<view class="ptb bb gray">留言：码字路漫漫，真情永相伴~</view>	
			<view class="pt20">
				<b-btn radius="20" type="block" class="bold">立即打赏</b-btn>
			</view>
		</b-drawer>
	</view>
</template>

<script>
	export default {
		name:"baker-reward",
		props:{
			zIndex : Number
		},
		data() {
			return {
				src: [{
						title: 'red2.png',
						value: 'red1.png'
					},
					{
						title: 'bread2.png',
						value: 'bread1.png'
					},
					{
						title: 'cafe2.png',
						value: 'cafe1.png'
					},
					{
						title: 'fly2.png',
						value: 'fly1.png'
					},
					{
						title: 'bead2.png',
						value: 'bead1.png'
					},
					{
						title: 'love2.png',
						value: 'love1.png'
					}
				]
			};
		},
		methods:{
			toggle(){
				this.$refs.reward.toggle();
			}
		}
	}
</script>
