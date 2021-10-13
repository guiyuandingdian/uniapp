const Where = require("../util/base-where");

module.exports = function getWhere(args = {},data) {
	data = data || this.ctx.data ;
    let where = new Where(data, args.where);
	let fnNames = ['eq','neq','lt','lte','gt','gte','in','nin','like','range','neqRange','gteRange','lteRange'];
    fnNames.forEach(fnName => {
        let value = args[fnName];
        if (this.$b.notNull(value)) {
            where[fnName](...value);
        }
    });
    return where.get();
};
