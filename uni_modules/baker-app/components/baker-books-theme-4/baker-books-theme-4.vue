<template>
	<view>
		
		<baker-books-display v-if="showFirstData" :data="firstData"></baker-books-display>
		
		<view class="gridSm g4">
			
			<view class="item plr5" v-for="(item,index) in list" :key="index">
				<baker-books :flag="flag" :data="item"></baker-books>
			</view>
			
		</view>
		
		
	</view>
</template>

<script>
	export default {
		name:"baker-books-theme-4",
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
			}
		},
		computed: {
			list() {
				return this.data.books.filter((_,index) => index > 0); 
			},
			firstData(){
				return this.data.books.length > 0 ? this.data.books[0] : null ;
			},
			showFirstData(){
				return null != this.firstData ;
			}
		},
	}
</script>

<style>

</style>
