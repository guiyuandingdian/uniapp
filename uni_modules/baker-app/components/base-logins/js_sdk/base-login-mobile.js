export default {
	data(){
		return {
			mobileBind: true
		}
	},
	created(){
		this.setMobileBind();
	},
	methods: {
		setMobileBind(){
			// #ifdef APP-PLUS || MP-WEIXIN
			let user = uni.getStorageSync("base-user");
			this.mobileBind = !user || user.mobileBind ;
			// #endif
		}
	}
}