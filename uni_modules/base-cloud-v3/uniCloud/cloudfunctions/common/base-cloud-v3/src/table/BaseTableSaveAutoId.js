module.exports = async function saveAutoId(data , arg = {}) {
	if (!this.$b.isObject(arg)) {
		arg = { start : arg } ;
	}
	let { start , saveData , updateData} = arg ;
	return await this.save(data , { isAutoNumber : true , start , saveData , updateData} );
};
