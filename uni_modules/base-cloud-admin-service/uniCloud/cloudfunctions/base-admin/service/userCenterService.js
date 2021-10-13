const Service = require("base-cloud-v3").Service;
const uniID = require("uni-id");

module.exports = class UserService extends Service {

	constructor(ctx) {
		super(ctx, "uni-id-users");
	}

	isAdmin(user){
		return user.role && user.role.includes("admin");
	}

	async resetPassword(data){
		const {password} = data;
		if(!!password){
			let {passwordHash , version} = uniID.encryptPwd(password) ;
			data.password = passwordHash ;
			data.password_secret_version = version ;
		}else{
			delete data.password ;
		}
	}
	
};
