export default {
	login:{
		logo : ""
	},
	// #ifndef H5
	"debug" : false ,
	// #endif
	// #ifdef H5
	"debug" : true ,
	// #endif
	"request":{
		caches : {
			"baker/api/book/info" : ["baker/user/history/addShelf"]
		},
		inters : async function(){
			
			//执行本次请求
			let datas = await this.next().then(datas => datas).catch( err=>{
				console.error("err: ",err);
				uni.showToast({
					title: '请求失败',
					icon : 'none'
				});
			});
			
			//3.1请求失败
			if (!datas) {
				return ;
			}
			
			//3.2请求成功
			
			//需要登录
			let needLogin = datas.some(data=>data.code == 'invalidToken') ;
			if(needLogin){
				//清理本地用户状态相关缓存
				uni.$b.clearStorage();
				
				//将当前页面路径存入本地缓存，登录成功后回跳使用
				let curPageRoute = await uni.$b.getPageRoute() ;
				uni.setStorageSync("beforeLoginPage", curPageRoute );
				
				if (curPageRoute == 'uni_modules/baker-app/pages/login/login') {
					return ;
				}
				
				//跳转至登录页面
				uni.$b.navigateTo({
					url: "/uni_modules/baker-app/pages/login/login"
				});
				return;
			}
			
			//返回响应结果
			return datas ;
		}
	},
	response:{
		isFailState : function(res){ //接收请求结果参数，用于判断业务处理失败，需要提示错误信息
			return res.code == 'fail' || res.code == 'INVOKE_FUNCTION_FAILED';
		}
	},
	"components" : {
	    "mainColor" : "#FFDA33",
		"mainInverse" : "#000000",
		"confirmColor" : "#ff9800"
	}
}