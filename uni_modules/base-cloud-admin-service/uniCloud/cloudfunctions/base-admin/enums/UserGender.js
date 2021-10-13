const Enums = require("base-cloud-v3").Enums ;

module.exports = class UserGenderEnum extends Enums {
	
    constructor(){
        super([
            {title : "未知" , value : 0 } ,
            {title : "男" , value : 1 } ,
            {title : "女" , value : 2 } 
        ]);
    }
	
}