export default {
	action:{
		type : String 
	},
	
	focusError:{ //提交表单校验错误时，是否将页面滑动并聚焦到该表单
		type : [Boolean,String] ,
		default : true 
	},
	
	blurCheck:{ //表单失去焦点时校验
		type : [String,Boolean] ,
		default : undefined
	},
	errorType: String ,
	autoReset:{ //提交表单成功后是否自动清空表单"all","justForm","none"
		type : String ,
		default : "none"
	},
	/**
	 * label props
	 */
	titleClass : [String,Array] ,
	titleWidth : [String , Number] ,
	requiredMark: {
		type : [String,Boolean] ,
		default : undefined
	},
	required: {
		type : [String,Boolean] ,
		default : undefined
	},
	align: String,
	position:[String,Array],
	/**
	 * input prop
	 */
	autoPlaceholder:{
		type : [String , Boolean],
		default : undefined
	},
	disabled:{
		type : [Boolean,String],
		default : undefined 
	},
	scale:{
		type : [String , Number],
		default : 1 
	},
	extraData : {
		type :  [String , Boolean] ,
		default : true 
	}
}