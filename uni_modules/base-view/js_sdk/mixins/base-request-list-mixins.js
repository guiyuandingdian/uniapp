import requestMixins from "./base-request-mixins.js" ;

export default {
	mixins : [requestMixins] ,
	props:{
		list : {
			type : Array ,
			default(){
				return [] ;
			}
		},
		indexValue:{
			type:[String,Boolean],
			default : false
		},
		listKey :{ //远程加载列表数据的key
			type : String ,
			default(){
				return uni.$b.getValue("response.listKey" , "list")
			}
		},
		titleKey:{
			type : String ,
			default(){
				return uni.$b.getValue("components.titleKey")
			} 
		},
		valueKey:{
			type : String ,
			default(){
				return uni.$b.getValue("components.valueKey") ;
			}
		},
		remarkKey:{
			type : String ,
			default(){
				return uni.$b.getValue("components.remarkKey") ;
			}
		},
		disabledKey:{
			type : String ,
			default(){
				return uni.$b.getValue("components.disabledKey")
			}
		},
		mode:{
			type : String ,
			default : "remote"
		}
	},
	data(){
		return {
			listSync : []
		}
	},
	
	computed:{
		isRemoteMode(){
			return this.mode == 'remote' ;
		},
		isLocalMode(){
			return this.mode == 'local' ;
		},
		loadDataOnCreated(){
			return this.$ts.callOnCreated && this.isRemoteMode ;
		},
		isValue(){
			return !uni.$b.isTrue( this.indexValue ) ;
		},
		authListData(){
			return this.listSync.map((cur,_index)=>{
				return uni.$b.isObject(cur) ? { ...cur , _index } : {
					[this.valueKey] : cur ,
					[this.titleKey] : cur ,
					[this.remarkKey] : cur ,
					[this.disabledKey] : false ,
					_index
				}
			}).filter(item=>{
				return !item.auth || uni.$b.hasAuth(item.auth) ;
			});
		}
	},
	
	watch:{
		list:{
			handler(){
				if (this.isLocalMode) {
					this.listSync = this.list ;
					uni.$b.isFn(this.setFormData) && this.setFormData();
					return ;
				}
				if (uni.$b.isDev() && this.list.length > 0 ) {
					console.error( `【${this.$options.name}】当前mode不为local，不可使用list属性，当前mode为:${this.mode}`);
				}
			},
			immediate : true 
		}
	},
	
	mounted(){
		if (!!this.url && this.isLocalMode) {
			console.error( `【${this.$options.name}】当前mode为local，url属性无效，如需远程请求数据，请设置mode为remote。`);
		}
		if (this.isLocalMode) {
			this.inited = true ;
		}
	},
	
	methods: {
		/**
		 * 列表数据加载成功
		 */
		success(res){
			this.listSync = this.listKey ? uni.$b.getDeepVal( res , this.listKey , [] ) : res ;
			uni.$b.isFn(this.setFormData) && this.setFormData();
			this.inited = true ;
			this.$handleSuccess(res) ;
		},
		
		$handleSuccess(res){}
	}
	
}