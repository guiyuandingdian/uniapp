module.exports = async function removeByUid(_id) {
	_id = _id || this.ctx.data._id;
	let uid = this.ctx.uid ;
	let	uidKey = this.ctx.uidKey ;
	
	if (this.$b.isNull(_id)) {
		throw new Error("_id is required");
	}
	
	return await this.batchRemove({
		_id ,
		[uidKey] : uid 
	});
};
