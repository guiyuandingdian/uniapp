import labelProps from "../../components/b-label/label-props.js" ;
export default {
	...labelProps ,
	name : String ,
	value : {
		type : [String , Boolean , Number , Object , Array]  ,
		default : "" 
	},
	disabled:{
		type : [Boolean,String],
		default : undefined 
	},
	focus:{
		type : [Boolean,String],
		default : false 
	},
	valueType : [String , Function ] ,
	scale: [String , Number] ,
	validateTitle: String ,
	pattern: [String , RegExp] ,
	validator : [String , Function] ,
	confirmName: String ,
	blurCheck:{
		type : [String,Boolean] ,
		default : undefined
	},
	errorType:{//错误提示方式
		type : String ,
		validator(v){
			return uni.$b.isOneOf("error" , v , ['toast','underline']);
		}
	},
	emptyPrefix : String , //值为空时，提示信息的前缀
	errorMsg : [String,Object] , //校验失败时的提示语
	autoPlaceholder:{
		type : [String , Boolean],
		default : undefined
	},
	placeholderStyle: String ,
	placeholderClass: String ,
	placeholder: String ,
	sign:{
		type : [Boolean,String] ,
		default(){
			return uni.$b.getValue("components.form.sign" , false )
		}  
	}
}