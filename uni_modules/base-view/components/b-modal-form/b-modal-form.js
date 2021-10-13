import formMixins from "../b-form/b-form-mixins.js" ;

export default {
	mixins:[ formMixins ],
	props:{
		confirmType:{
			type : String ,
			default : "submit"
		},
		cancelType:{
			type : String ,
			default : "hide"
		}
	},
	
	data() {
		return {
			//表单是否已自动加载过数据
			formDataLoad : false ,
			valueSync : {}
		}
	}, 
	
	computed:{
		
		showConfirmBtn(){
			return this.ts.showConfirm && ( this.confirmType !== "submit" || this.hasSubmitAuth ) ;
		},
		
		showCancelBtn(){
			return this.ts.showCancel && ( this.confirmType !== "submit" || this.hasSubmitAuth ) ;
		},
		
		_confirmText(){
			return uni.$b.isNull(this.confirmText) ? uni.$b.localeB("form.submit") : this.confirmText ;
		},
		
		loadDataOnCreated(){
			return false ;
		}
	},

	
	methods: {
		
		$beforeChange(isShow){
			if ( isShow ) {
				if (this.loadDataOnCreated && !this.formDataLoad ) {
					//请求表单数据
					this.loadDataOnce() ;
					//如果隐藏销毁组件，则该值将在隐藏时重置为false
					this.formDataLoad = true ;
				}
			}
		},
		
		$onChange(isShow){
			if(isShow){
				this.setData(this.scopedData);
			}else if (this.ts.destoryOnHide) {
				this.formDataLoad = false ;
				this.scopedData = {} ;
				this.dataToSet = {} ;
				this.reset();
			}
			this.$emit("input" , isShow);
			this.$emit( isShow ? "show" : "hide" , isShow);
		},
		
		_onCancel(){
			this._onTapBtn("cancel");
		},
		
		_onConfirm(){
			this._onTapBtn("confirm");
		},
		
		_onTapBtn(type){
			this._$emit( type );
			let formType = this[`${type}Type`] ;
			if (!formType) {
				return ;
			}
			if (formType == 'hide') {
				this.hide() ;
				return ;
			}
			this[formType]() ;
		},
		
		//表单提交成功
		$handleSubmitSuccess(res){
			if (!uni.$b.isFalse(this.handled) && !uni.$b._isFailState(res)) {
				this.hide();
			}
		}
	}
}