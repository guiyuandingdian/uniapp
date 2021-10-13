export default {
	props:{
		title : String ,
		titleClass : [String,Array] ,
		titleStyle : String ,
		errorContent : String ,
		titleWidth : [String , Number],
		scale : [String , Number],
		required: {
			type : [String,Boolean] ,
			default : undefined
		},
		requiredMark: {
			type : [String,Boolean] ,
			default : undefined
		},
		align: String ,
		position: [String , Array]
	}
}