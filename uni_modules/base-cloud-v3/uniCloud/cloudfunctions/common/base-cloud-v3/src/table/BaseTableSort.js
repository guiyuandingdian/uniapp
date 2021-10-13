module.exports = async function setSort(args = {}) {
	let {
		data = this.ctx.data,
		sortKey = "sort",
		step = 10,
		start = 1,
		where = {}
	} = args;

	let collection = this.collection;

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
};
