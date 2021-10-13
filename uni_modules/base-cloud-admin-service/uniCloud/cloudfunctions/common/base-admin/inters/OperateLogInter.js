const OperateLog = uniCloud.database().collection("base_operate_log");
const fs = require("fs");
const path = require("path");

async function getConfig(ctx, url) {
	//当前云函数为base-admin
	let absPath = path.resolve(ctx.config.baseDir, "./operate.log.urls.json");
	
	if (fs.existsSync(absPath)) {
		return require(absPath);
	}
	//当前访问接口为获取日志配置数据接口，该接口放行
	if (url == "base-admin/operateLog/getLogUrls") {
		return {} ;
	}
	//其他云函数从日志数据获取接口获取配置信息
	let { result } = await uniCloud.callFunction({
		name: "base-admin",
		data: {
			action: "operateLog/getLogUrls"
		}
	});
	return result.data;
}

module.exports = () => {
	
	return async function operateLogInter(ctx, next) {

		await next();

		//查询是否属于记录日志的路径
		let url = `${ctx.config.fnName}/${ctx.event.action}`;
		let config = await getConfig(ctx, url);
		let name = config[url];
		if (name) {
			await OperateLog.add({
				name,
				url,
				data: ctx.event.data,
				uid: ctx.uid,
				ip: ctx.context.CLIENTIP,
				createTime: Date.now()
			});
		}
	};
};
