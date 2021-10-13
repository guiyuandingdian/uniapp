<template>
	<view class="base-cloud" style="display: inline-block;">
		
		<view class="father" v-if="showVersion" @tap.stop="toUpdate">
			版本{{version}}
			<view class="abs top right" v-if="updateData.updated" style="top: -3px;right: -7px;">
				<view class="w7 h7 rds redBg"></view>
			</view>
		</view>
		
		
		<b-modal ref="modal" width="600rpx" v-model="show" @change="hide" :zIndex="30"
			:show-close="false" modal-class="" :show-cancel="false" :show-confirm="false" max-height="1000px" in-class="zoomInSm" out-class="zoomOutSm">
			
			<view class="pt50 pb150">
				
				<view class="rds12" :style="{'background-color':color}">
					<view class="father">
						<view class="h120  father hidden">
							<view class="abs top left left50p">
								<image src="./static/cloudRight.png" mode="aspectFit" class="clouds  animated goAway infinite"></image>
							</view>
							<view class="abs top right right50p">
								<image src="./static/cloudLeft.png" mode="aspectFit" class="clouds  animated goAwayLeft infinite"></image>
							</view>
							<image class="abs top30 left30 w10 h10 animated infinite fadeOut slow" src="./static/star.png" mode="widthFix" ></image>
							<image class="abs top60 left80 w10 h10  animated infinite fadeOut slowest delay-1s" src="./static/star.png" mode="widthFix" ></image>
							<image class="abs top20 right20 w10 h10  animated infinite fadeOut slower delay-2s" src="./static/star.png" mode="widthFix" ></image>
							<image class="abs top20 right50 w30 h30 animated fadeOutRight infinite slowest" src="./static/smallCloud.png" mode="widthFix" ></image>
							<image class="abs top30 left50 w30 h30 animated fadeOutRight infinite slow8 " src="./static/smallCloud.png" mode="widthFix" ></image>
						</view>
						<view class="abs bottom animated bounceUp infinite">
							<view class="animated goUp delay-06s">
								<image src="./static/airship.png" mode="aspectFit" class="airShip center-block father z3"></image>
								<view class="father" style="top: -10rpx;">
									<view class="animated infinite splashOut delay-03s">
										<image src="./static/shipAir.png" mode="aspectFit" class="shipAir center-block"></image>
									</view>
									<view class="abs">
										<view class="w40  center-block animated infinite splashOut delay-03s">
											<image src="./static/shipAir.png" mode="aspectFit" class="shipAir center-block"></image>
										</view>
									</view>
									<view class="abs">
										<view class="w40 center-block animated infinite splashOut delay-06s">
											<image src="./static/shipAir.png" mode="aspectFit" class="shipAir"></image>
										</view>
									</view>
									<view class="abs bottom bottom-60">
										<view class="w40 center-block animated infinite splash delay-03s">
											<image src="./static/shipGas.png" mode="aspectFit" class="shipGas"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view class=" whiteBg hidden plr20 father z3 rdsBr12 rdsBl12" :class="{'pb100':progress <= 0 || progress >= 100 || completed}">
						<view class="ptb10 fz16 bold">
							<block v-if="progress == 0">
								{{title}} （v{{version}}）
							</block>
							<block v-else-if="progress <=100 && !completed">
								
								<view>
									<view class="fz30 normal avanti pt15 text-center">
										{{progress.toFixed(2)}}
										<text class="fz12 ml2">
											%
										</text>
									</view>
									
									<view class="text-center pb40 op8 gray fz14 normal">
										版本更新中，不要离开...
									</view>
								</view>
								
							</block>
							<view class="text-center pt15" v-else-if="completed">
								版本升级成功
								<view class="pb40 op8 gray fz14 normal pt5">
									更新已完成，请重启应用体验新版
								</view>
							</view>
						</view>
						<scroll-view scroll-y="true" class="h80 autoY pb20"  v-if="progress == 0">
							<text>
								{{updateData.versionRemark ? updateData.versionRemark : defaultContent}}
							</text>
						</scroll-view>
						<view class="pd50 pt25" v-else-if="progress < 100">
							 <view class="grayBg bd rds23">
								 <view class="grayBg rds23">
								 	<view class="ptb3 rds23" :style="{width:progress+'%','background-color':color}"></view>
								 </view>
							 </view>
						</view>
						<view class="father">
							<view class="abs top left50p  roundBox rds text-center"  :style="{'background-color':color}">
								<view class="pt30" v-if="!completed">
									<button hover-class="op9" @tap.stop="download" class="btn whiteBg line rds23 inline plr40 ptb8 fz16">
										立即升级
									</button>
								</view>
								<view class="pt30" v-else>
									<button hover-class="op8" @tap.stop="restart" class="btn whiteBg line rds23 inline plr40 ptb8 fz16">
										立即重启
									</button>
								</view>
							</view>
						</view>
					</view>
					
				</view>
				
				<view class="op9 father" v-if="progress == 0">
					<view class="abs">
						<view class="flex ct ">
							<view class="h30 bl3 whiteBd"></view>
						</view>
						<view class="flex  ct bIcon-close fz35 white father" @tap.stop="hideModal" style="top: -12upx;"></view>
					</view>
				</view>
				
				
			</view>
			
		</b-modal>
		
		
		
		
	</view>
