const Agg = require("./Agg");
const $ = uniCloud.database().command.aggregate;
const dbCmd = uniCloud.database().command; ;
const { isString } = require("../util");

module.exports = class BasePipeline extends Agg {
	constructor() {
		super($.pipeline());
	}

	lookup(matchKeys) {
		let matchs = matchKeys.map((item) => {
			let { localField, foreignField } = item ;
			return $.eq([`$${foreignField}`, `$$${localField}`]);
		});
		this.aggObj.match(dbCmd.expr($.and(matchs)));
		return this;
	}

	static getJoinMatchKeys(ons, asName) {
		if (!ons) {
			return [] ;
		}
		if (isString(ons)) {
			ons = [ons];
		}
		return ons.map((on) => this._getJoinField(on, asName)).filter((item) => !!item.foreignField && !!item.localField);
	}

	static getLocalKeys(matchKeys , unwind) {
		return matchKeys.reduce((data, cur) => {
			data[cur.localField] = `$${cur.localField}`;
			return data ;
		}, {});
	}

	get() {
		console.log('this.aggObj :>> ', this.aggObj);
		return this.aggObj.done() ;
	}

	getPage(pageNumber, pageSize) {
		pageNumber = Number(pageNumber);
		pageSize = Number(pageSize);
		return this.aggObj
			.skip((pageNumber - 1) * pageSize)
			.limit(pageSize)
			.done();
	}
	
};
