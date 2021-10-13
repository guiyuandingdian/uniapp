const Enums = require("base-cloud-v3").Enums ;

module.exports = class MenuPlatformEnum extends Enums {
	
    constructor(){
        super([
            {title : "全部" , value : "all"},
            {title : "PC端" , value : "pc"},
            {title : "移动端" , value : "mobile"},
            {title : "不展示" , value : "none"} 
        ]);
    }
	
}