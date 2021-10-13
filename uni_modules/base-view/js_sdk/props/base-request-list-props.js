export default {
	list : {
		type : Array ,
		default(){
			return [] ;
		}
	},
	indexValue:{
		type:[String,Boolean],
		default : false
	},
	listKey :{ //远程加载列表数据的key
		type : String ,
		default(){
			return uni.$b.getValue("listKey" , "list")
		}
	},
	titleKey:{
		type : String ,
		default(){
			return uni.$b.getValue("components.titleKey")
		} 
	},
	valueKey:{
		type : String ,
		default(){
			return uni.$b.getValue("components.valueKey") ;
		}
	},
	remarkKey:{
		type : String ,
		default(){
			return uni.$b.getValue("components.remarkKey") ;
		}
	},
	disabledKey:{
		type : String ,
		default(){
			return uni.$b.getValue("components.disabledKey")
		}
	},
	mode:{
		type : String ,
		default : "remote"
	}
}