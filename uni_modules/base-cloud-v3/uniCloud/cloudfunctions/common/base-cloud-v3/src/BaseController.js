const path = require("path") ;
const { Controller } = require("./uni-cloud-router") ;
const Util = require("./util");
const Table = require('./table');
const Loader = require('./util/base-loader');

class BaseController extends Controller {
	
	constructor(ctx,name) {
		super(ctx);
		ctx.ip = ctx.context.CLIENTIP;
		ctx.deviceId = ctx.context.DEVICEID;
		ctx.appId = ctx.context.APPID;
		ctx.platform = ctx.context.PLATFORM ;
		this.enumDir = path.join(this.config.baseDir, "enums");
		this.enums = new Loader(this.enumDir);
		this.$b = Util;
		if (name) {
			this.table = new Table(this.ctx,name);
		}
	}

	keep(keepKeys){
		return this.$b.keep(this.ctx.data, keepKeys);
	}

	parseBoolean(keys) {
		keys.split(",").forEach((item) => {
			let key = item.trim();
			if (this.$b.isUnstrictBoolean(this.ctx.data[key])) {
				this.ctx.data[key] = this.$b.isUnstrictTrue(this.ctx.data[key]);
			}
		});
	}

	parseNumber(keys) {
		keys.split(",").forEach((item) => {
			let key = item.trim();
			if (this.$b.isNumber(this.ctx.data[key])) {
				this.ctx.data[key] = Number(this.ctx.data[key]);
			}
		});
	}

	isFail(res){
		return res.code == "fail" ;
	}

	isOk(res){
		return res.code == "ok" ;
	}

	ok(message = "操作成功"){
		return {
			code : "ok" ,
			message
		}
	}

	fail(message) {
		this.throw("fail", message);
	}
}


module.exports = BaseController ;