const DataParams = require("./base-data-params.js");
const DataResult = require("./base-data-result.js");
const BaseType = require("./base-type.js");
const BaseObject = require('./base-object');
const BaseArray = require("./base-array");
const BaseFormat = require("./base-format");
const BaseMath = require("./base-math");
const UUID = require("./uuid");
const BaseSign = require("./base-sign");
const BaseCrypto = require("./base-crypto");
const BaseImage = require("./base-img");
const BaseFile = require("./base-file");
const BaseCall = require("./base-call");

module.exports = {
	...BaseFormat,
	...DataParams,
	...DataResult,
	...BaseType,
	...BaseObject,
	...BaseArray,
	...BaseMath,
	...BaseSign,
	...BaseCrypto,
	...BaseImage,
	...BaseFile,
	...BaseCall,
	...UUID
};