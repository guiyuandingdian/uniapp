const config = {
	tokenKey : "uniIdToken" ,
	tokenExpiredKey : "uniTokenExpired" ,
	userStateKeys : ["uniIdToken" , "uniTokenExpired" , "base-menus" , "base-user" , "base-permissions" ,"beforeLoginPage"] ,
	checkAuth : false , //请求API接口时是否进行鉴权
	staticAuths : [] , //静态权限地址，适用于所有用户
	hasAuth:function(urls){ //是否具有某项权限的鉴权函数，urls可接收为数组或字符串
		if (!urls) return true ;
		
		//从本地取出菜单数据
		let auths = uni.getStorageSync("base-permissions") || [];
		
		//默认静态权限列表
		let staticAuths = uni.$b.getValue("staticAuths") || [] ; 
		auths.push(...staticAuths);
		
		if ( auths.length == 0 ) {
			console.log("permission data was not found when verifying permissions");
			return false ;
		}
		
		//统一为数组
		if (uni.$b.isString(urls)) {
			urls = [urls] ; 
		}
		
		for(let url of urls){
			//去除参数
			var index = url.indexOf("?");
			if(index > -1){
				url = url.substr(0,index);
			}
			
			//验证是否包含当前的url
			var hasAuth = auths.some( item=> item == url );
			if (hasAuth) {
				return true ;
			}
		}
		
		uni.$b.log("noAuth:" , urls );
		
		return false ;
	},
	
	isLogin(){
		//本地token
		let tokenExpired = uni.getStorageSync(uni.$b.getValue("tokenExpiredKey"));
		let token = uni.getStorageSync(uni.$b.getValue("tokenKey"));
		return !!token && tokenExpired > Date.now() + 5 * 60 * 1000
	},
	
	components : {
		// mainColor : "#0e0d0c" , //主题色，将影响组件的颜色
		// mainInverse : "#f6ca9d" , //主题色作为背景时对应的文字颜色
		// confirmColor : "#8B4512" , //弹窗确认按钮的文字颜色
		mainColor : "#676FFC" , //主题色，将影响组件的颜色
		mainInverse : "#fff" , //主题色作为背景时对应的文字颜色
		confirmColor : "#676FFC" , //弹窗确认按钮的文字颜色
		
		highlightColor : "#e1251b" , //文字高亮的颜色
		required : true ,//默认所有的表单元素是否必填
		requiredMark : true , //表单必填时是否显示必填标记
		autoPlaceholder : true , //输入框组件根据title自动显示占位提示信息
		blurCheck : false , //表单失去焦点时即刻校验
		errorType : "toast" , //表单校验的错误提示方式：toast、underline
		titleKey : "title" , //列表数据中标题的键名
		valueKey : "value" , //列表数据中值的键名
		remarkKey : "remark" , //列表数据中备注的键名
		disabledKey : "disabled" , //列表数据中是否禁用的键名
		spliter : "," , //字符串类型的数据分割为数组时的分隔符，用于checkbox、multi-select等组件传入字符串类型value时自动分割为数组使用
		container:{ //container容器的响应式宽度
			width : ["100%","440px","720px","960px","1140px","1440px"],
			gutter : ["30rpx","30rpx","0"]
		},
		label:{
			titleClass : 'gray' , 
			titleWidth : 65 , //默认标题宽度
			position : 'left' , //默认位置：left、top、auto
			align : "left" //标题对齐方式：left、center、right
		},
		row:{
			gutter : "10rpx"  //分栏的padding-left与padding-right，纯数字代表px，也可以带单位：px、rpx、rpx、%等
		},
		link:{
			webViewOpenType : "navigateTo" , ////小程序中打开外链时，跳转的含有webView组件的页面的默认跳转方式
			webViewPath : "/pages/webView/webView" , //小程序中打开外链时，跳转的含有webView组件的页面的路径
			webViewKey : "src" , //小程序中打开含有webView页面时，携带的外链的键名
			copTips : "已复制" //复制链接时的提示文字
		},
		btn:{
			loadingType : "icon" , //loading的类型，icon、toast、none
			msgType : "auto" , //请求结束时反馈消息类型，icon、toast、message、auto、none
			minWidth : "" ,//按钮的最小宽度
			exclusive : false //当前按钮发送异步请求时，页面内的其他按钮将进入禁用状态直到本次请求结束
		},
		modal:{
			"modalClass" : "whiteBg rds10,whiteBg rds13" ,
			"headerClass" : "flex pd fz16,flex ptb20 plr30 fz16" ,
			"bodyClass" : "plr ptb10,ptb10 plr30" ,
			"footerClass" : "ptb20 plr30" ,
			"closeIcon" : "bIcon-multiply"
		},
		drawer:{
			"drawerClass" : "whiteBg",
			"headerClass" : "flex ptb10 plr fz16" ,
			"bodyClass" : "plr ptb10,pd" ,
			"closeIcon" : "bIcon-multiply",
			"footerClass" : "pd20 whiteBg"
		},
		input:{
			inputClass : "whiteBg bd rds3" ,
			showPassword : true , //是否默认显示密码状态切换图标
			clearable : true // 输入框有值时，默认是否显示清空图标
		},
		textarea:{
			maxHeight : "400rpx" , //文本框的最大高度
			textareaClass : "bd rds3"
		},
		form:{
			gutterBottom : '40rpx' , //内部表单元素的下边距，默认单位px，支持rpx单位，响应式属性
			sign : false , //数据提交之前是否进行加密
			getSignStr : function( value , name){ //数据加密算法，value为当前的表单值，name为表单的name
				return uni.$b.md5(value).toUpperCase() ;
			}
		},
		select:{
			inputClass : "whiteBg bd rds3" ,
			clearable : true //已选择值时，是否可以清空选择
		},
		tab:{
			indexValue : false ,
			barClass : "rds20" ,
			tabClass : "" ,
			activeClass : ""
		},
		table:{
			align : "left" , //表格横向对齐方式，支持left、right、center
			verticalAlign:"middle" , //表格纵向对齐方式，支持top、middle、bottom
			titleWidth : 45 //type为card、position为left时，标题的默认宽度。
		},
		message:{
			//消息提示类型
			typeList : [
				{ type : "ok" , icon : "bIcon-okFill" , iconColor : "#07c160" } ,
				{ type : "fail" , icon : "bIcon-closeFill" , iconColor : "#e1251b" } ,
				{ type : "warn" , icon : "bIcon-warnFill" , iconColor : "#f69c00" } 
			]
		},
		copy:{
			type : "message" //提示信息类型，message、toast
		},
		image:{
			loadingType : "circle",//图片加载效果
			defaultIcon : "bIcon-pic op8",
			defaultSrc : "",
			errorSrc : "",
			errorIcon : "bIcon-loadFail op3",
			lazyLoad : false,
			loadingDelay:300
		},
		page:{
			pageNumberKey : "pageNumber" ,
			pageSizeKey : "pageSize"
		},
		pageNav:{
			hideOnSinglePage : false 
		},
		time:{
			format : "minute"
		},
		price:{
			unit : "yuan" ,
			prefix : "￥" ,
			suffix : ""
		},
		agreement:{
			confirmText : "我已阅读并同意" ,
			emptyPrefix : "请阅读"
		},
		title:{
			type : "bar"
		},
		tag:{
			tagClass : "",
			colors : ["#F74F0E","#07c160","#FFC300","#e1251b","#FC5E9B","#0081ff","#6739b6","#8B4512"]
		},
		menu:{
			collapse : false ,
			singleOpened : true ,
			allOpened : true 
		},
		menuItem:{
			bgColor : "#1c1d21" ,
			color : "#fff",
			titleClass : "",
			activeClass : "" ,
			activeBgColor : "" ,
			activeColor : "#f6ca9d" ,
			height : "53px"
		},
		subMenu:{
			bgColor : "#0f1017" ,
			color : "#fff",
			titleClass : "",
			activeClass : "" ,
			activeBgColor : "#27272e" ,
			activeColor : "#f6ca9d" ,
			subColor : "#7b7b7b" ,
			subActiveColor : "#7b6e61" ,
			subClass : "fz12",
			height : "53px"
		},
		datepicker:{
			type : "datetime" ,
			valueType : "timestamp",
			endValueType : "timestamp",
		}
	},
	
	frequency : {
		once : 200 , //默认防抖间隔
		onceByOnce : 200 //默认节流间隔
	},
	
	request:{
		apiType : "uniCloud" , //默认API请求的类型，支持uniCloud、http两种方式
		baseUrl : "" , //请求域名，apiType为http时有效
		devBaseUrl : "" , //测试环境请求域名，apiType为http时有效
		method : "get" , 
		caches:[], //本地缓存地图
		sign(data){
			return {} ;
		},
		/**
		 * @description 全局请求加载状态
		 */
		loading : {
			show: true ,
			mask: false,
			time : 100 , //超过该时间未返回响应结果时显示loading，单位ms
			keepTime : 500
		},
		
		handled : true , //是否执行默认响应反馈：业务响应状态不成功时，使用toast提示错误信息。
		
		/**
		 * @description 全局请求拦截器，为方便拓展更多能力，如需修改，请尽量兼容当前拦截器逻辑
		 * @return {Promise}
		 */
		inters : function(){
			return this.next() ;
		}
	},
	
	response:{
		isOkState : function(res){ //接收请求结果参数，用于判断业务处理成功
			return uni.$b.isNull(res.code) || res.code == 'ok' ;
		},
		isFailState : function(res){ //接收请求结果参数，用于判断业务处理失败，需要提示错误信息
			return res.code == 'fail' ;
		},
		idKey : "_id" ,
		msgKey : "message" ,
		listKey: "list" , //返回列表数据的key，支持深层键名，如："data.list"
		datasKey: "data" , //返回单条数据的key，支持深层键名，如："data.data"
		getPage : (res) => res.page  //组装分页数据
	},
	
	// 国际化
	locale: 'zh-CN',
	// 引入语言文件
	messages: {}
	
}

import {deepMerge , getDeepVal} from "../../object/src/base-object.js" ;
import zhCN from "../../locale/src/lang/zh-CN.js" ;

/**
 * @description 配置全局配置信息
 */
function setConfig(myConfig = {}){
	deepMerge(config , myConfig) ;
	//初始化中文包，不存在时赋值为zhCN
	getValue("messages.zh-CN" , zhCN) ;
	//初始化本地语种
	var base_locale = uni.getStorageSync("base_locale");
	if (base_locale) {
		config.locale = base_locale ;
	}
}


/**
 * @description 从配置信息中取值
 * @param {Object} keys 取值路径，多个使用英文.连接
 * @param {Object} defaultValue 可选参数，若不存在时，赋予并返回默认值
 */
function getValue(keys , defaultValue){
	return getDeepVal(config , keys , defaultValue ) ;
}

export {
	setConfig ,
	getValue
};