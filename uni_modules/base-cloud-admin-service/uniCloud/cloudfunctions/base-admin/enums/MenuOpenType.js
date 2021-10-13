const Enums = require("base-cloud-v3").Enums ;

module.exports = class MenuOpenTypeEnum extends Enums {
	
    constructor(){
        super([
            {title : "关闭当前页打开新页面" , value : "redirectTo" } ,
            {title : "打开新页面" , value : "navigateTo" } ,
            {title : "打开Tab页" , value : "switchTab" } ,
            {title : "关闭所有页打开新页面" , value : "reLaunch" } ,
            {title : "新标签页打开页面，仅Web端支持" , value : "_blank" } 
        ]);
    }
	
}