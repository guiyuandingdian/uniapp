module.exports = async function remove(_id) {
	_id = _id || this.ctx.data._id;
	if (this.$b.isNull(_id)) {
		throw new Error("_id is required");
	}
	let { deleted } = await this.collection.doc(_id).remove();
	return deleted > 0;
};
