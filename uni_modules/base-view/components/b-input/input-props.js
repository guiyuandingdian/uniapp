export default {
	props:{
		append : String,
		prepend : String,
		type : {
			type : [String,Array] ,
			default : "text"
		},
		readonly:[Boolean,String],
		trim : [Boolean,String],
		showPassword:{
			type : [ Boolean ,String] ,
			default : uni.$b.getValue("components.input.showPassword" , true ) 
		},
		clearable:{
			type : [Boolean,String],
			default : uni.$b.getValue("components.input.clearable" , true )  
		},
		maxlength : {
			type : [String,Number],
			default : -1
		},
		minlength : {
			type : [String,Number],
			default : -1
		} ,
		min : [String,Number] ,
		max : [String,Number] ,
		showCount : {
			type : [String , Boolean],
			default : true
		},
		confirmType : {
			type : String ,
			default : "done"
		} ,
		confirmHold : {
			type : Boolean ,
			default : false
		},
		selectionStart :{
			type : Number ,
			default : -1
		},
		selectionEnd:{
			type : Number ,
			default : -1
		},
		adjustPosition:{
			type : Boolean ,
			default : true
		},
		holdKeyboard:{
			type : Boolean ,
			default : false
		},
		autoBlur:{
			type : Boolean ,
			default : false
		},
		cursorSpacing:{
			type : Number ,
			default : 0
		},
		showConfirmBar : Boolean ,
		cursor : Number ,
		prefixIcon : String ,
		suffixIcon : String ,
		errorContent : String ,
		inputClass :{
			type : [String , Array],
			default(){
				return uni.$b.getValue("components.input.inputClass")
			}
		},
		inputStyle : String
	}
}