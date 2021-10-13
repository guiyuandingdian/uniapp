const { Controller } = require("base-cloud-v3");

module.exports = class ConfigController extends Controller {
	constructor(ctx) {
		super(ctx, "base_config");
	}

	async info() {
		let data = await this.table.findFirst();
		if (data && data.uid) {
			let user = (await this.service.userService.info(data.uid)) || {};
			if (user) {
				data.user = { username: user.username };
			}
		}
		return { data };
	}

	async save() {
		let uid = this.ctx.uid;
		this.ctx.data.uid = uid;
		await this.table.save();
		return this.ok("保存成功");
	}
};
