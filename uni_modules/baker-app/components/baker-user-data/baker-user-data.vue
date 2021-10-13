<template>
	<view>
		<slot :data="user" :logined="logined"></slot>
	</view>
</template>

<script>
	import {userStore} from "../../js_sdk/baker-user-store.js" ;
	export default {
		name:"baker-user-data" ,
		data() {
			return {
				logined : uni.$b.isLogin()
			}
		},
		computed: {
			user() {
				return userStore.state.user ;
			}
		},
		watch:{
			user:{
				handler(){
					this.$emit("change" , {
						user : this.user ,
						logined : this.logined
					});
				},
				immediate : true ,
				deep : true 
			},
			logined(){
				this.$emit("change" , {
					user : this.user ,
					logined : this.logined
				});
			}
		},
		created(){
			userStore.dispatch("loadData", {forceUpdate :true , showLoading : true });
			uni.$on("onUserStateChanged" , () => {
				this.logined = uni.$b.isLogin() ;
			});
		},
		methods:{
			quit(){
				uni.removeStorageSync(uni.$b.getValue("tokenKey"));
				uni.removeStorageSync(uni.$b.getValue("tokenExpiredKey"));
				uni.removeStorageSync("base-user");
				uni.removeStorageSync("base-menus");
				uni.removeStorageSync("base-permissions");
				userStore.commit("setData" , { user : {} , dataLoad : false });
				uni.$emit("onUserStateChanged");
				uni.$emit("base-logins-bind");
			},
			refresh(){
				userStore.dispatch("loadData" , {forceUpdate :true , showLoading : false });
			},
			update(data){
				userStore.commit("setData" , {
					user : Object.assign({},this.user,data)
				});
			}
		}
	}
</script>
