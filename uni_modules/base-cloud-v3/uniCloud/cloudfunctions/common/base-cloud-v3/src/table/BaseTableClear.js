const cmd = uniCloud.database().command ;
module.exports = async function clear() {
	let { deleted } = await this.collection.where({ _id: cmd.exists(true) }).remove();
	return deleted > 0;
};