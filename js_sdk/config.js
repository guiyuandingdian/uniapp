export default {
	debug : false ,
	chooseGender : true , //初次进入是否让用户选择男生、女生
	login:{
		logo : "/static/logo.png",
		loginTypes:["passwordLogin","smsLogin","weixinLogin","appleLogin","univerifyLogin"] ,
		defaultScene : "passwordLogin",
		forceBindMobile : false ,
		success(res){
			console.log("登录成功 res: ",res);
		},
		cancelAccount(res){
			console.log("注销并绑定到其他账号 res: ",res);
		}
	},
	components : {
		mainColor : "#FFDB3C" , //主题色，将影响组件的颜色
		mainInverse : "#000000" , //主题色作为背景时对应的文字颜色
		confirmColor : "#ff9800" //弹窗确认按钮的文字颜色
	}
}