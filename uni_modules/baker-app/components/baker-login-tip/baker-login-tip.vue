<template>
	<view v-if="notLogin" class="grayBg rds4 pd10 flex mt20 ">
		<view class="w20 bIcon-userFill fz18 mr5" style="color: #FCB100;"></view>
		<view class="cover">{{tips}}</view>
		<baker-logins @success="notLogin=false;$emit('logined');">
			<view class="rds23 bd grayBd plr10 ptb3 fz12">去登录</view>
		</baker-logins>
	</view>
</template>

<script>
	export default {
		name:"baker-login-tip",
		props:{
			tips : {
				type : String ,
				default : "登录后书籍存在云端永不消失"
			}
		},
		data() {
			return {
				notLogin : !uni.$b.isLogin() 
			};
		},
		created() {
			uni.$on("onUserStateChanged" , () => {
				this.notLogin = !uni.$b.isLogin() ;
			});
		}
	}
</script>
