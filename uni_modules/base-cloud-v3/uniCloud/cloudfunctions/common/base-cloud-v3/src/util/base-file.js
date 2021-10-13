const {isString , isObject , isArray} = require("./base-type");

async function getTempFileUrl (fileID) {
	if (!fileID || fileID.indexOf("cloud://") != 0) {
		return fileID ;
	}
	let {fileList} = await uniCloud.getTempFileURL({fileList : [fileID]});
	let {tempFileURL} = fileList[0] ;
	return !!tempFileURL ? tempFileURL : fileID ;
}

async function getTempFileURL (fileID) {
	if (!fileID) {
		return fileID ;
	}
	if (isString(fileID)) {
		return await getTempFileUrl(fileID);
	}
	let promises = fileID.map(item => getTempFileUrl(item));
	return await Promise.all(promises);
}

async function setTempFileURL (data , keys) {
	if (!keys) {
		return ;
	}
	if (isArray(data)) {
		await Promise.all(data.map(item => setTempFileURL(item , keys) ));
		return ;
	}
	if (!isObject(data)) {
		return ;
	}
	let list = keys.split(",");
	let fileIDs = list.map(key => data[key]);
	let urls = await getTempFileURL(fileIDs);
	urls.forEach((url,index) => {
		let curKey = list[index] ;
		data[curKey] = url ;
	})
}

/**
 * @param {Object|Array} fileID
 */
async function deleteFile (fileID) {
	if (!fileID || fileID.length == 0) {
		return ;
	}
	if (!isArray(fileID)) {
		fileID = [fileID] ;
	}
	try{
		return await uniCloud.deleteFile({
			fileList:fileID
		})
	}catch(e){
		return ;
	}
}

module.exports = {
	getTempFileURL ,
	setTempFileURL ,
	deleteFile
}