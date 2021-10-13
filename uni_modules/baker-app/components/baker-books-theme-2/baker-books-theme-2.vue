<template>
	<view>
		<baker-books-block :data="item" v-for="( item , index) in data.books" :key="item._id"></baker-books-block>
	</view>
</template>

<script>
	export default {
		name:"baker-books-theme-2",
		props:{
			data:{
				type : Object ,
				default(){
					return {} ;
				}
			}
		}
	}
</script>
