<template>
	<view>
		
		<b-page ref="page" url="baker/user/history/page" v-slot:default="{list}">
			
			<view class="father pd10">
				
				<b-navigator class="flex cv mb shadow whiteBg rds7 pd father" url="/uni_modules/baker-app/pages/book/chapterInfo" :params="{bookId:item.bookId,chapterNumber:item.chapterNumber,pageIndex:item.pageIndex,fontSize:item.fontSize,lineHeight:item.lineHeight}" v-for="(item,index) in list" :key="index">
					<view v-if="item.addShelf" class="abs top right">
						<b-tag tag-class="rdsBl13 rdsTr7 fz12 ptb5 plr8 fz12" :color-index="1" bag-img="linear-gradient(to right , #f2ca5b , #ffe292)"  text-color="#6c4404" show-border="false" type="light">
							已在书架
						</b-tag>
					</view>
					<baker-cover :src="item.cover" width="80" :tag="item.updated ? '更新' : ''"></baker-cover>
					<view class="cover ml15 flex vertical t">
						<view class="fz16">
							{{item.name}}
							<view class="break gray fz12 mt5">
								<b-time class="inline" :date="item.updateTime" differ="month"></b-time>
								读到：{{item.title}}
							</view>
						</view>
						<view class="mt2 flex w100p">
							<view class="yellow fz12">继续阅读 ></view>
							<view @tap.stop="()=>{}">
								<b-btn v-if="!item.addShelf" class="fz12" radius="23" ptb="5" plr="13"
									url="baker/user/history/addShelf" 
									:params="{bookId:item.bookId}"
									@success="$set(item , 'addShelf' , true)">加入书架</b-btn>
							</view>
						</view>
					</view>
				</b-navigator>
				
			</view>
			
		</b-page>
		
	</view>
</template>

<style lang="scss">
	page{
		background-color: #f1f1f1;
	}
</style>