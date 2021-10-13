import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const adStore = new Vuex.Store({
	state: {
		adDatas : [],
		adIndex : 0 ,
		adpid : ""
	},
	mutations: {
		used( state ) {
			state.adIndex ++ ;
		}
	},
	getters:{
		adData(state){
			return state.adDatas[state.adIndex] ;
		}
	},
	actions:{
		
		init({dispatch , state , getters}, {adpid}){
			if (getters.adData && state.adpid == adpid) {
				return ;
			}
			dispatch("getAdData" , {adpid});
		},
		
		//预加载广告数据
		getAdData({commit , state} , {adpid}){
			// #ifdef APP-PLUS
			if (!adpid) {
				return ;
			}
			let width = uni.getSystemInfoSync().windowWidth - uni.upx2px(80);
			plus.ad.getAds({ adpid, width, count : 3 },
				(res) => {
					state.adIndex = 0 ;
					state.adDatas = res.ads;
					state.adpid = adpid ;
				},
				(err) => {
					console.log(err);
				}
			)
			// #endif
			
			// #ifdef MP-WEIXIN
			wx.preloadAd([ {  unitId: adpid , type: 'banner'} ]) ;
			// #endif
		}
	}
});

export { adStore };