const cmd = uniCloud.database().command ;
module.exports = async function count(where = { _id: cmd.exists(true) }) {
	let agg = this.agg();
	agg.where(where);
	return await agg.getCount();
};
