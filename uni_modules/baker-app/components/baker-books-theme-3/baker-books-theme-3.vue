<template>
	<view>
		<baker-books-multi :cols="4" :list="data.books" :showRate="true"></baker-books-multi>
	</view>
</template>

<script>
	export default {
		name:"baker-books-theme-3",
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
