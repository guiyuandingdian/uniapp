const Util = require("../util");
const Agg = require("./BaseAgg");
const db = uniCloud.database() ;

class Table {
	constructor(ctx, name) {
		this.ctx = ctx;
		this.setName(name);
		this.$b = Util ;
	}

	setName(name){
		if (!name) {
			throw "collection name is required";
		}
		this.name = name;
		this.collection = db.collection(name) ;
	}

	agg(){
		return new Agg(this.collection.aggregate());
	}

}

Table.prototype.isUnique = require("./BaseTableUnique");
Table.prototype.getWhere = require("./BaseTableWhere");
Table.prototype.save = require("./BaseTableSave");
Table.prototype.saveAutoId = require("./BaseTableSaveAutoId");
Table.prototype.saveByUid = require("./BaseTableSaveByUid");
Table.prototype.update = require("./BaseTableUpdate");
Table.prototype.add = require("./BaseTableAdd");
Table.prototype.getAutoId = require("./BaseTableGetAutoId");
Table.prototype.findById = require("./BaseTableFindById");
Table.prototype.findFirst = require("./BaseTableFindFirst");
Table.prototype.list = require("./BaseTableList");
Table.prototype.remove = require("./BaseTableRemove");
Table.prototype.removeByUid = require("./BaseTableRemoveByUid");
Table.prototype.batchRemove = require("./BaseTableBatchRemove");
Table.prototype.clear = require("./BaseTableClear");
Table.prototype.setSort = require("./BaseTableSort");
Table.prototype.paginate = require("./BaseTablePaginate");
Table.prototype.count = require("./BaseTableCount");
Table.prototype.sum = require("./BaseTableSum");

module.exports = Table;
