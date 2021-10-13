<template>
	<view>
		
		<b-modal ref="modal" :show-close="false" @change="onChange" width="540rpx" in-class="fadeInUpSm">
			
			<view slot="header" class="abs top" style="top: -70px;">
				<view class="w150 center-block">
					<view class="square">
						<image src="/uni_modules/baker-app/static/light.png" mode="aspectFit" class="animate infinite circle w200 h200 abs" style="animation-duration: 6s;"></image>
						<view class="abs flex ct">
							<image :src="img" mode="widthFix" class="w70"></image>
						</view>
					</view>
				</view>
			</view>
			
			
			<view class="text-center pt80">
				<view class="ptb10 fz18 plr10">+{{coin}}金币</view>
				<view class="grey plr20">
					{{remark}}
				</view>
			</view>
			
			<template slot="footer">
				
				<slot v-if="slots.default"></slot>
				<view v-else class="flex ct ptb40">
					
					<b-btn 
						radius="40" 
						ptb="8" 
						width="110"
						@tap="hide()">我知道啦</b-btn>

				</view>
			
			</template>
			
		</b-modal>
		
	</view>
</template>

<script>
	export default {
		name:"baker-get-coin",
		props:{
			remark : {
				type : String,
				default:"观看视频任务完成，奖励已到账。"
			}
		},
		data() {
			return {
				coin : 0 ,
				img : ""
			};
		},
		computed: {
			slots() {
				return uni.$b.getSlots.call(this , "default"); 
			}
		},
		methods:{
			show(coin , img){
				this.coin = coin ;
				this.img = img || "/uni_modules/baker-app/static/coin.png" ;
				this.$refs.modal.show();
			},
			hide(){
				this.$refs.modal.hide();
			},
			onChange(isShow){
				if (!isShow) {
					this.$emit("hide" , false );
				}else{
					this.$emit("show" , true);
				}
			}
		}
	}
</script>
