const Controller = require("base-cloud-v3").Controller;
const uniID = require("uni-id");

module.exports = class UserController extends Controller {
	constructor(ctx) {
		super(ctx, "uni-id-users");
		this.uniIdToken = this.ctx.event.uniIdToken;
		this.userService = this.service.userService;
		this.logService = this.service.loginLogService;
		this.captchaService = this.service.captchaService;
	}

	/**
	 * 校验用户状态
	 * 1. 是否需要登录
	 * 2. 是否需要验证码
	 * 3. 是否已创建超级管理员
	 */
	async checkLoginStatus() {
		let uniIdToken = this.uniIdToken ; 
		let { code, message, token, tokenExpired } = await uniID.checkToken({
			token: uniIdToken
		});

		//TOKEN有效，无需再次登录
		if (code === 0) {
			return {
				message: "已登录",
				uniIdToken: token,
				tokenExpired,
				hasAdmin: true
			};
		}

		//查询是否已创建超级管理员
		let hasAdmin = await this.userService.hasAdmin();

		//校验是否需要验证码，需要验证码则生成验证码
		let captcha = await this.captchaService.getNecessaryCaptcha(hasAdmin);

		return { code: "fail", message, hasAdmin, captcha };
	}

	/**
	 * 用户登录
	 * 登录失败返回图片验证码：captchaBase64
	 * 登录成功返回TOKEN：uniIdToken、permissions、userInfo、menus
	 */
	async login() {
		const { username, password, captcha } = this.ctx.data;

		//验证验证码
		let invalidMsg = await this.captchaService.loginInvalid(captcha);
		if (invalidMsg) {
			return invalidMsg;
		}

		//登录校验
		let {
			code,
			message,
			token,
			tokenExpired,
			uid,
			userInfo
		} = await uniID.login({
			username,
			password,
			needPermission: true,
			queryField: ["username", "mobile", "email"]
		});

		//保存登录日志
		await this.logService.save(uid, code === 0);

		//登录失败
		if (code !== 0) {
			return message;
		}

		//登录成功，返回菜单、权限、token数据
		let {
			menus,
			groups,
			permissions
		} = await this.service.roleService.getMenuAndPermission(userInfo.role);

		return {
			user: {
				username: userInfo.username,
				avatar: userInfo.avatar,
				role: userInfo.role
			},
			menus,
			groups,
			permissions,
			uniIdToken: token,
			tokenExpired,
			message
		};
	}

	async logout() {
		await uniID.logout(this.uniIdToken);
	}

	/**
	 * 初始化项目时创建超级管理员账号
	 */
	async createAdmin() {
		const { username, password } = this.ctx.data;
		const hasAdmin = await this.userService.hasAdmin();
		if (hasAdmin) {
			return "超级管理员已存在";
		}
		let {uid} = await uniID.register({
			username,
			password,
			role: ["admin"]
		});
		await uniID.updateUser({
			uid,
			status: this.enums.UserStatus.normal,
			nickname: username,
			gender: 1,
			comment: "超级管理员"
		});
	}
};
