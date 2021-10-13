<template>
	<view class="flex" @tap="$emit('change')">
		<view class="cover">
			<view  class="flex mt cv">
				<baker-cover :src="item.cover" width="60" :tag="item.updated ? '更新' : ''"></baker-cover>
				<view class="cover ml15 flex vertical t">
					<view class="fz16">
						{{item.name}}
						<view v-if="item.isRead" class="break gray fz12 mt5">
							<b-time class="inline" :date="item.updateTime" differ="month"></b-time>
							读到：{{item.title}}
						</view>
						<view v-else class="clip c2 gray fz12" style="max-height: 76rpx;">
							{{item.intro}}
						</view>
					</view>
					<view v-if="item.isRead" class="yellow mt2 fz12">继续阅读 ></view>
					<view v-else class="gray fz12 flex w100p">
						<view class="flex lt">
							<view>
								{{item.finished ? "已完结" : "连载中"}}
							</view>
							<view class="plr3">·</view>
							<baker-words v-if="isNovel" :words="item.words"></baker-words>
							<view v-else>{{item.area}}</view>
						</view>
						<view>尚未阅读</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="editing" class="w40 flex rt">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-bookshelf-item",
		props:{
			isNovel : {
				type : Boolean,
				default : true 
			} ,
			editing : Boolean ,
			item : {
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
