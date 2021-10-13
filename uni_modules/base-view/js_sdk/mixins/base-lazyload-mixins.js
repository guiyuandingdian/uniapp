import watcher from './base-watcher-mixins.js' ;

export default {
	mixins : [watcher] ,
	data(){
		return {
			inView : false 
		}
	},
	computed:{
		_lazyLoad(){
			return uni.$b.isTrue(this.lazyLoad) ;
		}
	},
	methods:{
		_beforeCreate(){
			if (!this._lazyLoad || this.inView) {
				this.$onInView();
				return ;
			}
			this.$onObserve();
		},
		
		_$watch(rect , rate){
			if(rate <= 0){
				return ;
			}
			this.$onInView();
			this._disconnect();
			if (this._lazyLoad) {
				this.$onLazyLoad();
				this.$emit("lazyLoad");
			}
		},
		
		$onObserve(){
			this._createObserver();
		},
		
		$onInView(){
			this.inView = true ;
		},
		
		$onLazyLoad(){}
	}
}