module.exports = (args = {}) => {
	return async function HttpInter(ctx, next) {
		if (ctx.context.SOURCE == "http") {
			ctx.throw("no access", "禁止访问");
		}
		await next();
	};
};
