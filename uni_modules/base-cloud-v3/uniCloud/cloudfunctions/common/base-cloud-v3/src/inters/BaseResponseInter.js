const {
	isUnstrictBoolean,
	isUnstrictTrue,
	isObject,
	isNull,
	isString
} = require("../util");

module.exports = (options = {}) => {
	let { codeKey = "code", messageKey = "message", success, fail } = options;
	success = success || { [codeKey]: "ok" };
	fail = fail || { [codeKey]: "fail", [messageKey]: "操作失败" };

	return async function response(ctx, next) {
		try {
			await next();
		} catch (error) {
			uniCloud.logger.error("error :>> ", error);
			ctx.body = { ...fail , [messageKey] : error.message } ;
			return ;
		}

		//服务端响应结果
		let body = ctx.body;

		//返回undefined
		if (isNull(body)) {
			ctx.body = success;
			return;
		}

		//返回1、0、true、false
		if (isUnstrictBoolean(body)) {
			ctx.body = isUnstrictTrue(body) ? success : fail;
			return;
		}

		//返回JSON
		if (isObject(body)) {
			ctx.body = Object.assign( {} ,success , ctx.body );
			return;
		}

		//返回字符串
		if (isString(body)) {
			ctx.body = { ...fail, [messageKey]: body };
		}
	};
};
