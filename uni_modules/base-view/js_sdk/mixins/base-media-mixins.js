import {_getDeviceData} from "../media/src/base-media.js" ;

export default {
	data() {
		return {
			devices:{}, //当前媒体设备数据
			deviceDatas : _getDeviceData() //全部媒体设备数据
		};
	},
	computed:{
		deviceIndex(){
			return this.deviceDatas.findIndex(item=>item.name == this.devices.name ) ;
		},
		isPc(){
			return this.deviceIndex >= 2 ;
		}
	},
	created() {
		this.devices = uni.$b.getDeviceType() ;
		
		// #ifdef H5
		uni.$on("baseMediaChange" , (devices)=>{
			this.devices = devices ;
		})
		// #endif
	},
	methods:{
		/**
		 * @description 数组长度若小于5，则未指定属性的设备上取数组的最后一个元素值
		 * @param {Object} values
		 */
		getByDevice(values){
			if (uni.$b.isNull(values)) {
				return '' ;
			}
			if (uni.$b.isString(values)) {
				values = values.split( uni.$b.getValue("components.spliter",",") );
			}
			if (!uni.$b.isArray(values) || values.length == 0) {
				return values ;
			}
			let len = values.length ;
			return len > this.deviceIndex ? values[this.deviceIndex] : values[len-1] ;
		},
		
		dv(v){
			return this.getByDevice(v);
		},
		
		/**
		 * @description 根据媒体设备获取值并转换为带单位的值
		 * @param {Object} values
		 */
		getUnitValue(values){
			let value = this.getByDevice(values);
			if (uni.$b.isNull(value)) {
				return "" ;
			}
			
			// #ifdef MP-ALIPAY
			/* 支付宝小程序中rpx会被自动转为upx，并且upx无效 2021.01.29 */
			if (/(upx|rpx)$/.test(value)) {
				return `${uni.$b.parsePx(value)}px` ;
			}
			// #endif
			
			return /(px|upx|rpx|auto|vw|vh|%)$/.test(value) ? value : value + 'px' ;
		},
		
		uv(v){
			return this.getUnitValue(v) ;
		},
		
		getPxValue(values , fatherSize){
			let value = uni.$b.parsePx( this.uv(values) , fatherSize)  ;
			if (uni.$b.isNull(value)) {
				return "" ;
			}
			return `${value}px` ;
		},
		
		pv(v , size){
			return this.getPxValue(v , size) ;
		},
		
		getBoolValue(values){
			return uni.$b.isUnstrictTrue(this.dv(values)) ;
		},
		
		bv(v){
			return this.getBoolValue(v) ;
		},
		
		getDvs(){
			return [...arguments].reduce( (data,prop) => {
				data[prop] = this.dv(this[prop]) ;
				return data ;
			}, {});
		},
		
		getUvs(){
			return [...arguments].reduce( (data,prop) => {
				data[prop] = this.uv(this[prop]) ;
				return data ;
			}, {});
		},
		
		getPvs(names = [] , width ){
			return names.reduce( (data,prop) => {
				data[prop] = this.pv(this[prop] , width ) ;
				return data ;
			}, {});
		}
	}
} ;