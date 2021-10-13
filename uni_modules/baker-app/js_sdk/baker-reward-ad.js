import {userStore} from './baker-user-store.js';

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		adpid : "" ,
		bannerAdpid : "" ,
		initedTime : 0 ,
		remainCount : 0 , //观看激励视频剩余次数
		noAdTime : 0
	},
	mutations: {
		changeNoAdTime(state, noAdTime) {
			state.noAdTime = noAdTime ;
		},
		used( state , count ) {
			state.remainCount -- ;
		}
	},
	getters:{
		hasAdCount(state){
			return state.initedTime == 0 || state.remainCount > 0 ;
		},
		showAd(state){
			return state.initedTime > 0 && state.noAdTime < Date.now() && !userStore.state.user.baker_vip ;
		}
	},
	actions:{
		//初始化，每隔10分钟刷新一次数据
		async init({commit , state}){
			// if (state.initedTime + 10 * 60 * 1000 > Date.now() ) {
			// 	return ;
			// }
			let res = await uni.$b.call({
				url : "baker/api/ad/getAdData" ,
				loading : { show : false } ,
				handled : false 
			});
			
			//广告位信息
			state.bannerAdpid = res.bannerAdpid ;
			state.adpid = res.adpid ;
			
			//剩余广告次数
			state.remainCount = res.remainCount ;
			//免广告截止时间
			state.noAdTime = res.noAdTime ;
			state.initedTime = Date.now() ;
		}
	}
});

export { store };