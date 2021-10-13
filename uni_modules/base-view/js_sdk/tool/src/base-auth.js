/**
 * @param {Object} provider weixin | alipay
 */
function getCode(provider) {
	return new Promise((resolve, reject) => {
		// #ifndef APP-PLUS || MP-WEIXIN || MP-ALIPAY
		resolve("");
		// #endif
		
		
		// #ifdef MP-WEIXIN || MP-ALIPAY
		uni.login({ 
			provider,
			success(res) {
				resolve(res.code)
			},
			fail(err) {
				reject(new Error('登录失败'))
			}
		})
		// #endif


		// #ifdef APP-PLUS
		plus.oauth.getServices((services) => {
			let authService = services.find((service) => service.id === provider);
			if (!authService) {
				console.error('登录模块未启用')
				reject(new Error('登录模块未启用'));
				return;
			}
			authService.authorize((res) => {
				resolve(res.code)
			}, function(err) {
				if (uni.$b.isObject(err)) {
					let {innerCode , code , message} = err ;
					err.cancel = innerCode == -2 || innerCode == -4 || code == -2 || (message && message.indexOf("取消") > -1) ;
				}
				console.error(err)
				reject(err)
			});
		});
		// #endif
	})
}

async function getWeixinCode() {
	return await getCode("weixin");
}

async function getAlipayCode() {
	return await getCode("alipay");
}

export {
	getCode,
	getWeixinCode,
	getAlipayCode
}
