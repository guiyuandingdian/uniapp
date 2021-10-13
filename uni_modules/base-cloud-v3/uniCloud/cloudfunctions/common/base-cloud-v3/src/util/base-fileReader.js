var fs = require('fs');
var path = require('path');

class FileReader {
    constructor(baseDir , callBack){
		this.baseDir = baseDir ;
        this.callBack = callBack ;
        this.files = [] ;
    }

    read(){
        if (!fs.existsSync(this.baseDir)) {
           return [] ;
        }
        this.deepPath(this.baseDir);
        return this.files ;
    }

    deepPath(dirPath) {
        try{
            var files = fs.readdirSync(dirPath);
            files.forEach( file =>{
                let filePath = path.join(dirPath , file) ;
                var info = fs.statSync(filePath);
                if (info.isDirectory()) {
                    this.deepPath( filePath );
                } else {
                    let data = {
                        relative : dirPath.replace(this.baseDir , "") ,
                        filePath ,
                        dirPath ,
                        file
                    };
                    this.files.push(data);
                    this.callback && this.callback(data);
                }
            });
        }catch(e){
            //TODO handle the exception
        }
        
    }

}

module.exports = FileReader ;
