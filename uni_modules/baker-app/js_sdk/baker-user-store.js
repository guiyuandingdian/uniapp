import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const userStore = new Vuex.Store({
	state: {
		user : {} ,
		dataLoad : false
	},
	mutations: {
		setData( state  , {user , dataLoad = true }) {
			state.user = user ;
			state.dataLoad = dataLoad ;
		}
	},
	actions:{
		async loadData({state} , {forceUpdate , showLoading} = {}){
			if (state.dataLoad && !forceUpdate) {
				return ;
			}
			let {data} = await uni.$b.call({
				url : "baker/api/user/info",
				loading : {
					show : showLoading === true 
				}
			}) ;
			state.user = data ;
			state.dataLoad = true ;
		}
	}
});

export { userStore };