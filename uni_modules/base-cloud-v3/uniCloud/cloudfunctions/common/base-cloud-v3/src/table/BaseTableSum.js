const $ = uniCloud.database().command.aggregate ;

module.exports = async function sum(arg={}) {
	let { where = {} , select , countKey = "count"} = arg ;
	if (this.$b.isNull(select)) {
		throw new Error("the select field is required");
	}
	
	let selects = select.split(",") ;
	let groupData = {
		_id : null ,
		[countKey] : $.sum(1)
	} ;
	let defaultRes = {[countKey] : 0} ;
	for (let field of selects) {
		if (this.$b.isNull(field)) {
			continue ;
		}
		field = field.trim();
		groupData[field] = $.sum(`$${field}`) ;
		defaultRes[field] = 0 ;
	}
	
	let agg = this.agg();
	agg.where(where);
	agg.group(groupData);
	agg.unselect("_id");
	let res = await agg.getFirst();
	return !res ? defaultRes : res ;
};