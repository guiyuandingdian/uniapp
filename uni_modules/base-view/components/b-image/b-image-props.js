export default {
	props:{
		width:{
			type : [String , Number , Array],
			default(){
				return "25%,20%,80"
			}
		},
		height : {
			type : [String,Number , Array] ,
			default(){
				return "100%" ;
			}
		},
		mode:{
			type:String,
			default : "aspectFill"
		},
		src:String,
		loadingType : {
			type : String ,
			default(){
				return uni.$b.getValue("components.image.loadingType");
			}
		},
		defaultSrc:{
			type : String ,
			default(){
				return uni.$b.getValue("components.image.defaultSrc");
			}
		},
		defaultIcon:{
			type : String ,
			default(){
				return uni.$b.getValue("components.image.defaultIcon");
			}
		},
		errorSrc:{
			type : String ,
			default(){
				return uni.$b.getValue("components.image.errorSrc");
			}
		},
		errorIcon:{
			type : String ,
			default(){
				return uni.$b.getValue("components.image.errorIcon");
			}
		},
		lazyLoad:{
			type : [String,Boolean],
			default(){
				return uni.$b.getValue("components.image.lazyLoad");
			}
		},
		preview:[String,Boolean],
		imgClass:String,
		loadingDelay:{
			type : [String,Number],
			default(){
				return uni.$b.getValue("components.image.loadingDelay");
			}
		},
		fadeShow:[String,Boolean],
		pressSave:{
			type : [String,Boolean],
			default : false
		},
		pressOptions : [String,Array],
		scopeTitle:String,
		scopeRemark : String
	}
}