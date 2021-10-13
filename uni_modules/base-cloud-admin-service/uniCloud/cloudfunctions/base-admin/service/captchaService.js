const Service = require("base-cloud-v3").Service;
const uniCaptcha = require("../plugins/uni-captcha"); //https://ext.dcloud.net.cn/plugin?id=4048#detail
module.exports = class CaptchaService extends Service {
	constructor(ctx) {
		super(ctx, "opendb-verify-codes");
		this.logService = this.service.loginLogService;
		this.deviceId = this.ctx.context.DEVICEID || this.ctx.context.CLIENTIP;
	}

	/**
	 * 登录验证码校验
	 */
	async loginInvalid(captcha) {
		let needCaptcha = await this.logService.needCaptcha();
		if (!needCaptcha) {
			return false;
		}
		return await this.invalid(captcha);
	}

	/**
	 * 验证码校验：错误时自动刷新的验证码
	 */
	async invalid(captcha, scene = "login") {
		//校验验证码
		let { code, message } = await uniCaptcha.verify({
			scene,
			captcha,
			deviceId: this.deviceId
		});
		return code !== 0 ? message : false;
	}

	async create({ scene = "login", width = 100, height = 46, backgroundColor = "#FFFAE8" } = {}) {
		let res = await uniCaptcha.create({
			scene,
			deviceId: this.deviceId,
			width,
			height,
			backgroundColor
		});
		if (res.code != 0) {
			this.fail(res.message);
		}
		return res.captchaBase64;
	}

	/**
	 * 获取验证码，以下两种情况不会创建验证码：
	 * 1. 未创建Admin
	 * 2. 没有密码错误记录
	 * @param {Boolean} hasAdmin 是否已创建admin
	 */
	async getNecessaryCaptcha(hasAdmin) {
		if (!hasAdmin) {
			return;
		}
        let needCaptcha = await this.logService.needCaptcha();
		if (!needCaptcha) {
			return;
		}
		return await this.create();
	}
};
