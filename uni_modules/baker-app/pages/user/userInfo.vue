<template>
	<view>
		<baker-user-data ref="userData" v-slot:default="{data , logined}">
			
			<b-form class="pt10">
				
				
				<view class="pl whiteBg">
					<view class="flex pr">
						<view>头像</view>
						<view class="flex lt ptb9" @tap="uploadAvatar">
							<b-image class="rds hidden" :src="data.avatar" default-src="/static/header.jpg" mode="aspectFill" :width="34"></b-image>
							<view class="bIcon-arrowRight gray fz12 ml10"></view>
						</view>
					</view>
					
					<view class="flex ptb bt pr" @tap="$refs.form.show(data);">
						<view>昵称</view>
						<view class="flex lt">
							<view class="gray">{{data.nickname}}</view>
							<view class="bIcon-arrowRight gray fz12 ml10"></view>
						</view>	
					</view>
					
					<view class="father">
						<view class="flex ptb bt pr">
							<view>性别</view>
							<view class="flex lt">
								<view class="gray">{{data.genderStr}}</view>
								<view class="bIcon-arrowRight gray fz12 ml10"></view>
							</view>	
						</view>
						<view class="abs op0">
							<b-picker @change="setGender" align="left" title-class="black" :title-width="65" title="性别" :list="list" mode="local" :required-mark="false"></b-picker>
						</view>
					</view>
					
				</view>
			</b-form>
			
			
			
			
			
			<baker-logins mode="bindMobile">
				<view class="flex whiteBg pl mt10">
					<view class="w30">
						<view class="bIcon-mobileFill blue fz20 mr10 "></view>
					</view>
					<view class="cover ptb pr">
						<view class="flex">
							<view>绑定手机号码</view>
							<view class="flex rt gray">
								<view class="mr">使用手机号一键登录</view>
								<view class="bIcon-arrowRight fz12"></view>
							</view>
						</view>
					</view>
				</view>
			</baker-logins>
			
			<baker-logins mode="bindWeixin">
				<view class="flex whiteBg pl mt10">
					<view class="w30">
						<view class="bIcon-wechatFill green fz20 mr10 "></view>
					</view>
					<view class="cover ptb pr">
						<view class="flex">
							<view>绑定微信</view>
							<view class="flex rt gray">
								<view class="mr">使用微信一键登录</view>
								<view class="bIcon-arrowRight fz12"></view>
							</view>
						</view>
					</view>
				</view>
			</baker-logins>
			
			<baker-logins mode="bindApple">
				<view class="flex whiteBg pl mt10">
					<view class="w30">
						<view class="bk-pingguo1 fz20 mr10 "></view>
					</view>
					<view class="cover ptb pr">
						<view class="flex">
							<view>绑定苹果账号</view>
							<view class="flex rt gray">
								<view class="mr">使用苹果账号一键登录</view>
								<view class="bIcon-arrowRight fz12"></view>
							</view>
						</view>
					</view>
				</view>
			</baker-logins>
			
			
			<view class="pl whiteBg">
				
				<view class="flex ptb pr btItem" v-if="data.bindMobile">
					<view>手机</view>
					<view class="flex lt ptb9">
						{{data.mobile}}
						<!-- <view class="bIcon-arrowRight gray fz12 ml10"></view> -->
					</view>
				</view>
				
				<view class="flex ptb pr btItem" v-if="data.bindWeixin">
					<view>微信</view>
					<view class="flex lt">
						<view class="gray">已绑定</view>
						<!-- <view class="bIcon-arrowRight gray fz12 ml10"></view> -->
					</view>	
				</view>
			
				<view class="flex ptb pr btItem" v-if="data.bindApple">
					<view>苹果账号</view>
					<view class="flex lt">
						<view class="gray">已绑定</view>
						<!-- <view class="bIcon-arrowRight gray fz12 ml10"></view> -->
					</view>	
				</view>

			</view>

			<navigator url="/uni_modules/baker-app/pages/user/cancelAccount" class="flex plr whiteBg mt10">
				<view class="flex lt ptb">
					注销账号
					<view class="ml7 gray fz12">注销后账号内数据无法恢复，请谨慎操作</view>
				</view>
				<view class="bIcon-arrowRight gray fz12 ml10"></view>
			</navigator>
			
			
			<view class="whiteBg flex ct ptb mt10">
				<b-btn type="text" color="#F74F0E" url="base-login/common/quit" confirm="确认退出登录吗？" @success="onQuit">退出登录</b-btn>
			</view>
			
		</baker-user-data>
		
		<b-modal-form ref="form" action="baker/user/user/setNickname" @success="onSuccess"
			title="修改昵称" :show-close="false" btn-type="coverBtn">
			
			<b-input title="昵称" name="nickname" :maxlength="20"></b-input>
			
		</b-modal-form>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list : [
					{title : "男生" , value : 1 } ,
					{title : "女生" , value : 2 } 
				]
			}
		},
		methods: {
			uploadAvatar(){
				uniCloud.chooseAndUploadFile({
					count:1,
					type:"image",
					onChooseFile: () => {
						uni.showLoading({
							title:"正在上传头像",
						});
					},
					success: async ({tempFiles}) => {
						let avatar = tempFiles[0].url ;
						await this.bakerApi.setAvatar(avatar);
						this.$refs.userData.update({avatar});
					},
					fail: (e) => {
						uni.$b.showToast("上传失败");
					},
					complete: (e) => {
						uni.hideLoading();
					}
				})
			},
			
			async setGender(e){
				let gender = e.detail.value ;
				let data = this.list.find(item => item.value == gender) ;
				this.$refs.userData.update({genderStr:data.title , gender});
				await this.bakerApi.setGender(gender);
			},
			
			onSuccess({formData}){
				this.$refs.userData.update(formData);
			},
			
			onQuit(){
				this.$refs.userData.quit();
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f1f1f1;
	}
	.btItem{
		margin-top: 20rpx;
		&+.btItem{
			margin-top: 0;
			border-top: 1px solid #f1f1f1;
		}
	}
</style>
