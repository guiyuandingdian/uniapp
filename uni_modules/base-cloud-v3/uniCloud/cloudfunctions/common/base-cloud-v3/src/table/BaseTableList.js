module.exports = async function list(args) {
	args = args || this.ctx.data ;
	let { where = {}, orderBy = "createTime desc", select , unwind , unselect , limit = 1000 , skip = 0 , join } = args;

	let agg = this.agg();
	agg.unwind(unwind);
	agg.where(where);
	agg.appendJoin(join);
	agg.sort(orderBy);
	agg.skip(skip);
	agg.limit(limit);
	let alls = agg._combineSelect(select, unselect , join);
	agg.select(alls.select);
	agg.unselect(alls.unselect);

	return await agg.get();
};
