import Vue from 'vue'
import App from './App'

//安装baseView并初始化全局配置
import baseView from 'uni_modules/base-view';
import config from "uni_modules/baker-app/js_sdk/baker-app-config.js" ;
import myConfig from "js_sdk/config.js" ;
Vue.use(baseView , Object.assign(config , myConfig));

//工具类
import baker from "uni_modules/baker-app/js_sdk/baker-app.js" ;
Vue.prototype.baker = baker ;

//贝壳阅读接口 
import bakerApi from "uni_modules/baker-app/js_sdk/baker-app-api.js" ;
Vue.prototype.bakerApi = bakerApi ;


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()






