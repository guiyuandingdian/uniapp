export default {
	props : {
		countdown:{
			type : Number ,
			default : 0
		},
		value:{
			type : [Boolean,String] ,
			default : false 
		},
		destoryOnHide:{
			type : [Boolean,String] ,
			default : true 
		},
		showClose:{
			type : [Boolean,String] ,
			default : true 
		},
		//动画执行时间
		duration:{
			type : [Number,String] ,
			default : 300 
		},
		mask:{
			type : [Boolean,String] ,
			default : true 
		},
		closeByMask:{
			type : [Boolean,String] ,
			default : true 
		},
		zIndex:{
			type : [String , Number],
			default : 18
		},
		placement:{
			type : [String,Array],
			default(){
				return "center"
			}
		},
		title:String ,
		top : [Array,String,Number],
		bottom : [Array,String,Number] ,
		modalStyle : String ,
		bodyStyle : String ,
		headerStyle : String ,
		modalClass : {
			type : [String,Array] ,
			default(){
				return uni.$b.getValue("components.modal.modalClass") ;
			}
		},
		footerClass : {
			type : [String,Array] ,
			default(){
				return uni.$b.getValue("components.modal.footerClass") ;
			}
		},
		headerClass : {
			type : [String,Array]  ,
			default(){
				return uni.$b.getValue("components.modal.headerClass") ;
			}
		},
		bodyClass : {
			type : [String,Array]  ,
			default(){
				return uni.$b.getValue("components.modal.bodyClass") ;
			}
		},
		closeIcon : {
			type : String ,
			default(){
				return uni.$b.getValue("components.modal.closeIcon") ;
			}
		},
		gutter : {
			type : [Array,String,Number] ,
			default : () => ['60rpx','20rpx','0']
		},
		width : {
			type : [Array,String,Number] ,
			default : () => ['100%','90%','80%','50%','800px']
		},
		height:{
			type : [Array,String,Number]
		},
		minHeight:{
			type : [Array,String,Number] ,
			default : () => '200rpx'
		},
		maxHeight:{
			type : [Array,String,Number] ,
			default : () => '70%'
		},
		//确认与取消按钮的样式类型
		btnType : {
			type : [Array,String] ,
			default : () => ['btn']
		},
		btnAlign:{
			type : [Array , String],
			default(){
				return ['center','right'] ;
			}
		},
		inClass:{
			type : String ,
			default : "zoomIn"
		},
		outClass:{
			type : String ,
			default : "zoomOut"
		},
		showConfirm:{
			type : [Boolean,String] ,
			default : true 
		},
		showCancel:{
			type : [Boolean,String] ,
			default : true 
		},
		confirmColor : {
			type : String ,
			default(){
				return uni.$b.getValue("components.confirmColor")
			}
		},
		cancelColor : {
			type : String ,
			default : "#333"
		},
		confirmText:String,
		cancelText:String ,
		roundBtn : [String,Boolean]
	}
}