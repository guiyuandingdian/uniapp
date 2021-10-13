const { isNull,notNull, isString, isArray } = require("./base-type");
const dbCmd = uniCloud.database().command;
			
module.exports = class Where {
	constructor(params, where = {}) {
		this.params = params;
		this.where = where;
	}

    get(){
        return this.where ;
    }

	_parseWhereKeys(item) {
		if (isString(item)) {
			item = [item, item];
		}
		if (!isArray(item) || item.length == 0) {
			return [];
		}
		if (item.length == 1) {
			item.push(item[0]);
		}
		return item;
	}

	_parseRangeKeys(item) {
		if (isString(item)) {
			item = [item, `${item}Start`, `${item}End`];
		}
		if (!isArray(item) || item.length == 0) {
			return [];
		}
		let key = item[0];
		if (item.length == 2) {
			item.push(`${key}End`);
		} else if (item.length == 1) {
			item.push(`${key}Start`, `${key}End`);
		}
		return item;
	}

	_setWhere(item, cmdName) {
		let list = this._parseWhereKeys(item);
		if (list.length == 0) {
			return;
		}
		const [dbKey, paramKey] = list;
		let value = this.params[paramKey];
		if (isNull(value)) {
			return;
		}
		if (cmdName == "like") {
			this.where[dbKey] = new RegExp(value);
		} else {
			this.where[dbKey] = dbCmd[cmdName](value);
		}
	}

	_setRange(item, startCmd, endCmd) {
		let list = this._parseRangeKeys(item);
		if (list.length == 0) {
			return;
		}
		const [dbKey, startKey, endKey] = list;
		let startValue = this.params[startKey];
		let endValue = this.params[endKey];
		if (isNull(startValue) && isNull(endValue)) {
			return;
		}
		if (isNull(startValue)) {
			this.where[dbKey] = dbCmd[endCmd](endValue);
			return;
		}
		if (isNull(endValue)) {
			this.where[dbKey] = dbCmd[startCmd](startValue);
			return ;
		}
		//均不为空
		this.where[dbKey] = dbCmd.and(
			dbCmd[startCmd](startValue),
			dbCmd[endCmd](endValue)
		);
	}

	setRange() {
		let startCmd = "";
		let endCmd = "";
		[...arguments].forEach((item, index) => {
			if (index == 0) {
				startCmd = item;
				return;
			}
			if (index == 1) {
				endCmd = item;
				return;
			}
			this._setRange(item, startCmd, endCmd);
		});
	}

	set() {
		let cmdName = "";
		[...arguments].forEach((item, index) => {
			if (index == 0) {
				cmdName = item;
				return;
			}
			this._setWhere(item, cmdName);
		});
	}

	eq() {
		this.set("eq", ...arguments);
	}

	neq() {
		this.set("neq", ...arguments);
	}

	gt() {
		this.set("gt", ...arguments);
	}

	gte() {
		this.set("gte", ...arguments);
	}

	lt() {
		this.set("lt", ...arguments);
	}

	lte() {
		this.set("lte", ...arguments);
	}

	in() {
		this.set("in", ...arguments);
	}

	nin() {
		this.set("nin", ...arguments);
	}

	like() {
		this.set("like", ...arguments);
	}

	range() {
		this.setRange("gte", "lte", ...arguments);
	}

	neqRange() {
		this.setRange("gt", "lt", ...arguments);
	}

	gteRange() {
		this.setRange("gte", "lt", ...arguments);
	}

	lteRange() {
		this.setRange("gt", "lte", ...arguments);
	}
};
