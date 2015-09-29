var util = {
    getConf: function(){
        var thisPath = fis.util.realpath(process.cwd()),
            filename = "tch-conf.js",
            confFilePath = thisPath+"/"+filename,
            cwd = thisPath,pos = cwd.length,
            root;
        do {
            cwd  = cwd.substring(0, pos);
            if(fis.util.exists(confFilePath)){
                root = cwd;
                break;
            } else {
                confFilePath = false;
                pos = cwd.lastIndexOf('/');
            }
        } while(pos > 0);
        if(!confFilePath){
            fis.log.error("当前目录不存在tch-conf配置文件,请进入对应的子目录下进行构建操作!");
            return;
        }
        fis.project.setProjectRoot(root);
        require(confFilePath);
    }
};
module.exports = util;