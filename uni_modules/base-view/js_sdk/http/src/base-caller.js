import { Request } from "./base-request.js" ;
import { deepMerge } from "../../object/src/base-object.js" ;
import { setParamsToData } from "./base-http-params.js";
import { isNull , isObject , isFn } from "../../validate/src/base-type.js" ;

let isLoadingStatus = false ; //全局loading状态

class Caller extends Request {
	
	/**
	 * @description 从url中解析云函数名称和请求路径
	 * @param {String} url
	 */
	dealUrl( url ){
		var index = url.indexOf("/");
		return {
			name : index == -1 ? url : url.substr(0, index) ,
			action : index == -1 ? "" : url.substr(index + 1)
		};
	}
	

	/**
	 * @description 远程请求
	 * @return {Promise}
	 */
	getRequest({name , action , data , success , fail , complete , token}){
		let params = {
			action ,
			data 
		};
		
		this.setTokenData(params , token ) ;
		
		return new Promise((resolve,reject)=>{
			uniCloud.callFunction({
				name ,
				data: params
			}).then(res=>{
				isFn(success) && success(res.result) ;
				resolve(res);
			}).catch(err=>{
				isFn(fail) && fail(err) ;
				reject(err);
			}).finally(res=>{
				isFn(complete) && complete(res) ;
			});
		})
	}
	
	setTokenData(params , token ){
		if (token) {
			params.uniIdToken = token ;
			return ;
		}
		let tokenKey = uni.$b.getValue("tokenKey","uniIdToken") ;
		params.uniIdToken = uni.getStorageSync(tokenKey) ;
	}

}

export { 
	Caller
};