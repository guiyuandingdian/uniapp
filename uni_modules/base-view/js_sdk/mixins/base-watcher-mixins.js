import showMixins from "./base-show-mixins.js" ;
import observer from "./base-observer-mixins.js" ;

export default {
	mixins:[ showMixins , observer ],
	methods:{
		
		$onComponentShow(path){
			setTimeout(()=>{
				this._beforeCreate();
			}, 50);
		},
		
		$onComponentHide(path){
			this._disconnect(); 
		}
	}
}