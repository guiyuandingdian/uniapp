const Service = require("base-cloud-v3").Service;
const cmd = uniCloud.database().command ;
module.exports = class LoginLogService extends Service {
	constructor(ctx) {
        super(ctx, "base_login_log");
        this.deviceId = this.ctx.context.DEVICEID || this.ctx.context.CLIENTIP ;
	}

	/**
	 * 判断是否为超级管理员
	 */
	async hasAdmin() {
		let data = await this.table.findFirst({
			where: { role: "admin" },
			field: "_id"
		});
		return null != data;
	}

	/**
	 * 查询是否需要登录验证码
	 * 最近2小时一次登录记录为失败
	 */
	async needCaptcha() {
		let data = await this.table.findFirst({
			where: {
                deviceId: this.deviceId ,
                createTime : cmd.gt(Date.now() - 2 * 60 * 60 * 1000)
			},
			orderBy: "createTime desc"
		});
		return null != data && !data.isSuccess;
	}

	async save(uid, isSuccess) {
		await this.table.save({
			uid,
			isSuccess,
			deviceId: this.deviceId ,
			ip: this.ctx.context.CLIENTIP
		});
	}
};
