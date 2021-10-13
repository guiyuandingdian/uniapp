export default {
	list : {
		type : Array ,
		default : () => [] 
	},
	titleKey:{
		type : String ,
		default : () => uni.$b.getValue("components.titleKey") 
	},
	valueKey:{
		type : String ,
		default : () => uni.$b.getValue("components.valueKey")
	},
	disabledKey:{
		type : String ,
		default  : () => uni.$b.getValue("components.disabledKey")
	}
}