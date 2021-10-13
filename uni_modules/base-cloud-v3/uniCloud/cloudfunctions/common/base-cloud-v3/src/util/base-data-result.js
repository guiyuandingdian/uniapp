module.exports = {
	/**
	 * 根据数据库查询结果，返回一条数据
	 * @param {Object} dataInDB 数据库查询结果
	 * @return {Obejct} 有数据返回json，无数据返回null
	 */
	findFirst(dataInDB) {
		return dataInDB && dataInDB.data && dataInDB.data.length > 0
			? dataInDB.data[0]
			: undefined ;
	},

	/**
	 * 根据数据库查询结果，返回数据列表
	 * @param {Object} dataInDB 数据库查询结果
	 * @return {Array} 返回数据列表，无数据返回空数组
	 */
	find(dataInDB) {
		return dataInDB && dataInDB.data && dataInDB.data.length > 0
			? dataInDB.data
			: [];
	},

	/**
	 * 获取标准分页结构
	 * @param {Object}
	 * 	  {Number} pageNumber 页码
	 * 	  {Number} pageSize 每页数据条数
	 * 	  {Number} totalRow 数据总条数
	 * 	  {Array} list 当前页数据，与dateInDB二选一传入
	 * 	  {Object} dataInDB 当前页数据的数据库查询结果，与list二选一传入即可
	 * @return {Object} 返回标准分页结构数据
	 */
	getPage({ pageNumber = 1 , pageSize = 10, totalRow, list = [] } = {}) {
		if (totalRow === false) {
			return {
				list,
				pageNumber,
				pageSize,
				lastPage: list.length == 0,
				firstPage: pageNumber == 1
			};
		}
		totalRow = undefined === totalRow ? 0 : totalRow ;
		let totalPage = Math.ceil(totalRow / pageSize);
		return {
			list,
			pageNumber,
			pageSize,
			totalRow,
			totalPage,
			lastPage: pageNumber == totalPage || list.length == 0 || totalPage === 0,
			firstPage: pageNumber == 1
		};
	}
};
