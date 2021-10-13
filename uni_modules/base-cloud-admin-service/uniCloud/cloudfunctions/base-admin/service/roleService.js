const {Service} = require("base-cloud-v3");
const cmd = uniCloud.database().command ;

module.exports = class RoleService extends Service {

	constructor(ctx) {
		super(ctx, "uni-id-roles");
	}

	isAdmin(role){
		return role && role.includes("admin") ;
	}

	/**
	 * 根据角色查询菜单数据、角色数据列表
	 * @param {Array}} role 角色IDs
	 * @returns 菜单数据、权限数据列表
	 */
	async getMenuAndPermission(role){
		if (this.isAdmin(role)) {
			return await this.service.menuService.findByMenuIds();
		}

		//查询角色对应的菜单数据
		let roles = await this.table.list({
			where: { role_id: cmd.in(role) },
			select : "menuIds"
		});

		console.log('roles :>> ', roles);

		//菜单数据
		let menuIds = this.$b.flat(roles.map((item) => item.menuIds) , true );
		return await this.service.menuService.findByMenuIds(menuIds);
	}

	/**
	 * 根据指定的菜单标识更新与该菜单相关的所有角色的权限
	 * @param {String} menuId 菜单标识
	 */
	async updatePermissions(menuId){
		if (!menuId) {
			return ;
		}
		let roles = await this.table.list({
			where : {
				menuIds : menuId
			},
			select : "menuIds"
		})

		for (let role of roles) {
			role.permission = await this.service.menuService.getPermissions(role.menuIds);
			await this.table.update(role);
		}
	}
	
};
