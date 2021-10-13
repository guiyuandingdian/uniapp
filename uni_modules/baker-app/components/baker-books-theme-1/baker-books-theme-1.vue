<template>
	<view>
		<baker-books-multi :list="data.books" :showCategory="true"></baker-books-multi>
	</view>
</template>

<script>
	export default {
		name:"baker-books-theme-1",
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
