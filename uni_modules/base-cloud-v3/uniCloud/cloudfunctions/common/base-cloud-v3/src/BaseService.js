const path = require("path");
const { Service } = require("./uni-cloud-router");
const Util = require("./util");
const Table = require('./table');
const Loader = require('./util/base-loader');


class BaseService extends Service {

	constructor(ctx, name) {
		super(ctx);
		ctx.ip = ctx.context.CLIENTIP;
		ctx.deviceId = ctx.context.DEVICEID;
		ctx.platform = ctx.context.PLATFORM ;
		ctx.appId = ctx.context.APPID;
		this.enumDir = path.join(this.config.baseDir, "enums");
		this.enums = new Loader(this.enumDir);
		this.$b = Util;
		if (name) {
			this.table = new Table(this.ctx,name);
		}
	}

	keep(keepKeys){
		this.$b.keep(this.ctx.data, keepKeys);
	}

	parseBoolean(keys) {
		keys.split(",").forEach((item) => {
			let key = item.trim();
			if (this.$b.isNull(this.ctx.data[key])) {
				delete this.ctx.data[key];
				return;
			}
			if (this.$b.isUnstrictBoolean(this.ctx.data[key])) {
				this.ctx.data[key] = this.$b.isUnstrictTrue(this.ctx.data[key]);
			}
		});
	}

	parseNumber(keys) {
		keys.split(",").forEach((item) => {
			let key = item.trim();
			if (this.$b.isNull(this.ctx.data[key])) {
				delete this.ctx.data[key];
				return;
			}
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
	
	async info(_id){
		if (!_id) {
			return ;
		}
		return await this.table.findById(_id);
	}
	
	async findFirst(args){
		return await this.table.findFirst(args);
	}
	
	async add(args){
		return await this.table.add(args);
	}
	
	async save(args){
		return await this.table.save(args);
	}
	
	async update(args){
		return await this.table.update(args);
	}
	
	async remove(_id){
		return await this.table.remove(_id);
	}
	
	async remove(args){
		return await this.table.batchRemove(args);
	}
	
	async clear(){
		return await this.table.clear();
	}
	
	async saveBySort(){
		await this.table.setSort();
		return await this.table.save();
	}
	
	async list(args){
		return await this.table.list(args);
	}
	
	async listBySort(args = {}){
		return await this.table.list(Object.assign({orderBy:"sort"},args));
	}
}

module.exports = BaseService;
