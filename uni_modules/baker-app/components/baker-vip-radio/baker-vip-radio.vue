<template>
	<view>
		<b-list url="baker/api/vip/list" :cache="true" mode="remote" @load="listLoad">
			<scroll-view class="noBreak" :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="`s_${curIndex}`">
				<view @tap="curIndex = index;" :id="`s_${index}`" class="w120 inline" :class="{'ml10' : index > 0}" v-for="( item , index) in list" :key="index">
					<baker-vip :item="item" :active="curIndex == index"></baker-vip>
				</view>
			</scroll-view>
		</b-list>
	</view>
</template>

<script>
	export default {
		name:"baker-vip-radio",
		props:{
			value : {
				type : Object ,
				default (){
					return {} ;
				}
			}
		},
		data() {
			return {
				curIndex : 0 ,
				list : []
			}
		},
		computed: {
			vipData() {
				return this.list[this.curIndex] || {} ;
			}
		},
		watch:{
			vipData:{
				handler(){
					this.$emit("input" , this.vipData);
				},
				deep : true 
			}
		},
		methods: {
			listLoad({list}){
				this.list = list;
				this.$emit("load" , list);
				let productIds = list.map(item => item.productId).filter(item => !!item) ;
				this.$emit("getProducts" , productIds);
			}
		}
	}
</script>
