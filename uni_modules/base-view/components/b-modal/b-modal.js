import modalProps from './b-modal-props.js';
import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
export default {
	mixins : [ mediaMixins , modalProps ] ,
	data() {
		return {
			// #ifdef MP-TOUTIAO
			refId : uni.$b.buuid() ,
			// #endif
			// #ifndef MP-TOUTIAO
			refId : "modal" ,
			// #endif
			maskInitValue : false ,
			initValue : false ,
			scopedData : {} ,
			isShowSync : false ,
			safeArea:{} ,
			status : "",
			countdownTimer:-1,
			counter : 0
		}
	},
	
	computed:{
		
		ts(){
			return uni.$b.getTrues.call(this , "roundBtn" , "showClose" , "mask" , "showConfirm" , "showCancel" , "destoryOnHide" , "closeByMask") ;
		},
		
		dvs(){
			return this.getDvs("placement","btnType","modalClass","headerClass","bodyClass","footerClass","btnAlign");
		},
		
		pvs(){
			return this.getPvs(["top","bottom","minHeight","maxHeight","height","gutter"] , this.safeArea.height );
		},
		
		slots(){
			return uni.$b.getSlots.call(this , "header" , "footer");
		},
		
		showHeader(){
			return this.slots.header || !!this.title || this.ts.showClose ;
		},
		
		showFooter(){
			return this.slots.footer || this.ts.showCancel || this.ts.showConfirm ;
		},
		
		_btnRadius(){
			return this.ts.roundBtn ? 100 : 4 ;
		},
		
		confirmSecs(){
			let mix = this.countdown - this.counter  ;
			return mix >= 0 ? mix : 0 ;
		},
		
		confirmDisabled(){
			return this.confirmSecs > 0 ;
		},
		
		_confirmText(){
			let text = uni.$b.isNull(this.confirmText) ? uni.$b.localeB("modal.confirm") : this.confirmText ;
			return this.confirmDisabled ? `${text}(${this.confirmSecs}s)` : text ;
		},
		
		_cancelText(){
			return uni.$b.isNull(this.cancelText) ? uni.$b.localeB("modal.cancel") : this.cancelText ;
		},
		
		_width(){
			let gutter = parseFloat(this.pvs.gutter) || 0 ;
			return this.pv(this.width , this.safeArea.width - gutter * 2 ) ;
		},
		
		fixedStyle(){
			return uni.$b.getStyle({ 
				'z-index' : this.zIndex  , 
				'margin-top' : this.pvs.top ,
				'margin-bottom' : this.pvs.bottom
			});
		},
		
		zIndexStyle(){
			return uni.$b.getStyle({
				'z-index' : this.zIndex 
			});
		},
		
		_modalStyle(){
			return uni.$b.getStyle({ 
				'width' : this._width 
			} , this.modalStyle );
		},
		
		scrollStyle(){
			return  uni.$b.getStyle({
				"height" : this.pvs.height ,
				"min-height": this.pvs.minHeight ,
				"max-height": this.pvs.maxHeight 
			});
		},
		
		btnClass(){
			let align = {
				"right" : "rt" ,
				 "left" : 'lt' ,
				 "center" : 'ct' ,
				 "around" : "ar" ,
				 "between" : ''
			}[this.dvs.btnAlign];
			return `${this.dvs.footerClass} ${align}`;
		}
		
		
	},
	
	watch:{
		value(isShow , o){
			isShow = uni.$b.isTrue(isShow) ;
			if(this.isShowSync === isShow){
				return ;
			}
			this.$nextTick(()=>{
				if (isShow) {
					this.show() ;
				}else{
					this.hide() ;
				}
			});
		},
		
		mask(){
			this.maskInitValue = this.isShowSync ;
		}
	},
	
	created() {
		let value = uni.$b.isTrue(this.value) ;
		this.initValue = value ;
		this.maskInitValue = value ;
		this.isShowSync = value ;
		
		this.$resize() ;
	},
	
	methods: {
		
		$resize(){
			//获取屏幕宽度
			this.safeArea = uni.$b.getSafeArea() ;
			
			// #ifdef H5
			uni.onWindowResize( uni.$b.onceByOnce( (res)=>{
				this.safeArea = uni.$b.getSafeArea() ;
			} , 300 ) ) ;
			// #endif
		},
		
		_$emit(type){
			this.$emit( type , {type} );
		},
		
		_onClose(){
			this.hide();
			this._$emit("close");
		},
		
		_onMask(e){
			if(this.ts.closeByMask){
				this.hide();
			}
		},
		
		_onCancel(){
			this._$emit("cancel");
		},
		
		_onConfirm(){
			if (this.confirmDisabled) {
				return ;
			}
			this._$emit("confirm");
		},
		
		_onChange(isShow){
			this.status = "" ;
			this.isShowSync = isShow ;
			if ( !isShow && this.ts.destoryOnHide ) {
				this.scopedData = {} ;
			}
			if (isShow) {
				this._startCount();
			}else{
				this._stopCount();
			}
			this.$onChange(isShow);
		},
		
		_startCount(){
			if (this.countdown <= 0) {
				return ;
			}
			this._stopCount();
			this.countdownTimer = setInterval(()=>{
				this.counter ++ ;
				if (this.counter >= this.countdown) {
					clearInterval(this.countdownTimer);
				}
			},1000);
		},
		
		_stopCount(){
			this.counter = 0 ;
			clearInterval(this.countdownTimer);
		},
		
		_controllBody(isShow){
			// #ifdef H5
			if (isShow) {
				document.body.style.overflow = 'hidden' ;
			}else{
				document.body.style.overflow='';
			}
			// #endif
		},
		
		$onChange(isShow){
			this.$emit("change" , isShow);
			this.$emit("input" , isShow);
			this.$emit( isShow ? "show" : "hide" , isShow);
		},
		
		_beforeChange(isShow){
			this.$beforeChange(isShow) ;
			this._controllBody(isShow);
			if (isShow) {
				this.status = "showing" ;
				this.$emit("beforeShow" , true );
				return ;
			}
			
			this.status = "hiding" ;
			this.$emit("beforeHide" , false );
		},
		
		$beforeChange(){},
		
		toggle(callBack , data){
			if (this.status == 'showing') {
				return this.hide(callBack) ;
			}
			if (this.status == 'showing') {
				return this.show(callBack , data) ;
			}
			if (this.isShowSync) {
				this.hide();
			}else{
				this.show();
			}
		},
		
		hide( callBack ){
			let bodyRef = `${this.refId}_body` ;
			let maskRef = `${this.refId}_mask` ;
			this.$refs[bodyRef] && this.$refs[bodyRef].hide(callBack);
			this.$refs[maskRef] && this.$refs[maskRef].hide();
		},
		
		/**
		 * @description 手动调用该方法时，可以传入该参数赋值给modal
		 * @param {Object} data
		 */
		show( callBack , data ){
			//允许只传入一个参数
			if (uni.$b.isObject(data)) {
				this.scopedData = uni.$b.clone(data) ;
			}else if (uni.$b.isObject(callBack)) {
				this.scopedData = uni.$b.clone(callBack) ;
			}
			
			let bodyRef = `${this.refId}_body` ;
			let maskRef = `${this.refId}_mask` ;
			this.$refs[bodyRef] && this.$refs[bodyRef].show(callBack , data);
			this.$refs[maskRef] && this.$refs[maskRef].show();
		}
	}
	
}