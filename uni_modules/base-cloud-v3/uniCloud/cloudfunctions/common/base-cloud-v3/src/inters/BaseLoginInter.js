const { isObject } = require("../util");
module.exports = (args = {}) => {
	let { invalidTokenCode = "invalidToken" , uniID } = args;
	if (!uniID) {
		throw new Error("uniID is required for BaseLoginInter")
	}
	
	// 返回中间件函数
	return async function auth(ctx, next) {
		// 校验 token
		let uniIdToken = ctx.event.uniIdToken ;
		const auth = await uniID.checkToken(uniIdToken);

		// 校验失败，抛出错误信息
		if (auth.code) {
			ctx.throw(invalidTokenCode, "尚未登录，请登录后继续操作");
		}

		// 设置当前请求的 auth 对象
		ctx.auth = auth;
		ctx.uid = auth.uid;
		delete ctx.auth.userInfo.token ;

		// 执行后续中间件
		await next();

		//下发新的token到客户端
		const { token, tokenExpired } = auth;
		if (token && tokenExpired && isObject(ctx.body)) {
			Object.assign(ctx.body, {
				refreshUniIdToken : token ,
				refreshTokenExpired : tokenExpired
			});
		}
	};
};
