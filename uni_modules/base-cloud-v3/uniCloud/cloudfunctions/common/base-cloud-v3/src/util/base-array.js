const { isArray , isNull } = require("./base-type");


/**
 * 数组合并、去重
 *  var m = [1, 2, 2], n = [2,3,3]; 
 *  console.log(combine(m)); // [1, 2]
 *	console.log(combine(m,n)); // [1, 2, 3]
 */
function combine() {
	let arr = [].concat.apply([], arguments);
	return Array.from(new Set(arr));
}

function flat (array , isCombine) {
	let list = [] ;
	array.forEach(curArr => {
		curArr = isArray(curArr) ? curArr : [] ;
		list.push(...curArr);
	});
	return isCombine ? combine(list) : list;
}

function parseArray (array , spliter=",") {
	if (isNull(array)) {
		return [] ;
	}
	if (isArray(array)) {
		return array ;
	}
	return array.split(spliter) ;
}

module.exports = {
	parseArray,
	combine,
	flat
};

