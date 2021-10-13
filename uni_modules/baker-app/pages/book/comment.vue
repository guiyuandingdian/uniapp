<template>
	<view>
		<view class="whiteBg pd">
			<view class="flex">
				<view class="w60">
					<b-image src="/uni_modules/baker-app/static/novelPic.png" width="100%" height="130%" radius="8"></b-image>
				</view>
				<view class="cover ml">
					<view class="fz16 bold">绝世小神医</view>
					<view class="flex mt">
						<view class="gray mt20">悲秋</view>
						<view>
							<b-btn radius="20" ptb="5">继续阅读</b-btn>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="whiteBg pd mt10">
			<view class="flex">
				<view class="w90">
					<text class="fz30 bold">8.4</text>
					<text>分</text>
					<view class="gray">214人评价</view>
				</view>
				<view class="cover">
					<view class="flex lt">
						<view class="gray">好评</view>
						<view class="cover">
							<b-progress  :percent='90' active-color="#F1AE51" size="5"></b-progress>
						</view>
					</view>
				</view>
			</view>
			
			<view class="gray text-center ptb20 bb">阅读本书一定时间后，即可评价</view>
			<view class="ptb fz16" style="color: #636363;">书评（898条）</view>
			<b-radio required-mark="false" title-width="0" type="tag"  :list="['全部','好评157','中评20','差评30','打赏留言157']"></b-radio>
			
			<view class="flex">
				<view></view>
				<view class="grayBg rds20 fz12">
					<b-tab show-bar='false' :value="0" index-value="true" active-color="#000" ptb="5" plr="10" active-class='bdc ptb3 rds20 whiteBg black' show-track='false' :list="['最新','最热']" tab-class=''></b-tab>
				</view>
			</view>
			
			<comment></comment>
			
			<view class="h60"></view>
			<view class="fixed bottom whiteBg bt plr ptb10">
				<view class="flex">
					<view class="w30">
						<b-image src="/uni_modules/baker-app/static/logo.png" width="100%" radius="100%"></b-image>
					</view>
					<view class="cover ml">
						<b-input @focus='$refs.drawer.show()' radius='20' input-class="rds20 bd plr10 ptb0"
						  title-width="0" placeholder="发表对本书的看法..." ></b-input>
					</view>
				</view>
			</view>
			
			
			<b-drawer ref="drawer" show-confirm='false' show-cancel='false' drawer-class="rdsT10 whiteBg" placement="bottom">
					<view class="flex">
						<view class="bIcon-multiply fz20"></view>
						<view class="fz16 bold">写书评</view>
						<view>
							<b-btn color="#E8E8E8" text-color="#9A9A9A">发表</b-btn>
						</view>
					</view>
					
					<view class="mtb">
						<b-textarea title-width="0"  height="100%" placeholder="请尊重他人友好评论" :maxlength="2000"></b-textarea>
					</view>
					<view style="color: #9A9150;">好好写书评，有机会被评为精选哦~</view>
			</b-drawer>
			 
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F5F5F5;
}

.barClass{
	background-color: gray;
}

</style>
