const Enums = require("base-cloud-v3").Enums ;

module.exports = class UserGenderEnum extends Enums {
	
    constructor(){
        super([
            {title : "正常" , value : 0 , key : "normal" } ,
            {title : "禁用" , value : 1 , key : "disabled"} ,
            {title : "审核中" , value : 2 , key : "auditing" } ,
            {title : "审核拒绝" , value : 3 , key : "refused" } 
        ]);
    }
	
}