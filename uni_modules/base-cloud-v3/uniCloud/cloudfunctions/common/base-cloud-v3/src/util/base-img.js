const http = require('http');
const https = require('https');

function fetchImage (url , cloudPath) {
	return new Promise((resolve,reject) => {
		if (!url) {
			reject(new Error(`url is required`));
			return ;
		}
		if (!cloudPath) {
			reject(new Error(`cloudPath is required`));
			return ;
		}
		try{
			let Obj = url.indexOf("https://") == 0 ? https : http ;
			Obj.get(url, (res) => {
				let chunks = []; //用于保存网络请求不断加载传输的缓冲数据
				let size = 0; //保存缓冲数据的总长度
			
				res.on('data', function(chunk) {
					chunks.push(chunk); //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
					size += chunk.length; //累加缓冲数据的长度
				});
			
				res.on('end', async (err) => {
					let buffer = Buffer.concat(chunks, size);
					let {fileID} = await uniCloud.uploadFile({
						fileContent: buffer,
						cloudPath
					});
					resolve(fileID);
				});
			});
		}catch(e){
			uniCloud.logger.log(e);
			resolve();
		}
	})
}

module.exports = {
	fetchImage
};