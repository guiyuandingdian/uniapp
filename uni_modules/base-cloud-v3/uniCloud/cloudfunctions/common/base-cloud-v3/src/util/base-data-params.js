module.exports = {
	
	/**
	 * 筛选指定字段
	 * @param {String|Object}  field 字段名，多个用英文逗号分割
	 * @param {Boolean}  get 是否获取指定字段，否则为过滤
	 * @return {Object} 
	 */
	getFields(field = {} , get = true){
		//字符串类型的字段名，以英文逗号分开
		if (this.isString(field)) {
			let keys = field.split(",");
			field = keys.reduce( (data,key) => {
				key = key.split("as")[0].trim();
				data[key] = get ;
				return data ;
			},{});
		}
		return field ;
	},

	getFieldsKeyMap(field){
		if (this.isString(field)) {
			let keys = field.split(",");
			return keys.reduce( (data,key) => {
				let arr = key.split("as");
				if (arr.length == 1) {
					return data ;
				}
				data[arr[0].trim()] = arr[1].trim() ;
				return data ;
			},{});
		}
		return {} ;
	},

	

	resetFieldKeys( data , field){
		let map = this.isString(field) ? this.getFieldsKeyMap(field) : field ;
		for(let key in map ){
			let theKey = map[key] ;
			if (theKey) {
				data[theKey] = data[key] ;
				delete data[key] ;
			}
		}
		return data ;
	},

	resetAllFieldKeys( list , field){
		let map = this.getFieldsKeyMap(field) ;
		return list.map( item => this.resetFieldKeys( item , map) ) ;
	},
	
	setFields(field = {} , get = true , collection){
		field = this.getFields(field , get);
		collection = collection.field(field);
		return collection ;
	},
	
	setOrderBy(orderBy , collection){
		this.notNull(orderBy) && orderBy.split(",").forEach(item =>{
			let keyWidthSort = item.trim();
			if (!keyWidthSort) {
				return ;
			}
			let arr = keyWidthSort.split(" ");
			if (arr.length == 1) {
				arr.push("asc");
			}
			collection = collection.orderBy(arr[0].trim() , arr[1].trim().toLowerCase()) ;
		}) ;
		return collection ;
	}
}