const { BaseController } = require("base-cloud-v3");

module.exports = class RoleController extends BaseController {
	constructor(ctx) {
		super(ctx, "uni-id-roles");
		this.roleService = this.service.roleService;
	}

	async save() {
		let data = this.ctx.data;

		//更新时不可修改内置类型、role_id
		if (data._id) {
			delete data.static;
			delete data.role_id;
		}

		//校验role_id唯一性
		let isUnique = await this.table.isUnique({ field: "role_id", required: false });
		if (!isUnique) {
			return "角色标识已存在";
		}

		//生成权限数据
		data.permission = await this.service.menuService.getPermissions(data.menuIds);

		//保存数据
		await this.table.save();
		
		//生成role_id，接入uni-id角色权限系统
		let role = await this.table.findById();
		if (!role.role_id) {
			await this.table.update({
				_id: role._id,
				role_id: role._id
			});
		}
	}

	async remove() {
		let data = await this.table.findById();
		if (null == data) {
			return "参数错误";
		}
		if (data.static) {
			return "内置角色不可删除";
		}
		return await this.table.remove();
	}

	async options() {
		return {
			list: await this.table.list({
				select: "role_name as title,role_id as value",
				orderBy: "createTime"
			})
		};
	}
};
