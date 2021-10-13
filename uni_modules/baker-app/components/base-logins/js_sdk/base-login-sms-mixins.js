export default {
	props:{
		scene : String,
		btnText : String,
		action:String,
		sendSmsUrl:String,
		needPermission:Boolean,
		value : String
	},
	data() {
		return {
			mobile: "" ,
			mobileFocus : true
		}
	},
	watch: {
		value:{
			handler(newValue, oldValue) {
				if (newValue) {
					this.mobile = newValue ;
				}
			},
			immediate : true 
		},
		mobile(newValue, oldValue) {
			if (newValue) {
				this.$emit("input", newValue);
			}
		}
	},
	
	computed: {
		errMsg() {
			if (!this.mobile) {
				return "请输入手机号码" ;
			}
			return !uni.$b.isMobile(this.mobile) ? "手机号码错误" : "" ;
		},
		mobileCorrect(){
			return !this.errMsg ;
		}
	},
	methods: {
		showError(){
			uni.$b.showTips(this.errMsg);
			this.mobileFocus = false ;
			this.$nextTick(()=>{
				this.mobileFocus = true ;
			})
		}
	}
}