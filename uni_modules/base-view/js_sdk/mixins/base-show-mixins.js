export default {
	
	// #ifndef MP-WEIXIN || MP-BAIDU 
	
	data(){
		return {
			pagePath : null 
		}
	},
	
	async created() {
		
		this.watchPageShow = uni.$b.once( this.watchPageShow , 200 , true) ;
		this.watchPageHide = uni.$b.once( this.watchPageHide , 200 , true ) ;
		
		//会触发多次created，但是destory却不会同步触发
		uni.$on("baseOnPageShow" , this.watchPageShow );
		uni.$on("baseOnPageHide" , this.watchPageHide );
	},
	
	beforeDestroy() {
		uni.$off("baseOnPageShow" , this.watchPageShow );
		uni.$off("baseOnPageHide" , this.watchPageHide );
	},
	
	// #endif
	
	async mounted(){
		this.pagePath = await uni.$b.getPagePath() ;
	},
	
	// #ifdef MP-WEIXIN || MP-BAIDU 
	onPageShow(){
		this.$onComponentShow();
	},
	
	onPageHide(){
		this.$onComponentHide();
	},
	// #endif
	
	methods:{
		
		// #ifndef MP-WEIXIN || MP-BAIDU 
		watchPageShow(path){
			if (!!this.pagePath && path === this.pagePath) {
				this.$onComponentShow(path);
			}
		},
		watchPageHide(path){
			if (!!this.pagePath && path === this.pagePath) {
				this.$onComponentHide(path);
			}
		},
		// #endif
		
		$onComponentShow(){},
		$onComponentHide(){}
	}
}