const cmd = uniCloud.database().command;
const $ = cmd.aggregate;

const AutoNumber = uniCloud.database().collection("base_auto_number");

module.exports = async function getAutoId(startIndex = 1) {
	let _id = this.name;

	let tableName = "base_auto_number";
	//1.新建表数据，读 +1
	this.setName(tableName);
	await this.save({ _id });

	//2.插入ID，写+1
	let uuid = this.$b.uuid();
	await AutoNumber.doc(_id).update({
		ids: cmd.push(uuid)
	});
	//3.查询下标，读 +1
	let agg = this.agg();
	agg.where({ _id });
	agg.addFields({
		index: $.indexOfArray(["$ids", uuid])
	});
	agg.select("start,index");
	let { index , start = startIndex } = await agg.getFirst();
	
	//4.更新下标，写+1
	await AutoNumber.doc(_id).update({
		ids: {
			[index]: index + start
		},
		start
	});

	//恢复表名
	this.setName(_id);

	return index + start;
};