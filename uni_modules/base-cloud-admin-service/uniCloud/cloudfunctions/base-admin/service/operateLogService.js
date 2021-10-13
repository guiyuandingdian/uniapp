const { Service } = require("base-cloud-v3");
const fs = require("fs");
const path = require("path");

module.exports = class OperateLogService extends Service {
	constructor(ctx) {
		super(ctx, "base_operate_log");
	}

	async create() {
		let data = await this.service.menuService.getLogUrls();

		let absPath = path.resolve(this.ctx.config.baseDir, "./operate.log.urls.json");
		fs.writeFileSync(absPath, JSON.stringify(data, null, 4), { encoding: "utf8" }, (err) => {});

		return { data };
	}
};
