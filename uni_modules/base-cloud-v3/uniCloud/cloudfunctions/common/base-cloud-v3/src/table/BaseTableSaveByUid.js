module.exports = async function saveByUid(data) {
	data = data || this.ctx.data;
	let uidKey = this.ctx.uidKey;
	let uid = this.ctx.uid;

	//删除空ID字段，否则报错
	if (this.$b.isNull(data._id)) {
		delete data._id;
	}

	//判断是否需要更新
	let dataEx = data._id ? this.$b.findFirst(await this.collection.doc(data._id).get()) : null;
	if (dataEx[uidKey] != uid) {
		return "非法操作";
	}

	//更新
	let isUpdate = null != dataEx;
	if (isUpdate) {
		return await this.update(data);
	}

	//插入时间
	let now = Date.now();
	data.createTime = now;
	data.updateTime = now;

	//插入UID
	data[uidKey] = uid;

	//返回结果
	var res = await this.collection.add(data);
	if (!res.id) {
		return 0;
	}
	data._id = res.id;
	return 1;
};
