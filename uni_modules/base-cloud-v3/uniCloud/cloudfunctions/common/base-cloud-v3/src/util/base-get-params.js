const querystring = require("querystring");
const CONTENT_TYPE = "content-type";
const JSON_TYPE = "application/json";
const FORM_TYPE = "application/x-www-form-urlencoded";

function isUrl(ctx) {
	const env = ctx.env;
	if (env && env.MP_SOURCE === "http") {
		return true;
	}
	return !!(ctx.event.httpMethod && ctx.event.headers);
}

function initContextType(headers) {
	const key = Object.keys(headers).find(
		(key) => key.toLowerCase() === CONTENT_TYPE
	);
	if (key) {
		headers[CONTENT_TYPE] = headers[key].toLowerCase();
		if (key !== CONTENT_TYPE) {
			delete headers[key];
		}
	} else {
		headers[CONTENT_TYPE] = JSON_TYPE;
	}
}

function setData(ctx, query, headers, httpMethod) {
	ctx.data = {};
	if (httpMethod === "GET") {
		ctx.data = query;
		return;
	}
	let body = ctx.event.body ;
	if (body) {
		const contextType = headers[CONTENT_TYPE];
		if (contextType === JSON_TYPE) {
			try {
				ctx.data = JSON.parse(body);
			} catch (e) {
				ctx.data = body;
			}
		} else if (contextType === FORM_TYPE) {
			ctx.data = querystring.parse(body);
		} else {
			ctx.data = body;
		}
	}
}

module.exports = function getParams(ctx) {
	//判断是否URL化
	if (!isUrl(ctx)) {
		return;
	}
	const { headers, httpMethod, queryStringParameters: query } = ctx.event;

	//格式化content-type
	initContextType(headers);

	//参数
	setData(ctx, query, headers, httpMethod);

	return ctx.data;
};
