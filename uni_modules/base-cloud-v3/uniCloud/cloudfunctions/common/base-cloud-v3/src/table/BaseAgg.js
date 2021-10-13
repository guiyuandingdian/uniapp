const { isNull, isString, isEmptyObject, findFirst, find , isObject , isArray } = require("../util");
const $ = uniCloud.database().command.aggregate;
const dbCmd = uniCloud.database().command ;
const Agg = require("./Agg");
const Pipeline = require('./BasePipeline');

function getAlias(select) {
	if (!select) {
		return "" ;
	}
	let keys = select.split(",");
	return keys.map((key) => {
		let arr = key.indexOf(" AS ") > -1 ? key.split(" AS ") : key.split(" as ");
		key = arr[arr.length - 1] ;
		return key ? key.trim() : "" ;
	}).filter(item => !!item).join(",");
}

module.exports = class BaseAgg extends Agg {
	constructor(aggObj) {
		super(aggObj);
	}

	appendJoin(joins = []) {
		if (isObject(joins)) {
			joins = [joins];
		}
		joins.forEach((curJoin) => {
			this.join(curJoin);
		});
		return this;
	}

	_combineSelect(select, unselect, joins = []) {
		if (isObject(joins)) {
			joins = [joins];
		}
		joins.forEach(({ select: curSelect, unselect: curUnSelect }) => {
			if (!!select && curSelect) {
				select += `,${getAlias(curSelect)}`;
			}
			if (!!unselect && !!curUnSelect) {
				unselect += `,${getAlias(curUnSelect)}`;
			}
		});
		return { select, unselect };
	}

	/**
	 * 暂时弃用
	 */
	joinAbandoned({
		on,
		from,
		as,
		type,
		select,
		unselect,
		orderBy,
		limit,
		skip,
		where,
		unwind
	}) {
		let asName = !as ? from : as;

		let matchKeys = Pipeline.getJoinMatchKeys(on, asName);

		// let { localField, foreignField } = this._getJoinField(on, asName);
		if (matchKeys.length == 0) {
			throw new Error("未定义关联表字段");
		}

		let pipeline = new Pipeline();
		pipeline.lookup(matchKeys);
		pipeline.where(where);
		pipeline.sort(orderBy);
		pipeline.limit(limit);
		pipeline.skip(skip);
		pipeline.select(select);
		pipeline.unselect(unselect);

		let variables = Pipeline.getLocalKeys(matchKeys, unwind);
		console.log("variables :>> ", variables);

		//联表查询
		this.aggObj.lookup({
			from,
			let: variables,
			pipeline: pipeline.get(),
			as: asName
		});

		//数组类型
		if (type == "Array") {
			this._deepSelect(select, asName);
			return this;
		}

		//JSON类型
		if (type == "Object") {
			this._parseJson(asName);
			// this._deepSelect(select, asName);
			return this;
		}

		//合并到根路径
		// this._parseJson(asName);
		// this._deepSelect(select, asName);
		this.merge(asName);
		return this;
	}
	
	getFrom(from , as){
		if (from.indexOf(" as ") > -1) {
			let temArr = from.split(" as ") ;
			from = temArr[0].trim();
			as = temArr[1].trim();
		}
		return { from , as } ;
	}

	join({ on, from, as, type = "Root", select, unselect }) {
		let fromObj = this.getFrom(from , as) ;
		let asName = fromObj.as;
		from = fromObj.from ;

		let { localField, foreignField } = this._getJoinField(on, asName);

		if (isNull(localField)) {
			throw new Error("未定义关联表的本地字段");
		}
		if (isNull(foreignField)) {
			throw new Error("未定义关联表的关联字段");
		}

		//联表查询
		this.aggObj.lookup({
			localField,
			foreignField,
			from,
			as: asName
		});

		//数组类型
		if (type == "Array") {
			this._deepSelect(select, asName);
			return this;
		}

		//JSON类型
		if (type == "Object") {
			this._parseJson(asName);
			// this._deepSelect(select, asName);
			this._selectObject(select, asName);
			this._unselectObject(unselect, asName);
			return this;
		}

		//合并到根路径
		this._parseJson(asName);
		if (select) {
			this._deepSelect(select, asName);
		} else {
			this.mergeObject(asName);
		}
		return this;
	}
	
	page(pageNumber, pageSize) {
		pageNumber = Number(pageNumber);
		pageSize = Number(pageSize);
		this.aggObj.skip((pageNumber - 1) * pageSize).limit(pageSize) ;
		return this.aggObj ;
	}

	async getCount() {
		let data = await this.count("total").getFirst();
		return null == data ? 0 : data.total;
	}

	async get() {
		return find(await this.aggObj.end());
	}

	async getFirst() {
		return findFirst(await this.aggObj.end());
	}

	async getPage(pageNumber, pageSize) {
		pageNumber = Number(pageNumber);
		pageSize = Number(pageSize);
		return find(
			await this.aggObj
				.skip((pageNumber - 1) * pageSize)
				.limit(pageSize)
				.end()
		);
	}
};
