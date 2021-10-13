const { Controller } = require("base-cloud-v3");

module.exports = class CaptchaController extends Controller {
	constructor(ctx) {
		super(ctx, "uni-id-users");
		this.captchaService = this.service.captchaService;
	}

	/**
	 * 生成验证码
	 */
	async create() {
		let captcha = await this.captchaService.create();
		return { captcha };
	}

	
};
