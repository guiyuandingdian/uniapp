const Service = require("base-cloud-v3").Service;

module.exports = class UserService extends Service {
	constructor(ctx) {
		super(ctx, "uni-id-users");
	}

	/**
	 * 判断是否已创建超级管理员
	 */
	async hasAdmin() {
		let data = await this.table.findFirst({
			select: "_id",
			where: { role: "admin" }
		});
		return null != data;
	}
};
