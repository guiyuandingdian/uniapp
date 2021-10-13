import baseView from "./js_sdk/index.js" ;
import pageMixins from "./js_sdk/mixins/base-page-mixins.js" ; 
import {setConfig} from "./js_sdk/config" ;
import {initLocale} from "./js_sdk/locale/src/base-locale.js" ;

const install = (Vue , config) => {
	Vue.mixin(pageMixins) ;
	
	//配置全局配置信息
	setConfig(config) ;
	
	//挂载对象
	uni.$b = baseView ;
	Vue.prototype.$b = baseView ;
}

export default {
	install ,
	initLocale
}