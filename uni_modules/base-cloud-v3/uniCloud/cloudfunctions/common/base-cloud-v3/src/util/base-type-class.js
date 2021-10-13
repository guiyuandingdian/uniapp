const toString = Function.prototype.toString ;

function fnBody(fn) {
	return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '') ;
}

function isClass(fn) {
	if (typeof fn !== 'function') {
		return false
	}

	if (/^class[\s{]/.test(toString.call(fn))) {
		return true
	}

	const body = fnBody(fn)
	return (/classCallCheck\(/.test(body) || /TypeError\("Cannot call a class as a function"\)/.test(body)) ;
}

module.exports = isClass ;
