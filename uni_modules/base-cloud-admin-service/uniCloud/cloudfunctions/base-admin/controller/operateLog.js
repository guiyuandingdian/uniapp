const { BaseController } = require("base-cloud-v3");
const fs = require("fs");
const path = require("path");

module.exports = class OperateLogController extends BaseController {
	
	constructor(ctx) {
		super(ctx, "base_operate_log");
		this.logService = this.service.operateLogService;
	}

	/**
	 * 生成日志清单
	 */
	async createLogUrls() {
		return await this.logService.create();
	}
	
	//获取本地日志清单
	async getLogUrls() {
		let data = {} ;
		let absPath = path.resolve( this.ctx.config.baseDir , "./operate.log.urls.json");
		if (fs.existsSync(absPath)) {
			data = require(absPath);
		}
		return { data } ;
	}

	async page() {
		let page = await this.table.paginate({
			range: ["createTime"],
			like: ["name", "url", "username"],
			join: {
				select: "username",
				from: "uni-id-users",
				as: "user",
				on: "user._id = uid"
			}
		});

		page.list.forEach((item) => {
			item.data = JSON.stringify(item.data);
		});

		return { page };
	}
};
