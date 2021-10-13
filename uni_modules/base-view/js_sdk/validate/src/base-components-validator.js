import {isNull} from "./base-type.js" ;

export function isOneOf(prop , value , values , required){
	if ( isNull(value) ) {
		return true ;
	}
	let isValid = values.indexOf(value) > -1 ;
	if (!isValid) {
		console.error(`prop ${prop} must be one of ${JSON.stringify(values)}, got ${value}`);
	}
	return isValid ;
}