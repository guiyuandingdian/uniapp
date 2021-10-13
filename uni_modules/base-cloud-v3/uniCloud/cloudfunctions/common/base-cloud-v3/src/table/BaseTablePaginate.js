function setBasicAgg(agg, unwind, where, select, unselect, join , orderBy) {
	agg.unwind(unwind);
	agg.appendJoin(join);
	agg.where(where);
	agg.sort(orderBy);
	let start = Date.now();
	let alls = agg._combineSelect(select, unselect , join);
	agg.select(alls.select);
	agg.unselect(alls.unselect);
	return agg;
}

async function getCount (countAgg,unwind, where, select, unselect, join,totalRow) {
	if (totalRow === false) {
		return totalRow ;
	}
	setBasicAgg(countAgg, unwind, where, select, unselect, join);
	return await countAgg.getCount();
}

async function getList (agg, unwind, where, select, unselect, join , orderBy,pageNumber, pageSize) {
	setBasicAgg(agg, unwind, where, select, unselect, join , orderBy);
	return await agg.getPage(pageNumber, pageSize);
}

module.exports = async function paginate(args) {
	args = args || this.ctx.data;
	let {
		orderBy = "createTime desc",
		select,
		unselect,
		unwind,
		pageNumber = this.ctx.data.pageNumber || 1,
		pageSize = this.ctx.data.pageSize || 10,
		totalRow,
		join
	} = args;
	
	let agg = this.agg();
	let countAgg = this.agg();
	
	//查询条件
	let where = this.getWhere(args);
	
	let [list , count] = await Promise.all([
		getList(agg, unwind, where, select, unselect, join , orderBy,pageNumber, pageSize),
		getCount (countAgg,unwind, where, select, unselect, join,totalRow)
	]);
	
	return this.$b.getPage({
		pageNumber,
		pageSize,
		totalRow : count === false ? undefined : count ,
		list
	});
};
