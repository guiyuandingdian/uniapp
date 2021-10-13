import requestMixins from "./base-request-mixins.js" ;

export default {
	mixins : [requestMixins] ,
	props : {
		datasKey : {
			type : [String,Boolean],
			default(){
				return uni.$b.getValue("response.datasKey" , "data") ;
			}
		}
	},
	data(){
		return {
			data : {} 
		}
	},
	methods: {
		/**
		 * 列表数据加载成功
		 */
		success(res){
			this.data = !!this.datasKey ? uni.$b.getDeepVal( res , this.datasKey , {}) : res ;
			this.inited = true ;
			this.$handleSuccess(res);
		},
		
		//提供给子组件覆盖使用
		$handleSuccess(res){}
	}
	
}