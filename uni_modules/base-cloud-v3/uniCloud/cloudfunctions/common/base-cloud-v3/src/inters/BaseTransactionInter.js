const db = uniCloud.database();
module.exports = (code = "fail" , message = "操作失败") => {
	// 返回中间件函数
	return async function auth(ctx, next) {
		const transaction = await db.startTransaction();
		ctx.transaction = transaction ;
		try {
			// 执行后续业务函数
			await next();
			
			//提交事务
			console.log("事务即将提交");
			await transaction.commit();
			console.log("事务已经提交");
			
		} catch (error) {
			console.log("事务即将回滚");
			await transaction.rollback();
			console.log("事务已经回滚");
			ctx.body = {
				code ,
				message : error.message || message
			} ;
			console.error("error =>: ",error);
		}
	};
};
