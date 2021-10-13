<template>
	<view>
		<block v-if="chooseChannel">
			
			<view class="fixed z20 whiteBg flex ct">
				<view class="w70p text-center">
					
					<view class="fz24">
						选个喜欢的书籍类型吧
					</view>
					
					<view class="mt10 gray">
						为您更精准的推荐书籍
					</view>
					
					<view class="ptb100 flex ct">
						<view>
							<image src="/uni_modules/baker-app/static/boy.png" mode="widthFix" class="w100 h100 m"></image>
							<b-btn @tap="choose(1,true)" radius="23" color="#0081ff" background-img="linear-gradient(to top , #4d83ed , #55beff)" text-color="#fff" min-width="80">男生</b-btn>
						</view>
						<view>
							<image src="/uni_modules/baker-app/static/girl.png" mode="widthFix" class="w100 h100 m"></image>
							<b-btn @tap="choose(2,true)" radius="23" color="#FF6D8A" background-img="linear-gradient(to top right , #fa5559 , #f98180)" text-color="#fff" min-width="80">女生</b-btn>
						</view>
					</view>
					
				</view>
			</view>
			
		</block>
		<block v-else>
			<slot></slot>
		</block>
	</view>
</template>

<script>
	export default {
		name:"baker-choose-channel",
		data() {
			return {
				channel : "" ,
				chooseChannel : false 
			};
		},
		computed:{
			checkInviteCode(){
				// #ifdef H5
				return false ;
				// #endif
				// #ifdef APP-PLUS
				return true ;
				// #endif
			}
		},
		created() {
			let channel = uni.getStorageSync("baker_channel") ;
			if (uni.$b.isNull(channel)) {
				this.onChooseChannel();
				return ;
			}
			this.choose(channel);
		},
		methods:{
			onChooseChannel(){
				if (uni.$b.getValue("chooseGender") !== false) {
					this.showChoosePanel();
				}else{
					this.choose(0 , this.checkInviteCode); //选择推荐频道
				}
			},
			showChoosePanel(){
				this.chooseChannel = true ;
				this.fullscreen();
				uni.hideTabBar();
			},
			choose(channel, setInviteCode){
				setInviteCode && this.setInviteCode();
				uni.setStorageSync("baker_channel",channel);
				this.channel = channel ;
				this.$emit("init" , this.channel);
				if (this.chooseChannel) {
					this.$nextTick(()=>{
						this.chooseChannel = false ;
						this.$nextTick(()=>{
							this.fullscreen();
							uni.showTabBar();
							// #ifdef H5
							document.body.style.overflow = "auto" ;
							// #endif
						});
					})
				}
			},
			setInviteCode(){
				uni.getClipboardData({
					success: ({data}) => {
						if (data && data.indexOf("iCode_") == 0) {
							uni.setStorageSync("baker_inviteCode" , data.replace("iCode_",""));
						}
					}
				})
			},
			fullscreen() {
				this.baker.fullscreen(this.chooseChannel);
			},
		}
	}
</script>
