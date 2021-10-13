function isAdmin(ctx) {
	return ctx.auth.userInfo.role && ctx.auth.userInfo.role.includes("admin");
}

function hasPermission(ctx) {
	let url = `${ctx.config.fnName}/${ctx.event.action}`; 
	return ctx.auth.permission && ctx.auth.permission.includes(url);
}

module.exports = () => {
	return async function permission(ctx, next) {
		if (ctx.auth && !isAdmin(ctx) && !hasPermission(ctx)) {
			ctx.throw("noPermission", "无访问权限");
		}
		await next();
	};
};
