module.exports = {
	async setSort(args = {}) {
		let {
			collection = this.collection,
			data = this.params,
			sortKey = "sort",
			step = 10,
			start = 0,
			where = {}
		} = args;

		//用户已输入sort
		if (this.$b.notNull(data[sortKey])) {
			return;
		}

		//追加筛选条件
		if (!this.$b.isEmptyObject(where)) {
			collection = collection.where(where);
		}

		//查询数据库
		let dataInDB = this.$b.findFirst(
			await collection.orderBy(sortKey, "desc").limit(1).get()
		);

		let hasData = null == dataInDB || this.$b.isNull(dataInDB[sortKey]);
		data[sortKey] = hasData ? start : parseInt(dataInDB[sortKey]) + step;
	},

	async isUnique(args = {}) {
		let { collection = this.collection, field , data = this.params } = args ;
		let where = { [field]: data[field] };
		if (data._id) {
			where._id = this.db.command.neq(data._id);
		}
		let dataEx = this.$b.findFirst(await collection.where(where).get());
		console.log('dataEx :>> ', dataEx);
		return null == dataEx;
	},

	async save(args = {}) {
		let {
			collection = this.collection,
			data = this.params,
			queryDb = false,
			insertTime
		} = args;

		insertTime = this.$b.isNull(insertTime) || insertTime === true ;

		//根据ID判断是否需要更新
		let isUpdate = this.$b.notNull(data._id);

		//查询数据库判断是否需要更新
		if (queryDb) {
			let dataEx = this.$b.findFirst(await collection.doc(data._id).get());
			isUpdate = null != dataEx;
		}

		if (isUpdate) {
			return await this.update({ collection, data, insertTime });
		}

		//删除空ID字段，否则报错
		if (this.$b.isNull(data._id)) {
			delete data._id;
		}

		//插入时间
		if (insertTime) {
			let now = Date.now();
			data.createTime = now;
			data.updateTime = now;
		}

		//返回结果
		var res = await collection.add(data);
		if (!res.id) {
			return 0;
		}
		data._id = res.id;
		return 1;
	},

	async update(args = {}) {
		let {
			collection = this.collection,
			data = this.params,
			insertTime = true
		} = args;

		let id = data._id;
		if (!id) throw new Error("_id参数缺失");

		//_id字段不参与更新
		delete data._id;
		if (insertTime) {
			data.updateTime = Date.now();
		}

		//更新数据
		var res = await collection.doc(id).update(data);

		//复原_id字段
		data._id = id;
		return res.updated;
	},

	async info(args = {}) {
		let {
			collection = this.collection,
			_id = this.params._id,
			field,
			get
		} = args;
		if (!_id) {
			return "_id参数缺失" ;
		}
		collection = this.$b.setFields(field, get , collection.doc(_id));
		let data = this.$b.findFirst(await collection.get());
		return this.$b.resetFieldKeys(data, field);
	},

	async list(args = {}) {
		let {
			collection = this.collection,
			where = {},
			orderBy,
			field,
			get
		} = args;
		collection = this.$b.setFields(field, get, collection.where(where));
		collection = this.$b.setOrderBy(orderBy, collection);
		let list = this.$b.find(await collection.get());
		return this.$b.resetAllFieldKeys(list, field);
	},

	async remove(args = {}) {
		let { collection = this.collection, _id = this.params._id } = args;
		if (this.$b.isNull(_id)) {
			throw new Error("_id can not be null");
		}
		let { deleted } = await this.collection.doc(_id).remove();
		return deleted > 0;
	},

	async removeAll(args = {}) {
		let { collection = this.collection, where = {} } = args;
		let { deleted } = await this.collection.where(where).remove();
		return deleted > 0;
	}
};
