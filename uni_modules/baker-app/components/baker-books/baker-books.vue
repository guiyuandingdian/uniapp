<template>
	<view>
		<b-navigator :url="href" :params="{_id:data._id}">
			<baker-cover :src="data.cover" width="100%"></baker-cover>
			<view class="clip mt10 fz14" :class="showCategory || showRate ? 'c1' : 'c2'" style="color: #222222;">
				{{data.name}}
			</view>
			<view v-if="showCategory" class="fz12 gray mt5">{{data.categoryName}}</view>
			<view v-if="showRate" class="fz12 orange mt5">{{data.score ? data.score : '9.8'}}分</view>
		</b-navigator>
	</view>
</template>

<script>
	export default {
		name:"baker-books",
		props:{
			flag : {
				type : String ,
				default: "novel"
			},
			data:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			showRate : Boolean,
			showCategory : Boolean
		},
		computed:{
			href(){
				return {
					"novel" : "/uni_modules/baker-app/pages/book/bookInfo" ,
					"cartoon" : "/uni_modules/baker-app-cartoon/pages/cartoon/bookInfo"
				}[this.flag] ;
			}
		}
	}
</script>
