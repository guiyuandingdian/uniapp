<template>
	<view>
		
		<b-page ref="page" url="baker/api/book/page" v-slot:default="{list}" :call-on-created="false" :params="{name}" :show-empty="false">

			<view class="pd">
				
				<baker-books-block width="180rpx" :data="item" v-for="( item , index) in list" :key="item._id"></baker-books-block>
				
				<baker-empty v-if="list.length == 0"></baker-empty>
				
			</view>
			
		</b-page>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				name : ""
			}
		},
		onNavigationBarSearchInputChanged(e){
			this.name = e.text ;
			this.$refs.page.search();
		}
	}
</script>
