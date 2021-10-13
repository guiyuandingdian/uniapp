const BaseController = require("./BaseController");

class BasicController extends BaseController {
	constructor(ctx, name, uidKey = "uid") {
		super(ctx, name);
		this.ctx.uidKey = uidKey;
		this.uid = this.ctx.uid;
		this.userWhere = { [uidKey]: this.uid };
	}

	async info() {
		return {
			data: await this.table.findById(this.ctx.data)
		};
	}

	async save() {
		return await this.table.save();
	}
	
	async saveBySort() {
		await this.table.setSort();
		return await this.table.save();
	}

	async list() {
		return {
			list: await this.table.list()
		};
	}
	
	async listBySort() {
		return {
			list: await this.table.list({
				orderBy: "sort"
			})
		};
	}

	async page() {
		return {
			page: await this.table.paginate()
		};
	}

	async remove() {
		return await this.table.remove();
	}

	async batchRemove() {
		return await this.table.batchRemove();
	}

	async clear() {
		return await this.table.clear();
	}

	async infoByUid() {
		return {
			data: await this.table.findFirst({
				...this.ctx.data,
				where: {
					_id: this.ctx.data._id,
					...this.userWhere
				}
			})
		};
	}

	async saveByUid() {
		return await this.table.saveByUid();
	}

	async listByUid() {
		let where = this.ctx.data.where || {};
		Object.assign(where, this.userWhere);
		return {
			list: await this.table.list({
				...this.ctx.data,
				where
			})
		};
	}

	async pageByUid() {
		let where = this.ctx.data.where || {};
		Object.assign(where, this.userWhere);
		return {
			page: await this.table.paginate({
				...this.ctx.data,
				where
			})
		};
	}

	async removeByUid() {
		return await this.table.removeByUid();
	}

	async batchRemoveByUid() {
		return await this.table.batchRemove({
			...this.ctx.data,
			...this.userWhere
		});
	}
}

module.exports = BasicController;
