const FileReader = require("./base-fileReader")
const { setDeepValue } = require("./base-object")
const path = require("path");
const Enums = require("../BaseEnums.js") ;

class GlobalEnums {

    getData(dir){
        if (null == this.data) {
            this.data = this.getEnums(dir) ;
        }
        return this.data ;
    }

    getEnums(dir){
        let fileDatas = new FileReader(dir).read() ;
        return fileDatas.reduce( ( data , { filePath , relative  , file } ) => {
            let Enum = require(filePath);
			if (Object.getPrototypeOf(Enum) !== Enums ) {
				return data ;
			}
			let fileName = file.replace(".js","").replace("Enums" , "").replace("Enum" , "");
            let keys = relative ? relative.split(path.sep).filter(dir => !!dir).join(".") + "." + fileName : fileName ;
            setDeepValue( data , keys , new Enum() );
            return data ;
        } , {});
    }

}

let globalEnums = new GlobalEnums();

module.exports = globalEnums ;

