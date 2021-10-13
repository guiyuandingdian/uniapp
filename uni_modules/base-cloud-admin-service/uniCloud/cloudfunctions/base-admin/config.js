const { LoginInter, PermissionInter, ResponseInter } = require("base-cloud-v3");
const { OperateLogInter } = require("base-admin");
const uniID = require("uni-id");

const createConfig = require('uni-config-center');
const adminConfig = createConfig({
    pluginId: 'base-cloud-admin', 
    defaultConfig: {
        "tokenKey": "uniIdToken" 
    }
});

const tokenKey = adminConfig.config('tokenKey') ;

module.exports = {
	baseDir: __dirname, // 项目根目录
	middleware: [
		[
			LoginInter({ uniID , tokenKey }), 
			{
				name: "LoginInter",
				enable: true,
				ignore: ["user", "captcha", "operateLog/createLogUrls", "operateLog/getLogUrls"]
			}
		],
		[
			PermissionInter(), // 校验权限
			{
				name: "PermissionInter",
				ignore: ["userCenter/menus", "userCenter/genders"],
				enable: true
			}
		],
		[
			OperateLogInter(), // 操作日志
			{
				name: "OperateLogInter",
				enable: true
			}
		],
		[
			ResponseInter(), // 响应结果
			{
				name: "ResponseInter",
				enable: true
			}
		]
	]
};
