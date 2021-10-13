<template>
	<view>
		
		<button @tap="showShareMenu" open-type="share" class="rds25 ptb10 shareBtn">
			立即邀请好友
		</button>
		
		<!-- 分享菜单 -->
		<b-share ref="shareMenus" v-model="showSharePanel" :type="2" :mpweixin="mpweixin" :miniProgram="miniProgram" :more="false"
			:imageUrl="data.baker_share_poster" :title="title" :summary="summary" :href="href" :zIndex="30">
			
			<!-- 预览邀请海报 -->
			<template slot="content">
				<view class="h100p flex ct">
					<b-image ref="previewImg" :src="data.baker_share_poster" mode="widthFix" width="400rpx"></b-image>
				</view>
			</template> 
			<!-- 预览邀请海报 -->
			
		</b-share>
		<!-- 分享菜单 -->
		
		
		<block v-if="!data.baker_share_poster">
			
			<!-- 海报绘制模板 -->
			<view class="fixed top op0 left" style="left:-200%">
				<baker-poster :data="data.fissionData" :inviteCode="data.my_invite_code" :isRpx="true" @success="onGetPoster"></baker-poster>
			</view>
			
		</block>
		
		
		
	</view>
</template>

<script>
	import appShare , { closeShare } from './zhouWei-appShare.js' ;
	export default {
		name:"baker-share" ,
		props:{
			data:{
				type : Object,
				default(){
					return {};
				}
			}
		},
		data() {
			return {
				tempImg : "" ,
				showSharePanel : false ,
				waitShare : false
			}
		},
		computed: {
			fissionData(){
				return this.data.fissionData || {} ;
			},
			title() {
				return this.fissionData.title || "" ;
			},
			summary() {
				return this.fissionData.summary || "" ;
			},
			href() {
				return this.fissionData.downloadUrl || "" ;
			},
			miniProgram(){
				return {
					id : this.fissionData.mpId ,
					path : this.fissionData.path 
				};
			},
			mpweixin(){
				return !!this.fissionData.mpId ;
			}
		},
		methods: {
			
			async showShareMenu(){
				// #ifdef APP-PLUS
				this.showAppShareMenu();
				// #endif
				
				// #ifdef H5
				uni.setClipboardData({
					data: this.href ,
					success: (e) => {
						uni.showToast({
							title:"邀请链接已复制"
						})
					}
				})
				// #endif
			},
			
			onGetPoster(img){
				this.tempImg = img ;
				if (this.waitShare) {
					this.waitShare = false ;
					this.showAppShareMenu();
				}
			},
			
			async showAppShareMenu(){
				let imgUrl = await this.getImageUrl();
				if (!imgUrl) {
					return ;
				}
				
				this.showSharePanel = true ;
			},
			
			async getImageUrl(){
				let imageUrl = this.data.baker_share_poster ;
				if (!!imageUrl) {
					return imageUrl ;
				}
				
				uni.showLoading({
					title:"请稍候...",
					mask:true 
				})
				if (!this.tempImg) {
					this.waitShare = true ;
					return ;
				}
				
				//上传到云空间
				let time = this.data.fissionData.updateTime ;
				let { fileID } = await this.uploadImg(time);
				
				//更新用户的分享图片
				this.bakerApi.saveSharePoster(fileID , time);
				this.data.baker_share_poster = await this.getTempUrl(fileID) ;
				this.data.baker_share_poster_time = time ;
				return fileID ;
			},
			
			saveAlumb(){
				this.$refs.previewImg.save();
				this.showSharePanel = false ;
			},
			
			uploadImg(time){
				return new Promise((resolve) => {
					uniCloud.uploadFile({
						filePath: this.tempImg ,
						cloudPath: `${this.data.my_invite_code}_${time}.png` ,
						success: async (e) => {
							resolve(e);
						},
						fail: (e) => {
							uni.hideLoading();
							uni.$b.showToast(e.message);
							console.log("err: ",e); 
						}
					});
				})
			},
			
			async getTempUrl(fileID){
				let {fileList} = await uniCloud.getTempFileURL({
				    fileList: [fileID]
				});
				return fileList[0].tempFileURL ;
			}
		}
	}
</script>


<style lang="scss">
	.shareBtn{
		font-size: 16px;
		letter-spacing: 2px;
		color: #e9153e;
		font-weight: bold;
		background-image: linear-gradient(#ffe38e, #fec44d);
		box-shadow: 0 2px 10px #482f9c;
	}
</style>