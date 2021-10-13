async function callSlient (config = {}) {
	return uni.$b.call( Object.assign( {} , {
		loading : {show : false} ,
		handled : false 
	} , config ) );
}

export default {
	
	//刷新推荐书单
	async refreshRecommends(url , params){
		return await uni.$b.call("baker/api/recommend/bookPage" , params);
	},
	
	//请求单章节数据
	async getChapterInfo(bookId , chapterNumber) {
		let { data } = await callSlient({
			url: "baker/api/chapter/info",
			data: { bookId , chapterNumber },
			cache: false ,
			handled : true 
		});
		return data;
	},
	
	//加入书单
	async addToShelf(bookId){
		let {code} = await uni.$b.call("baker/user/history/addShelf" , {bookId});
		return code == "ok" ;
	},
	
	//批量保存历史记录
	async batchSaveHistory(history , key) {
		let url = key == "baker_history" ? "baker/user/history/batchSave" : "baker-cartoon/history/batchSave" ;
		let {code} = await callSlient({
			url ,
			data: { history }
		});
		return code == "ok" ;
	},
	
	//保存历史记录
	async saveHistory(data) {
		let {code} = await callSlient({
			url: "baker/api/history/save",
			data 
		});
		return code == "ok" ;
	},
	
	//保存免广告奖励发放记录
	async getNoAdReward(){
		let res = await uni.$b.call({
			url : "baker/api/ad/getNoAdReward" ,
			sign : true 
		});
		return res ;
	},
	
	async getSupriseReward(){
		let res = await uni.$b.call({
			url : "baker/user/ad/getSupriseReward" ,
			sign : true 
		});
		return res ;
	},
	
	async getCoinReward(){
		let res = await uni.$b.call({
			url : "baker/user/ad/getCoinReward" ,
			sign : true 
		});
		return res ;
	},
	
	async getChanceReward(){
		let res = await uni.$b.call({
			url : "baker/user/ad/getChanceReward" ,
			sign : true 
		});
		return res ;
	},
	
	//获取抽奖结果
	async getLuckyResult(){
		let res = await callSlient({
			url : "baker/user/lucky/getResult"
		});
		return res ;
	},
	
	//保存频道数据
	async saveChannel(channel){
		let res = await callSlient({
			url : "baker/user/user/saveChannel" ,
			data : {channel}
		});
		return res ;
	},

	//预加载章节数据
	async preloadChapter(bookId,chapterNumber){
		let res = await uni.$b.call({
			url : "baker/api/chapter/preload" ,
			data : {chapterNumber,bookId}
		});
		return res ;
	},
	
	//首页频道
	async getRecommendChannels(){
		let {list} = await callSlient({
			url : "baker/api/recommend/channels" ,
			cache : true 
		});
		return list ;
	},
	
	async getChannels(){
		let {list} = await callSlient({
			url : "baker/api/category/channels" ,
			cache : true 
		});
		return list ;
	},
	
	//更新分享海报
	async saveSharePoster(baker_share_poster , baker_share_poster_time){
		return await callSlient({
			url : "baker/user/user/saveSharePoster", 
			data : {baker_share_poster , baker_share_poster_time}
		});
	},
	
	//上报阅读时间
	async updateReadTime(){
		if (!uni.$b.isLogin()) return ;
		return await callSlient({
			url : "baker/user/user/updateReadTime"
		});
	},
	
	//领取红包
	async receivePacket(_id){
		let res = await uni.$b.call({
			url : "baker/user/redpacketRecord/save" ,
			data : {_id}
		});
		return res ;
	},
	
	//申请提现
	async withdraw(data){
		return await uni.$b.call({
			url : "baker/user/withdrawRecord/save" ,
			data 
		});
	},
	
	//余额购买vip
	async buyVip(vipCardId){
		return await uni.$b.call("baker/user/vipOrder/balancePay", {vipCardId});
	},
	
	//更新头像
	async setAvatar(avatar){
		return await uni.$b.call("baker/user/user/setAvatar", {avatar});
	},
	
	//更新昵称
	async setNickname(nickname){
		return await uni.$b.call("baker/user/user/setNickname", {nickname});
	},
	
	//更新性别
	async setGender(gender){
		return await uni.$b.call("baker/user/user/setGender", {gender});
	}
}