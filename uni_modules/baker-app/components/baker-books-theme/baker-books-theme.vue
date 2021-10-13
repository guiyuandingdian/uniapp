<template>
	<view>
		
		<baker-recommend-title :data="data"></baker-recommend-title>
		
		<block v-if="data.theme == 1">
			<baker-books-theme-1 :data="data"></baker-books-theme-1>
		</block>
		<block v-else-if="data.theme == 2">
			<baker-books-theme-2 :data="data"></baker-books-theme-2>
		</block>
		<block v-else-if="data.theme == 3">
			<baker-books-theme-3 :data="data"></baker-books-theme-3>
		</block>
		<block v-else-if="data.theme == 4">
			<baker-books-theme-4 :data="data"></baker-books-theme-4>
		</block>
		
	</view>
</template>

<script>
	export default {
		name:"baker-books-theme",
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
