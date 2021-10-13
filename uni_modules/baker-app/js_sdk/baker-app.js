import Vue from 'vue';

import basePay from "./base-payment.js" ;

Vue.prototype.basePay = basePay ;

Vue.prototype.devTip = function () {
	uni.$b.showToast("暂未开放");
}

function fullscreen(isFullScreen){
	// #ifdef APP-PLUS
	plus.navigator.setFullscreen(isFullScreen);
	// #endif
}

function systemNav(isShow){
	// #ifdef APP-PLUS
	if (isShow) {
		plus.navigator.hideSystemNavigation();
	}else{
		plus.navigator.showSystemNavigation();
	}
	// #endif
}

export default {
	fullscreen ,
	systemNav
}