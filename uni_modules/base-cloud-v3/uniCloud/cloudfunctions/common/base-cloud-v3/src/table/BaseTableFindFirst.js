module.exports = async function findFirst(args = {}) {
	let { where = {}, orderBy, select , unselect , join } = args;
	let agg = this.agg();
	agg.where(where);
	agg.appendJoin(join);
	agg.sort(orderBy);
	agg.limit(1);
	let alls = agg._combineSelect(select, unselect , join);
	agg.select(alls.select);
	agg.unselect(alls.unselect);
	return await agg.getFirst();
};
