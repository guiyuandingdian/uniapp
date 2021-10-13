<template>
	<view class="ptb5">
		<b-tab
			 mode="local"
			 :list="list"
			 class="bold fz18"
			 :ptb="5"
			 :plr="plr"
			 :color='activeColor'
			 :active-color='activeColor'
			 :value="value"
			 :show-track='false' 
			 bar-width="20"
			 bar-class="barActiveBg"
			 bar-height='3'
			 :duration="400"
			 active-class="fz20 bold"
			 :loading="{show:false}"
			 @change="$emit('change' , $event)"></b-tab>
	</view>
</template>

<script>
	export default {
		name:"baker-home-channels",
		props:{
			value : {
				type : Number ,
				default : 0
			},
			cacheKey : {
				type : String ,
				default : "baker_home_channels"
			},
			apiName : {
				type : String ,
				default : "getRecommendChannels"
			}
		},
		data() {
			return {
				list : [{"title":"推荐","value":0},{"title":"男频","value":1},{"title":"女频","value":2},{"title":"出版","value":3}]
			};
		},
		computed: {
			plr() {
				// #ifdef MP-WEIXIN
				return 9 ; 
				// #endif
				
				// #ifdef APP-PLUS || H5
				return 15 ; 
				// #endif
			},
			activeColor(){
				return uni.$b.getValue("components.mainInverse")
			}
		},
		created() {
			if (this.apiName == "getChannels") {
				this.list = [{"title":"男频","value":1},{"title":"女频","value":2},{"title":"出版","value":3}];
			}
			this.loadData();
		},
		methods:{
			async loadData(){
				//本地存储
				let list = uni.getStorageSync(this.cacheKey) ;
				if (!!list) {
					this.list = list ;
				}
				//远程更新
				list = await this.bakerApi[this.apiName]();
				uni.setStorageSync(this.cacheKey , list ) ;
				this.list = list ;
				this.$emit("load" , this.list );
			}
		}
	}
</script>
<style lang="scss">
	/deep/ .barActiveBg{
		background-color: $activeColor!important;
	}
</style>