</template>

<script>
	export default {
		name:"base-version-update" ,
		props:{
			title : {
				type : String ,
				default : "发现新版本"
			},
			defaultContent : {
				type : String ,
				default : "快来升级，体验最新的功能吧！"
			},
			showVersion : {
				type : Boolean ,
				default : true 
			},
			autoShow : Boolean,
			cache:{
				type : Boolean ,
				default : true 
			},
			updateUrl : {
				type : String ,
				default : "base-app-version/api/version/check"
			},
			color : {
				type : String ,
				default : "#219EFB"
			}
		},
		data() {
			return {
				show : false ,
				version : "1.0.0" ,
				updateData : {},
				progress : 0 ,
				completed : false ,
				inData : null 
			};
		},
		computed: {
			platform() {
				return uni.getSystemInfoSync().platform == "ios" ? "ios" : "android" ;
			}
		},
		created() {
			this.checkVersion();
		},
		methods:{
			
			checkVersion(e){
				// #ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					this.version = widgetInfo.version ;
					this.queryVersion();
				});
				// #endif
				// #ifdef H5
				this.queryVersion();
				// #endif 
			},
			
			async queryVersion(e){
				let res = await uni.$b.call({
					cache : this.cache ,
					url : this.updateUrl ,
					data : { versionName : this.version , platform : this.platform },
					loading:{ show : false }
				});
				this.updateData = res ;
				if (this.updateData.updated) {
					this.version = this.updateData.versionName ;
					if ( this.autoShow ) {
						this.showModal();
					}
				}
				if (uni.$b.isDev() && this.updateData.message == '无版本信息') {
					console.warn("开发环境调试信息：暂无版本信息");
				}
			},
			
			showModal(){
				this.show = true ;
				uni.hideTabBar();
			},
			
			hideModal(){
				this.show = false ;
				uni.showTabBar();
				// #ifdef H5
				document.body.style.overflow = "auto" ;
				// #endif
			},
			
			toUpdate(e){
				if (!this.updateData.updated) {
					uni.showToast({
						title: '已是最新版本',
						icon : 'none'
					});
					return ;
				}
				this.showModal();
			},
			
			download(e){
				// #ifdef H5
				//测试使用
				let timer = setInterval(e => {
					this.progress += 3.5 ;
					if (this.progress >= 100) {
						clearInterval(timer);
						this.completed = true ;
					}
				},100);
				return ;
				// #endif
				
				//打开应用商店
				if (this.platform == "ios" && this.updateData.versionType == "native") {
					plus.runtime.openURL(this.updateData.versionUrl);
					return ;
				}
				
				const task = uni.downloadFile({
					url: this.updateData.versionUrl ,  
					success: (downloadResult) => {  
						uni.hideLoading();
						if (downloadResult.statusCode === 200) {
							this.install(downloadResult.tempFilePath);
							return ;
						} 
						this.downloadError(e);
					},
					fail : err => {
						this.downloadError(err);
					}  
				});
				
				task.onProgressUpdate((e)=>{
					this.progress = e.progress ;
				});
			},
			
			install(filePath){
				plus.runtime.install( filePath , {  force: false }, (e) => {
					console.log("install success e: ",e);
					this.downloadSuccess(e);
				}, (err) => {
					console.log("install fail err: ",err);
					this.downloadError(err);
				});
			},
			
			downloadError(e){
				this.hideModal();
				uni.$b.showModal({
					title:'提示',
					content:'更新失败，请稍后再试：' + JSON.stringify(e) ,
					showCancel:false,
					confirmColor:'#414cd9'
				});
			},
			
			downloadSuccess(e){
				this.completed = true ;
			},
			
			restart(e){
				this.hideModal();
				// #ifdef APP-PLUS
				plus.runtime.restart();
				// #endif
			},
			
			hide(isShow){
				if (!isShow) {
					this.progress = 0 ;
					this.completed = false ;
				}
			}
			
		}
	}
</script>

<style lang="scss">
	@import "./base-version-update.scss" ;
</style>
