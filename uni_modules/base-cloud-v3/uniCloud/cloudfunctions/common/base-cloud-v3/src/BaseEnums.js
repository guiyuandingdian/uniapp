const { isNull } = require("./util");

module.exports = class Enums {
	constructor(list = []) {
		list.forEach((item) => {
			item.value = isNull(item.value) ? item.title : item.value;
			if (item.key) {
				this[item.key] = item.value ;
			}
		});
		this.list = list;
	}

	title(value) {
		let option = this.list.find((item) => item.value === value || item.key === value);
		return option ? option.title : "";
	}

	value(key) {
		let option = this.list.find((item) => item.key === key);
		return option ? option.value : "" ;
	}
	
	key(value) {
		let option = this.list.find((item) => item.value === value);
		return option ? option.key : "" ;
	}

	index(value) {
		return this.list.findIndex((item) => item.value === value || item.key === value);
	}

	data(value) {
		return this.list.find((item) => item.value === value || item.key === value);
	}
	
	keys(){
		return this.list.map(item => item.key);
	}
	
	values(){
		return this.list.map(item => item.value);
	}
	
	titles(){
		return this.list.map(item => item.title);
	}
	
};