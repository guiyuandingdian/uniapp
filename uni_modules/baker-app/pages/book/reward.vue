<template>
	<view class="hh pd father" :style="{'background-color':bag ,'color':textColor}">
		<view class="flex fz12">
			<view class="op4" :style="{'color':textColor}">第2章 可以不走吗？</view>
			<view>
				<view class="flex">
					<navigator url="/uni_modules/baker-app/pages/book/coinAward">
						<b-progress :percent="30" :background-color='textColor' class="op4"></b-progress>
					</navigator>
					<view>
						<b-btn radius="20" is-plain="true" left-icon="bIcon-listFill" :color='textColor' ptb="3" class="op4">菜单</b-btn>
					</view>
				</view>
			</view>
		</view>
		
		<view class="mt content">这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容这是小说内容</view>
		
		<view class="fixed top plr " style="background-color: #343436;color: #BABABA;">
			<view class="flex">
				<view class="w50p">
					<navigator url="" class="flex lt">
						<view class="bIcon-arrowLeft mr10 fz18"></view>
						<view class="fz18">返回</view>
					</navigator>
				</view>
				<view class="cover">
					<view class="flex ">
						<view class="text-center h60 pt5" >
							<view class="bk-fuli fz18"></view>
							<b-btn type="text" text-color="#9E9E9E" @tap='$refs.reward.show()'>打赏</b-btn>
						</view>
						
						<view class="text-center h60 pt5">
							<view class="father">
								<view class="bIcon-comment fz18"></view>
								<view style="background-color: #343436;top:-5px;right:-3px" class="abs right fz12 h15">456</view>
							</view>
							<view>书评</view>
						</view>
						
						<view class="text-center h60 pt5">
							<view class="bk-gengduo fz18"></view>
							
							<b-popover placement="bottomRight" bg-color="#343436" border-color="#343436" width="120">
								<template slot="target">
									 <b-btn type="text" text-color="#9E9E9E">更多</b-btn>
								</template>
								<view class="">
									<view class="flex lt text-center pb10">
										<view class="bk-shuqian mr10"></view>
										<view>添加书签</view>
									</view>
									
									<view class="flex lt text-center pb10">
										<view class="bk-wp-sj-2 mr10"></view>
										<view>书籍详情</view>
									</view>
									
									<view class="flex lt text-center pb10">
										<view class="bk-VIP mr10"></view>
										<view>去广告</view>
									</view>
									
									<view class="flex lt text-center">
										<view class="bk-chakantiezigengduojubao mr10"></view>
										<view>举报</view>
									</view>
								</view>
							</b-popover>
							
							
						</view>
						
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed bottom plr ptb30" style="background-color: #343436;color: #BABABA;display: none;">
			<view class="flex mb">
				<view class="w50">上一章</view>
				<view class="cover">
					<slider value="30" @change="showNumber" activeColor="#FEA00A" block-size='18' block-color='#BABABA' backgroundColor="#BABABA" ></slider>
				</view>
				<view class="w50">下一章</view>
			</view>
			
			<view class="flex">
				<view class="text-center">
					<view class="bk-mulu"></view>
					<view>目录</view>
				</view>
				
				<view class="text-center">
					<view class="bk-yueliang"></view>
					<view>夜间</view>
				</view>
				
				<view class="text-center">
					<view class="bk-liangdu"></view>
					<view>亮度</view>
				</view>
				
				<view class="text-center">
					<view class="bk-shezhi1"></view>
					<view>阅读设置</view>
				</view>
				
			</view>
		</view>
		
		<view class="fixed bottom pd" style="background-color: #262626;color: #BABABA;display: none;">
			<view class="flex lt mb">
				<view class="w50">字号</view>
				<view class="w200">
					<b-number  boxClass="" :step="1" :min="12" :max="30">
						<view class="rds20 ptb4 plr30 fz16 bold" style="background-color: #424242;" slot="subtract">A-</view>
						<view class="rds20 ptb4 plr30 fz16 bold" style="background-color: #424242;" slot="add">A+</view>
					</b-number>
				</view>
			</view>
			<view class="flex mb20">
				<view class="w50">背景</view>
				<view class="cover">
					
					<b-radio width="20%" type="tag" :list="['#F2E5D4','#D3E3D6','#fff','#3D3131','#2F3237']">
						<template v-slot:option="{title,checked}">
							<view class="father flex rt">
								<view class="rds w30 h30 father bd2" :class="{'mainBd' : checked}" :style="{'background-color':title}" >
									<view v-if="checked" class="abs bIcon-correct fz30 main" style="line-height: 52rpx;text-indent: -1px;"></view>
								</view>
							</view>
						</template>
					</b-radio>
					
				</view>
			</view>
			
			<view class="flex mb20">
				<view class="w50">间距</view>
				<view class="cover">
					<b-radio width="33.333%" type="tag" :list="['bk-jianju1','bk-jianju2','bk-jianju']">
						<template v-slot:option="{title,checked}">
							<view :class="{'main mainBd' : checked}" class="rds20 bd plr25 ptb4 fz16 text-center">
								<view :class="title"></view>
							</view>
						</template>
					</b-radio>
				</view>
			</view>
			
			<view class="flex ">
				<view class="w50">翻页</view>
				<view class="cover">
					<b-radio width="50%" type="tag" :list="['覆盖','左右平移']">
						<template v-slot:option="{title,checked}">
							<view :class="{'main mainBd' : checked}" class="rds20 bd plr25 ptb4 fz16 text-center">
								<view :class="title">{{title}}</view>
							</view>
						</template>
					</b-radio>
				</view>
			</view>
		</view>
		
		<b-drawer ref="reward" show-confirm='false' show-cancel='false' drawer-class="rdsT10 whiteBg" placement="bottom">
				<view class="flex">
					<view class="bIcon-arrowDown fz20"></view>
					
				</view>
				
				<view class="mtb">
					<view class="flex">
						<view class="w35">
							<b-image radius="100%" width="100%" src="/uni_modules/baker-app/static/novelPic.png"></b-image>
						</view>
						<view class="cover ml">
							<view class="flex lt">
								<view>悲秋</view>
								<view>
									<b-tag type="light" class="ml5 fz12">作者</b-tag>
								</view>
							</view>
							<view style="color: #5A5A5A;">感谢支持，您对本身的打赏是我写作的动力！</view>
						</view>
					</view>
				</view>
				
				
				<view>
					<b-radio :list="src" type="badge">
						<template v-slot:option="{title,checked,value}">
							<view>
								<image :src="checked?value:title" mode=""></image>
							</view>
						</template>
					</b-radio>
				</view>
				
		</b-drawer>
		
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				src:[
					{title:'bread2.png',value:'bread1.png'},
					{title:'cafe2.png',value:'cafe1.png'},
					
				]
			}
		},
		methods: {
			showNumber:function(e){
				
			}
		}
	}
</script>

<style>
.content{
	line-height: 25px;
	text-indent: 23px;
	text-align: justify;
	
	
}
</style>
