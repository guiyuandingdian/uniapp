const { isNull, isString, isEmptyObject, isObject, isArray } = require("../util");
const $ = uniCloud.database().command.aggregate;

function getProjects(fields = {}, isSelect, prefix = "") {
	if (isString(fields)) {
		let keys = fields.split(",");
		return keys.reduce((data, key) => {
			let arr = key.indexOf(" AS ") > -1 ? key.split(" AS ") : key.split(" as ");
			let keyInDb = arr[0].trim();
			if (!keyInDb) {
				return data;
			}
			if (arr.length == 1) {
				data[`${prefix}${keyInDb}`] = isSelect;
				data[keyInDb] = prefix ? `$${prefix}${keyInDb}` : isSelect;
				return data;
			}
			data[arr[1].trim()] = `$${prefix}${keyInDb}`;
			return data;
		}, {});
	}
	return {};
}


function getUnselects(fields = {}, prefix = "") {
	if (isString(fields)) {
		let keys = fields.split(",");
		return keys.reduce((data, key) => {
			let arr =
				key.indexOf(" AS ") > -1 ? key.split(" AS ") : key.split(" as ");
			let keyInDb = arr[0].trim();
			if (!keyInDb) {
				return data;
			}
			if (arr.length == 1) {
				data[`${prefix}${keyInDb}`] = false;
				return data;
			}
			data[arr[1].trim()] = `$${prefix}${keyInDb}`;
			return data;
		}, {});
	}
	return {};
}


module.exports = class Agg {
	constructor(aggObj) {
		this.agg = aggObj;
	}

	get agg() {
		return this.aggObj;
	}

	set agg(aggObj) {
		this.aggObj = aggObj;
	}

	where(where) {
		if (!where) {
			return this;
		}
		this.aggObj.match(where);
		return this;
	}

	_getJoinField(on, asName) {
		let localField, foreignField;
		if (!on) {
			return { localField, foreignField };
		}
		let arr = on.split("=");
		//关联字段
		let field = arr.find((f) => f.indexOf(`${asName}.`) > -1);
		foreignField = field
			? field.replace(`${asName}.`, "").trim()
			: foreignField || "_id";
		//本地字段
		field = arr.find((f) => f.indexOf(`${asName}.`) == -1);
		localField = field ? field.trim() : localField;
		return { localField, foreignField };
	}

	toSelect(fields, isSelect, selectId, prefix) {
		let projects = getProjects(fields, isSelect, prefix);
		if (selectId === false) {
			projects._id = 0;
		}
		if (isEmptyObject(projects)) {
			return this;
		}
		this.aggObj.project(projects);
		return this;
	}

	_parseJson(as) {
		this.aggObj.addFields({
			[as]: $.arrayElemAt([`$${as}`, 0])
		});
		return this;
	}

	_deepSelect(select, defName) {
		if (!select) {
			return this;
		}
		let projects = getProjects(select, true, `${defName}.`);
		if (isEmptyObject(projects)) {
			return this;
		}
		this.aggObj.addFields(projects).project({
			[defName]: 0
		});
		return this;
	}

	_selectObject(select, objField) {
		let projects = getProjects(select, true, `${objField}.`);
		if (isEmptyObject(projects)) {
			return this;
		}
		let tempName = `${objField}_temp`;
		this.aggObj.addFields({
			[tempName]: projects
		});
		this.aggObj.project({
			[objField]: 0
		});
		this.aggObj.addFields({
			[objField]: `$${tempName}`
		});
		this.aggObj.project({
			[tempName]: 0
		});
		return this;
	}

	_unselectObject(unselect, objField) {
		let projects = getUnselects(unselect, `${objField}.`);
		if (isEmptyObject(projects)) {
			return this;
		}
		this.aggObj.project(projects);
		return this;
	}

	select(fields, selectId) {
		return this.toSelect(fields, 1, selectId);
	}

	unselect(fields) {
		return this.toSelect(fields, 0);
	}

	merge(arrField) {
		this.aggObj
			.replaceRoot({
				newRoot: $.mergeObjects(["$$ROOT", $.arrayElemAt([`$${arrField}`, 0])])
			})
			.project({
				[arrField]: 0
			});
		return this;
	}

	mergeObject(objField) {
		this.aggObj
			.replaceRoot({
				newRoot: $.mergeObjects(["$$ROOT", `$${objField}`])
			})
			.project({
				[objField]: 0
			});
		return this;
	}

	sort(orderBy = {}) {
		let sort = {};
		if (isString(orderBy)) {
			orderBy.split(",").forEach((item) => {
				let keyWidthSort = item.trim();
				if (!keyWidthSort) {
					return;
				}
				let arr = keyWidthSort.split(" ");
				if (arr.length == 1) {
					arr.push("asc");
				}
				sort[arr[0].trim()] = arr[1].trim().toLowerCase() === "asc" ? 1 : -1;
			});
		} else {
			sort = orderBy;
		}

		if (!isEmptyObject(sort)) {
			this.aggObj.sort(sort);
		}
		return this;
	}

	addFields(fieldObj) {
		if (isNull(fieldObj) || isEmptyObject(fieldObj)) {
			return this;
		}
		this.aggObj.addFields(fieldObj);
		return this;
	}

	_getSliceParams(arg) {
		if (!isObject(arg) || isEmptyObject(arg)) {
			return [];
		}
		let list = [];
		for (const key in arg) {
			if (arg.hasOwnProperty(key)) {
				let position = 0;
				let size = arg[key];
				if (isArray(size)) {
					if (size.length < 2)
						throw new Error(
							"at least two elements are required in slice field"
						);
					position = size[0];
					size = size[1];
				}
				list.push({
					field: key,
					position,
					size
				});
			}
		}
		return list;
	}

	slice(arg = {}) {
		let list = this._getSliceParams(arg);
		list.forEach(({ field, position, size }) => {
			this.addFields({
				[field]: $.slice([`$${field}`, position, size])
			});
		});
		return this;
	}

	unwind(field) {
		if (isNull(field)) {
			return this;
		}
		if (isString(field)) {
			field = field.indexOf("$") == 0 ? field : `$${field}`;
		}
		this.aggObj.unwind(field);
		return this;
	}

	bucket(arg) {
		this.aggObj.bucket(arg);
		return this;
	}

	bucketauto(arg) {
		this.aggObj.bucketauto(arg);
		return this;
	}

	geoNear(arg) {
		this.aggObj.geoNear(arg);
		return this;
	}

	project(arg) {
		this.aggObj.project(arg);
		return this;
	}

	group(arg) {
		this.aggObj.group(arg);
		return this;
	}

	replaceroot(arg) {
		this.aggObj.replaceroot(arg);
		return this;
	}

	sample(arg) {
		this.aggObj.sample(arg);
		return this;
	}

	skip(arg) {
		arg = Number(arg);
		if (isNaN(arg)) {
			return this;
		}
		this.aggObj.skip(arg);
		return this;
	}

	sortbycount(arg) {
		this.aggObj.sortbycount(arg);
		return this;
	}

	limit(limit) {
		limit = Number(limit);
		if (isNaN(limit)) {
			return this;
		}
		this.aggObj.limit(limit);
		return this;
	}

	count(name) {
		this.aggObj.count(name);
		return this;
	}

	lookup(arg) {
		this.aggObj.lookup(arg);
		return this;
	}
};
