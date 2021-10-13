module.exports = async function add(data) {
	data = data || this.ctx.data ;
	let now = Date.now();
	if (this.$b.isArray(data)) {
		data.forEach( (item,index) => {
			item.createTime = now;
			item.updateTime = now;
		});
		let {ids = []} = await this.collection.add(data);
		if ( ids.length != data.length ) {
			return 0 ;
		}
		data.forEach( (item,index) => {
			item._id = ids[index] ;
		});
		return ids.length ;
	}
	
	data.createTime = now;
	data.updateTime = now;
	
	let {id} = await this.collection.add(data);
	if (!id) {
		return 0;
	}
	data._id = id ;
	return 1;
};