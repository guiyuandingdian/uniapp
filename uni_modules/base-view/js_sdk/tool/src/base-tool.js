// #ifdef H5
import "./clipBoard.js" ;
// #endif

import {getValue} from "../../config/src/base-config.js" ;
import {isNull , isTrue , isString} from "../../validate/src/base-type.js" ;
import {localeB} from "../../locale/src/base-locale.js" ;

/**
 * @description 判断当前为开发环境
 * @return {Boolean} 是否为开发环境
 */
function isDev(){
	return process.env.NODE_ENV === 'development' ;
}

function log(){
	if (isDev()) {
		console.log(...arguments) ;
	}
}

function getLocalData (key , defaultValue) {
	let data = uni.getStorageSync(key) ;
	return isNull(data) ? defaultValue : data ;
}

/**
 * @description 显示提示信息
 */
function showTips(msg , icon = 'none'){
	if (!msg) {
		return ;
	}
	if (msg.length < 15) {
		uni.showToast({
			title: msg ,
			icon ,
			duration: msg.length > 5 ? 3000 : 2000
		});
		return ;
	}
	showModal({
		content: msg ,
		showCancel:false
	});
}

function showToast(msg , icon = 'none'){
	showTips(msg , icon);
}


/**
 * @description 显示模态框
 */
function showModal(config={}){
	let _config = {
		title : localeB("modal.tips") 
		// #ifndef MP-TOUTIAO
		, confirmColor : getValue("components.confirmColor")
		// #endif
	};
	uni.showModal(Object.assign(_config , config));
}


/**
 * @description 将一个度量数值转为px
 * @param {String} value 数值，px、upx、rpx、%等
 * @param {Number} fatherSize 参考父级尺寸
 */
function parsePx(value , fatherSize ){
	if (isNull(value) || value == 'auto') {
		return "" ;
	}
	let { width , height } = uni.$b.getSafeArea() ;
	fatherSize = fatherSize || width ;
	value = value + '' ;
	let v = parseFloat(value) ;
	if (value.indexOf("%") > -1) {
		value = fatherSize * v / 100 ;
	}else if (value.indexOf("vw") > -1) {
		value = width * v / 100 ;
	}else if (value.indexOf("vh") > -1) {
		value = height * v / 100 ;
	}else if (value.indexOf("upx") > -1 || value.indexOf("rpx") > -1) {
		value = width > 476 ? v/2 : v / 2 * (width / 375) ;
	}
	let intValue = parseInt(value) ;
	return intValue % 2 == 0 || intValue === value  ? intValue : intValue + 1 ;
}

function getSafeArea(){
	let sysInfo = uni.getSystemInfoSync() ;
	// #ifdef H5 
	return sysInfo.safeArea ;
	// #endif
	// #ifndef H5 
	return { width : sysInfo.windowWidth , height : sysInfo.windowHeight } ;
	// #endif
}


function hasSlots(name){
	// #ifdef MP-ALIPAY
	if(!my.canIUse("component2")){
		console.error("未启用component2编译，请点击开发工具右上角的详情按钮，在项目配置中开启。");
	}
	name = name ? name : "$default" ;
	return ( !!this.$slots && !!this.$slots[name] && this.$slots[name].length > 0) || ( !!this.$scopedSlots && !!this.$scopedSlots[name] && this.$scopedSlots[name].length > 0) ;
	// #endif
	// #ifndef MP-ALIPAY
	name = name ? name : "default" ;
	return !!this.$slots[name] || !!this.$scopedSlots[name] ;
	// #endif
}

function getSlots () {
	return [...arguments].reduce( (data , name) => {
		data[name] = hasSlots.call(this , name) ;
		return data ;
	},{});
}

function getTrues () {
	return [...arguments].reduce( (data , name) => {
		data[name] = isTrue(this[name]) ;
		return data ;
	},{});
}

function getNumbers () {
	return [...arguments].reduce( (data , name) => {
		data[name] = Number(this[name]) ;
		return data ;
	},{});
}

async function getTempFileUrl (fileID) {
	if (!fileID || fileID.indexOf("cloud://") != 0) {
		return fileID ;
	}
	let {fileList} = await uniCloud.getTempFileURL({fileList : [fileID]});
	let {code , tempFileURL} = fileList[0] ;
	if (code == "STORAGE_EXCEED_AUTHORITY") {
		console.error("该fileID不是当前客户端环境生成，需在服务端获取临时链接");
	}
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

export {
	getTempFileURL ,
	isDev ,
	log ,
	showTips ,
	showToast ,
	showModal , 
	parsePx ,
	getSafeArea ,
	getLocalData ,
	hasSlots ,
	getSlots ,
	getTrues ,
	getNumbers
}