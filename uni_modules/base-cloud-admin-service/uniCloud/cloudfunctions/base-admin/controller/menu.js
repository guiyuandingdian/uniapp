const Controller = require("base-cloud-v3").Controller;
const cmd = uniCloud.database().command;

module.exports = class MenuController extends Controller {
	constructor(ctx) {
		super(ctx, "base_menu");
		this.menuService = this.service.menuService;
		this.operateService = this.service.operateLogService;
	}

	//保存数据
	async save() {
		let res = await this.menuService.save();

		//生成日志清单
		await this.operateService.create();

		return res;
	}

	async batchSave() {
		//添加导航菜单
		let {
			parentId,
			title,
			subTitle,
			baseUrl,
			url,
			openType,
			sort,
			platform
		} = this.ctx.data;
		let baseKey = baseUrl.replace(new RegExp("/", "g"), "_");
		let menuId = `${baseKey}_list`;
		await this.menuService.save({
			menuId,
			parentId,
			title,
			subTitle,
			url,
			openType,
			sort,
			platform,
			level: 3,
			permissions: [{ url: `${baseUrl}/list`, saveLog: false }]
		});

		//保存编辑菜单
		await this.menuService.save({
			parentId: menuId,
			title: "编辑",
			level: 4,
			menuId: `${baseKey}_edit`,
			permissions: [{ url: `${baseUrl}/save`, saveLog: true }]
		});

		//保存删除菜单
		await this.menuService.save({
			parentId: menuId,
			title: "删除",
			level: 4,
			menuId: `${baseKey}_delete`,
			permissions: [{ url: `${baseUrl}/remove`, saveLog: true }]
		});

		//生成日志清单
		await this.operateService.create();
	}

	async list() {
		return await this.menuService.list();
	}

	/**
	 * 为角色分配权限时展示的菜单列表
	 */
	async listForAuth() {
		let select = "_id,title,parentId,menuId,level,remark,sort";
		return { list: await this.menuService.listAll({ select }) };
	}

	/**
	 * 查询指定Level菜单选项列表
	 */
	async listByLevel() {
		let { level } = this.ctx.data;
		let list = await this.table.list({
			select: "title,menuId as value",
			where: { level },
			orderBy: "sort"
		});
		return { list };
	}

	async remove() {
		//根据_id查询当前菜单数据
		let menuData = await this.table.findById();
		if (null == menuData) {
			return "菜单数据不存在";
		}

		//根据menuId查询下级菜单列表
		let children = await this.table.list({
			select: "_id",
			where: { parentId: menuData.menuId }
		});

		if (children.length > 0) {
			return "请先删除子菜单";
		}

		let res = await this.table.remove();

		//生成日志清单
		await this.operateService.create();

		return res;
	}

	async saveFromPlugins() {
		const { menuData } = this.ctx.data;
		await this.table.collection.add(menuData);
	}

	async exportData() {
		let list = await this.table.list({
			unselect: "_id,createTime,updateTime",
			where: { menuId: cmd.in(this.ctx.data.ids) }
		});
		return { list };
	}
};
