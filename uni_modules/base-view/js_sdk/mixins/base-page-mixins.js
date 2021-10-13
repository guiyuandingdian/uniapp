import {setScroll , scrollTo} from "../tool/src/base-scroll.js" ;

/**
 * 页面组件混入
 */
module.exports = {
	
	data(){
		return {
			_basePagePath : "" ,
			_basePageTimer : null ,
			_pageParams : {} ,
			bData : {}
		}
	},
	
	async onLoad(params){
		this._pageParams = params ;
		this._basePagePath = await uni.$b.getPagePath() ;
	},
	
	onShow(){
		/* 此处触发两次的bug 2021.01.17 */
		this._basePageTimer = setTimeout(async function() {
			this._basePagePath = await uni.$b.getPagePath() ;
			uni.$emit("baseOnPageShow" , this._basePagePath );
		}, Math.random() * 100 );
		
		// #ifdef H5 
		getApp() && uni.$b.setDeepValue( getApp() , "globalData.$b_deviceType" , uni.$b.getDeviceType() ) ;
		uni.onWindowResize( uni.$b.onceByOnce( (res)=>{
			let device = uni.$b.getDeviceType(res.size.windowWidth);
			if (getApp().globalData.$b_deviceType.name !== device.name ) {
				getApp().globalData.$b_deviceType = device ;
				uni.$emit("baseMediaChange" , device);
			}
		} , 300 ) ) ;
		// #endif
	},
	
	async onHide() {
		
		clearTimeout(this._basePageTimer);
		
		uni.$emit("baseOnPageHide" , this._basePagePath || await uni.$b.getPagePath() );
		
		// #ifdef H5 || APP-PLUS || MP-WEIXIN
		uni.offWindowResize(e=>e) ;
		// #endif
	},
	
	async onReady(){
		// #ifdef H5
		//修正无法获取scrollTop值的问题
		uni.pageScrollTo({
			scrollTop:0,
			duration:0
		});
		// #endif
		
		uni.$emit("baseOnPageReady", await uni.$b.getPagePath());
	},
	
	onReachBottom(e){
		uni.$emit("baseOnReachBottom", this._basePagePath ) ;
	},
	
	onPullDownRefresh(e){
		uni.$emit("baseOnPullDownRefresh", this._basePagePath ) ;
	},
	
	onUnload(){},
	
	onPageScroll(e){
		setScroll(e);
		uni.$emit("baseOnPageScroll", e) ;
	}
} ;