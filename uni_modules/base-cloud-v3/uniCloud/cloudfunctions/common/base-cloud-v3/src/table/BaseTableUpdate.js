module.exports = async function update(data , returnData) {
	data = data || this.ctx.data;

	let _id = data._id;
	if (!_id) {
		throw new Error("_id参数缺失");
	}

	//_id字段不参与更新
	delete data._id;

	//除了_id外无更新的数据
	if (this.$b.isEmptyObject(data)) {
		return 1 ;
	}

	data.updateTime = Date.now();

	//更新数据
	let fnName = returnData ? "updateAndReturn" : "update" ;
	let res = await this.collection.doc(_id)[fnName](data);

	//复原_id字段
	data._id = _id;
	return returnData ? res.doc : res.updated ;
};
