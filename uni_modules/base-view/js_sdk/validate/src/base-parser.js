export function parseByType( key , value , valueType ){
	if (uni.$b.isNull(valueType)) {
		return value ;
	}
	
	//转换函数
	if (uni.$b.isFn(valueType)) {
		return valueType.call( uni.$b.getRoot() , value , key );
	}
	
	//空值
	if (uni.$b.isNull(value)) {
		if (valueType == 'object') {
			return {} ;
		}
		if (valueType == 'array') {
			return [] ;
		}
		return "" ;
	}
	
	if (valueType == 'int') {
		return parseInt(value);
	}
	if (valueType == 'float') {
		return parseFloat(value);
	}
	if ( (valueType == 'boolean' || valueType == 'bool') && uni.$b.isBoolean(value)) {
		return uni.$b.isTrue(value) ;
	}
	if ( ( (valueType == 'object' || valueType == 'json') && uni.$b.isJsonStr(value) ) || (valueType == 'array' && uni.$b.isArrayStr(value) ) ) {
		return JSON.parse(value) ;
	}
	if (valueType.toLowerCase().indexOf("time") > -1) {
		let v = uni.$b.parseDate(value) ;
		if (!uni.$b.isDate(v)) {
			return value ;
		}
		if ( valueType == 'timestamp' ) {
			return v.getTime() ;
		}
		if ( valueType == 'startTimestamp' ) {
			return v.setHours(0,0,0,0) ;
		}
		if ( valueType == 'endTimestamp' ) {
			return v.setHours(23,59,59,999) ;
		}
		if ( valueType == 'startTime' ) {
			v.setHours(0,0,0,0) ;
			return uni.$b.format( v , "seconds" ) ;
		}
		if ( valueType == 'endTime' ) {
			v.setHours(23,59,59,999) ;
			return uni.$b.format( v , "seconds" ) ;
		}
	}
	
	if( valueType == 'string'){
		return uni.$b.isArray(value) || uni.$b.isObject(value) ? JSON.stringify(value) : value + '' ;
	}
	return value ;
}