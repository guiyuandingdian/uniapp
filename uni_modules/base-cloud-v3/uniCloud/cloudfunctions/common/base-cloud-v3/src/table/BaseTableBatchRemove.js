module.exports = async function batchRemove(where) {
	where = where || this.ctx.data ;
	if (this.$b.isEmptyObject(where)) {
		throw new Error("where is required");
	}
	let { deleted } = await this.collection.where(where).remove();
	return deleted > 0;
};
