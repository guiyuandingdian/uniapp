const Service = require("base-cloud-v3").Service;
const cmd = uniCloud.database().command;

module.exports = class PostService extends Service {
	constructor(ctx) {
		super(ctx, "base_menu");
	}

	async list() {
		let list = await this.listAll();

		//数据处理
		list.forEach((item) => {
			item.platformName = this.enums.MenuPlatform.title(item.platform || "none");
		});

		//数据排序
		list = this.sortList(list);

		return {
			data: {
				platforms: this.enums.MenuPlatform.list,
				openTypes: this.enums.MenuOpenType.list,
				list
			}
		};
	}

	/**
	 * 菜单列表
	 */
	async listAll({ select, where = {} } = {}) {
		return await this.table.list({
			select,
			where,
			orderBy: "parentSort asc,sort asc",
			join: {
				select: "sort as parentSort",
				from: "base_menu as bm",
				on: "bm.menuId = parentId"
			}
		});
	}

	/**
	 * 插入子项菜单数据
	 * @param {Object} list
	 */
	children(list) {
		list.forEach((item, index) => {
			item.children = list.filter((child) => child.parentId == item.menuId);
		});
		return list;
	}

	/**
	 * 根据菜单层级、sort进行排序
	 * @param {Object} list 数据列表
	 */
	sortList(list) {
		this.children(list);
		let all = [];
		this.putChild(1, list, all);
		return all;
	}

	putChild(level, list, all) {
		list.forEach((item) => {
			if (item.level == level) {
				all.push(item);
				if (item.children.length) {
					this.putChild(level + 1, item.children, all);
				}
			}
		});
	}

	async save(data) {
		data = data || this.ctx.data;
		//校验唯一字段
		let isUnique = await this.table.isUnique({
			field: "menuId",
			data
		});
		if (!isUnique) {
			this.fail("菜单唯一标识已存在");
		}

		//插入自增的排序
		await this.table.setSort({
			data,
			where: {
				level: data.level
			}
		});

		//更新时检查是否更改了menuId
		await this.updateChildrenMenuId(data);

		//保存数据
		let isSuccess = await this.table.save(data);
		if (!isSuccess) {
			this.fail("数据保存失败");
		}

		//更新菜单相关的角色权限数据
		await this.service.roleService.updatePermissions(data.menuId);
	}

	async updateChildrenMenuId({ _id, menuId, level }) {
		if (!_id || level == 4) return;
		let { menuId: parentId } = await this.table.findById({ _id });
		//更新子菜单的parentId
		if (menuId != parentId) {
			await this.table.collection.where({ parentId }).update({ parentId: menuId });
		}
	}

	getMenuData(parentId, title, level, key, actions = []) {
		let { baseUrl, url, openType, sort } = this.params;
		let baseKey = baseUrl.replace(new RegExp("/", "g"), "_");
		return {
			parentId,
			title,
			url,
			openType,
			sort,
			level,
			permissions: actions.map((item) => ({
				url: `${baseUrl}/${item}`,
				saveLog: level == 4
			})),
			menuId: `${baseKey}_${key}`
		};
	}

	/**
	 * 根据菜单的menuIds查询菜单对应的所有权限列表
	 * @param {Array} menuIds 菜单menuId
	 * @returns {Array} 权限列表
	 */
	async getPermissions(menuIds) {
		let list = await this.table.list({
			select: "permissions.url",
			where: {
				menuId: cmd.in(menuIds)
			}
		});
		let permissions = list
			.map((item) => item.permissions)
			.reduce((all, cur) => {
				cur &&
					cur.forEach((ele) => {
						all.push(ele.url);
					});
				return all;
			}, []);
		return this.$b.combine(permissions);
	}

	async findByMenuIds(menuIds) {
		let where = {};
		if (menuIds) {
			where.menuId = cmd.in(menuIds);
		}
		let menus = await this.listAll({ where });

		let permissions = this.getPermissionData(menus);

		this.children(menus);

		return { menus, permissions };
	}

	getPermissionData(menus) {
		let permissions = this.$b.flat(menus.map((item) => item.permissions)).map((item) => item.url);
		return this.$b.combine(permissions);
	}

	/**
	 * 查询操作日志记录URL列表数据
	 */
	async getLogUrls() {
		let list = await this.table.list({
			unwind: "$permissions",
			select: "title,permissions,parentId,permissions.url as url",
			where: {
				"permissions.saveLog": true
			},
			join: {
				from: "base_menu",
				as : "bm",
				on : "bm.menuId = parentId" ,
				select: "title as parentTitle"
			},
			unselect: "permissions,parentId,_id"
		});
		return list.reduce((data, cur) => {
			data[cur.url] = `${cur.parentTitle} > ${cur.title}`;
			return data;
		}, {});
	}
};
