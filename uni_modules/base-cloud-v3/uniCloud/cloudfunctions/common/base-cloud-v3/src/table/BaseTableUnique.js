const cmd = uniCloud.database().command;
module.exports = async function isUnique(args = {}) {
	let {field , data = this.ctx.data , dataKey , required , where = {} } = args;
	if (this.$b.isNull(field)) {
		throw new Error("the unique field is required");
    }
    dataKey = dataKey || field ;
	let value = data[dataKey];
    if (this.$b.isNull(value)) {
		if (required === false) {
			return true ;
		}
        throw new Error("the unique field is undefined");
    }
	where[field] = value ;
	if (data._id) {
		where._id = cmd.neq(data._id);
    }
	let dataEx = this.$b.findFirst(await this.collection.where(where).get());
	return null == dataEx;
};
