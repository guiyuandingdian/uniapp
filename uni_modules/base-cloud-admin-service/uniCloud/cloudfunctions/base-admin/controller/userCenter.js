const { BaseController } = require("base-cloud-v3");

module.exports = class UserController extends BaseController {
	constructor(ctx) {
		super(ctx, "uni-id-users");
		this.userService = this.service.userCenterService;
	}

	async switchStatus() {
		let user = await this.table.findById();
		if (null == user) {
			return "用户信息不存在";
		}

		if ( this.userService.isAdmin(user) && user.status == 0) {
			return "超级管理员不可禁用";
		}

		//待更新的数据
		let status = user.status == 0 ? 1 : 0;
		let data = {
			status,
			_id: this.ctx.data._id
		};

		//禁用时清空登录状态
		if (data.status == 1) {
			data.token = [];
		}

		return await this.table.update(data);
	}

	async save() {
		let keepKeys = "username,password,role,_id,mobile,comment,email,gender," +
						"realname_auth.real_name,realname_auth.identity";
		let data = this.keep(keepKeys);
		let { _id, role, mobile } = data;

		if (!role || role.length == 0) {
			return "请选择角色";
		}

		//校验用户名唯一
		let isUniqueName = await this.table.isUnique({ field: "username", data });
		if (!isUniqueName) {
			return "用户名已存在";
		}

		//处理密码，密码为空表示不重置密码
		this.userService.resetPassword(data);

		//新建用户，状态为正常
		if (this.$b.isNull(_id)) {
			data.status = 0;
			data.nickname = data.username;
		}

		if (mobile) {
			data.mobile_confirmed = 1;
		}

		return await this.table.save(data);
	}

	async genders() {
		return {
			list: this.enums.UserGender.list
		};
	}

	async remove() {
		let data = await this.table.findById();
		if (this.userService.isAdmin(data)) {
			return "超级管理员账号不可删除";
		}
		return await this.table.remove();
	}

	async page() {
		let page = await this.table.paginate({
			select: "username,mobile,email,role,realname_auth.real_name,realname_auth.identity,comment,last_login_date,status,gender",
			join: {
				unwind:"role",
				from: "uni-id-roles",
				as: "roles",
				on: "roles.role_id = role",
				type: "Array",
				select: "role_name as roleName"
			}
		});

		page.list.forEach((item) => {
			item.genderName = this.enums.UserGender.title(item.gender);
			item.roleName = item.roleName.join("、");
		});

		return { page };
	}

	async menus(){
		let role = this.ctx.auth.userInfo.role ;
		return await this.service.roleService.getMenuAndPermission(role);
	}

	async userInfo(){
		let userData = this.ctx.auth.userInfo ;
		let data = this.$b.keep(userData , "username,gender,role,realname_auth,mobile,email,comment,avatar");
		return {data};
	}

	async modify(){
		this.keep("gender,realname_auth,mobile,email,comment,avatar");
		this.ctx.data._id = this.ctx.uid ;
		return await this.table.save();
	}

	async removeAvatar(){
		let avatar = this.ctx.auth.userInfo.avatar ;
		if (!avatar) {
			return ;
		}
		let res = await uniCloud.deleteFile({
			fileList: [avatar]
		});
		return res.success ;
	}
};
