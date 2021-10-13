import {isObject , isArray} from "../../validate/src/base-type.js" ;

/**
 * @description 查询节点信息
 */
function queryRect(selector , vm , method ){
	return new Promise((resolve,reject)=>{
		uni.$b.getRoot().then(rootVm=>{
			vm = !!vm ? vm : rootVm ;
			let failData = {width : 0 , height : 0 , left : 0 , bottom : 0 , fail : true };
			if (!vm) {
				resolve(failData);
				return ;
			}
			//从组件或页面内查询节点信息
			vm.$nextTick(()=>{
				const query = uni.createSelectorQuery().in(vm);
				query[method](selector).boundingClientRect( data => {
					if (method == 'select' && !data) {
						data = failData ;
					}
					resolve(data);
				}).exec();
			});
		})
	});
}


function select(selector , vm){
	return queryRect(selector , vm , "select");
}


function selectAll(selector , vm){
	return queryRect(selector , vm , "selectAll");
}


export {
	select ,
	selectAll
}