<template>
	<view v-if="!logined">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"baker-check-login",
		data() {
			return {
				logined : uni.$b.isLogin()
			};
		},
		created() {
			this.refresh();
		},
		methods:{
			refresh(){
				this.logined = uni.$b.isLogin() ;
				this.$emit("input" , this.logined );
			}
		}
	}
</script>
