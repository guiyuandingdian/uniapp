export default {
	props: {
		value: [Number,String,Boolean]
	},
	data(){
		return {
			defaultValue : 14 ,
			valueSync : ""
		}
	},
	watch:{
		value:{
			handler(value){
				if (this.valueSync != value) {
					this.onChange({detail:{value}});
				}
			},
			immediate : true 
		}
	},
	methods: {
		onChange(e) {
			let value = e.detail.value;
			this.valueSync = value ;
			this.$emit("input", value);
			uni.setStorageSync( this.$options.name , value);
		}
	}
}
