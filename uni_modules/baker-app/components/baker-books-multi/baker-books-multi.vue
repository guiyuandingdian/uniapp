<template>
	<view class="grid" :class="curClass">
		
		<view class="item plr" v-for="(item,index) in list" :key="index">
			<baker-books :data="item" :showCategory="showCategory" :showRate="showRate"></baker-books>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"baker-books-multi",
		props:{
			list : {
				type : Array ,
				default(){
					return [] ;
				}
			},
			cols : {
				type : [String , Number] ,
				default : 3
			},
			showRate : Boolean,
			showCategory : Boolean
		},
		computed: {
			curClass() {
				return `g${this.cols}` ;
			}
		}
	}
</script>
