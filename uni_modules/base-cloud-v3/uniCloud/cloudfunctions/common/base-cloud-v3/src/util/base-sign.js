const { md5 } = require('./base-crypto.js') ;
const { notNull , isObject , isArray } = require("./base-type.js");
function getSignStr (data = {} , escapeKey = ["sign"] , join = '') {
	return Object.keys(data).sort().filter(key => !isObject(data[key]) && !isArray(data[key]) && notNull(data[key]) && !escapeKey.includes(key) ).map(key => `${key}=${data[key]}`).join('&');
}

function getFullSignStr ({data , secret , escapeKey , join , secretKey } = {}) {
	let signStr = getSignStr(data, escapeKey , join) ;
	return `${signStr}${join}${secretKey?secretKey+'=':''}${secret}` ;
}

function sign (config = {}) {
	let signStr = getFullSignStr(config);
	return md5(signStr).toUpperCase() ;
}

function verifySign (config = {}) {
	let {data, escapeKey , secret , join , secretKey , debug } = config ;
	let validSign = sign({data,secret, escapeKey, join , secretKey });
	let valid = !!config.sign && validSign === config.sign ;
	if (!debug) {
		return valid ;
	}
	let signStr = getFullSignStr(config);
	return {valid , signStr , validSign , sign : config.sign } ;
}

module.exports = {
	getSignStr ,
	sign ,
	verifySign
}