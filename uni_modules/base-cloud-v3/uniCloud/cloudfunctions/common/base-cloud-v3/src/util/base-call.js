function dealUrl(url) {
	let index = url.indexOf("/");
	return {
		name: index == -1 ? url : url.substr(0, index),
		action: index == -1 ? "" : url.substr(index + 1)
	};
}

async function call(url, data) {
	let {name,action} = dealUrl(url);
	let {result} = await uniCloud.callFunction({
		name ,
		data: {
			action ,
			data
		}
	});
	return result ;
}

module.exports = {
	call
}
