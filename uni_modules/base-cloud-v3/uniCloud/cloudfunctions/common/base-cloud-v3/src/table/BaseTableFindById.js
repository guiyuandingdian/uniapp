module.exports = async function findById(args = {}) {
	if (!this.$b.isObject(args)) {
		args = { _id: args };
	}
	let { _id = this.ctx.data._id, select , unselect , slice = {} , join } = args;
	if (!_id) {
		throw new Error("_id is required");
	}
	let agg = this.agg();
	agg.where({ _id });
	agg.appendJoin(join);
	agg.slice(slice);
	let alls = agg._combineSelect(select, unselect , join);
	agg.select(alls.select);
	agg.unselect(alls.unselect);
	return await agg.getFirst();
};
