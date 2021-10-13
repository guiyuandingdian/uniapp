import showMixins from "./base-show-mixins.js" ;
import observer from "./base-observer-mixins.js" ;

export default {
	mixins : [showMixins , observer] ,
	data(){
		return {
			isInView : false 
		}
	},
	mounted() {
		this.$$onInView();
	},
	destroyed() {
		this.$$onOutView();
	},
	methods:{
		$onComponentShow(){
			this.$$onInView();
			this._disconnect();
			this._beforeCreate();
		},
		$onComponentHide(){
			this.$$onOutView();
			this._disconnect(); 
		},
		_$watch(rect , rate){
			if(rate <= 0){
				this.$$onOutView() ;
				return ;
			}
			this.$$onInView();
		},
		$$onInView(){
			this.isInView = true ;
		},
		$$onOutView(){
			this.isInView = false ;
		}
	}
}