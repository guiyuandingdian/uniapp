import {clone} from "./base-object.js" ;


/**
 * 数组合并、去重
 *  var m = [1, 2, 2], n = [2,3,3]; 
 *  console.log(combine(m)); // [1, 2]
 *	console.log(combine(m,n)); // [1, 2, 3]
 */
export function combine() {
	let arr = [].concat.apply([], arguments);
	return Array.from(new Set(arr));
}

/**
 * 将值转为数组
 * @param {Object} value
 */
export function parseArray (value , spliter = ',') {
	if (uni.$b.isNull(value)) {
		return [] ;
	}
	if (uni.$b.isArray(value)) {
		return clone(value) ;
	}
	value += "" ;
	return uni.$b.isArrayStr(value) ? JSON.parse(value) : value.split(spliter) ;
}
