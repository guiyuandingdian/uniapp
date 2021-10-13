module.exports = async function save(data , {isAutoNumber = false , start = 1 , saveData = {}, updateData = {}} = {}) {
	data = data || this.ctx.data;

	//删除空ID字段，否则报错
	if (this.$b.isNull(data._id)) {
		delete data._id;
	}

	//根据ID判断是否需要更新
	let dataEx = data._id ? this.$b.findFirst(await this.collection.doc(data._id).get()) : null;
	let isUpdate = null != dataEx;

	if (isUpdate) {
		this.$b.deepMerge(data, updateData);
		return await this.update(data);
	}

	//插入自增ID
	if (this.$b.isNull(data._id) && isAutoNumber) {
		data._id = await this.getAutoId(start);
	}

	//插入时间
	let now = Date.now();
	data.createTime = now;
	data.updateTime = now;
	
	this.$b.deepMerge(data, saveData);

	//返回结果
	let res = await this.collection.add(data);
	if (!res.id) {
		return 0;
	}
	data._id = res.id ;
	return 1;
};
