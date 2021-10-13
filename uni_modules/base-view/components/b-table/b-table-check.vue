<template>
	<view>
		
		<b-check :name="head.key" :value="text" :scale="head.scale">
			<block v-if="head.showData">
				{{text}}
			</block>
		</b-check>
		
	</view>
</template>

<script>
	export default {
		props:{
			head : Object ,
			item : Object 
		},
		computed:{
			text(){
				return this.head.isIndex ? this.item.index : (uni.$b.getDeepVal(this.item.data , this.head.key ) || '') ;
			}
		}
	}
</script>
