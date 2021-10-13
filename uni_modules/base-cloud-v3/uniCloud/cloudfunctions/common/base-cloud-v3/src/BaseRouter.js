const path = require("path");
const { Router } = require("./uni-cloud-router");

class BaseRouter extends Router {
	constructor(config) {
		config.fnName = path.basename(config.baseDir);
		super(config);
	}
}

module.exports = BaseRouter ;
