const Enums = require("base-cloud-v3").Enums ;

module.exports = class SystemConfigEnum extends Enums {
	
    constructor(){
        super([
            {title : "日志清理天数" , value : "LOG_CLEAR_DAYS" , key : "logClearDays"},
            {title : "信息流广告频率" , value : "AD_PAGES" , key : "adPages" },
            {title : "激励视频单日最大次数" , value : "AD_MAX_COUNT" , key : "adMaxCount" },
            {title : "普通用户免广告时长" , value : "NO_AD_TIME" , key : "noAdTime" },
            {title : "被邀请用户免广告时长" , value : "NO_AD_TIME_INVITED" , key : "noAdTimeInVited" },
        ]);
    }
	
}