var fis = module.exports = require("fis");
//固定查找 fis- 打头的插件，让其先加载 tch- 打头的插件，然后才查找 fis- 打头的插件
fis.require.prefixes.unshift('tch');
fis.cli.name="tch";
fis.cli.info=fis.util.readJSON(__dirname+"/package.json");
fis.config.set("system.repos","http://www.less.la/repos");
fis.cli.help = function(type){
    if(!type) type="";
    var content = [
        '',
            '  使用方法: ' + fis.cli.name + " " + type + ' <command> \n',
            '  相关命令帮助,请输入: ' +fis.cli.name + " " + type + ' <command> -h',
        '',
        '  命令:',
        ''
    ];
    fis.cli.help.commands.forEach(function(name){

        var cmd = fis.require('command', name);
        name = cmd.name || name;
        name = fis.util.pad(name, 12);

        if(name.trim() !== type.trim()){
            content.push('    ' + name + (cmd.desc || ''));
        }
    });

    console.log(content.join('\n'));
};
fis.cli.help.commands = [ 'release','clear','pack','count','tmpl','mock','br'];
var tchVer = fis.cli.info.version;
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);
};
checkVersion(function(){
    fis.cli.run( process.argv );
    getBranchVer();
});
function checkVersion(callback){
    var isExist = fis.util.exists(__dirname+"/.versionTemp");
    var versionCfg = isExist ?fis.util.readJSON(__dirname+"/.versionTemp"):false;
    if(!versionCfg){
        updateVersion(callback);
    }else{
        var date = versionCfg.date,
            now = new Date().getTime();
        if(now >= date + 1000 * 60 * 60 * 24){
            logVersion(versionCfg);
            updateVersion(callback);
        }else{
            logVersion(versionCfg);
            callback.call(this);
        }
    }
}


function updateVersion(callback){
    fis.log.notice("tch每天会检查一次版本!");
    fis.log.notice("正在检查tch的版本,请稍候...");
    var http = require("http");
    var req = http.get("http://registry.npm.taobao.org/tch/latest",function(res){
        var str = "";
        res.on("data",function(chunk){
            str+=chunk;
        }).on("end",function(){
            afterResponse(str,callback);
        });
    });
    req.on("error",function(){
        fis.log.notice("fury.io版本查询失败!");
        afterResponse("",callback);
    });
}
function afterResponse(res,callback){
    var data;
    try{
        data = JSON.parse(res);
    }catch(e){
        data = {};
    }
    data.date = new Date().getTime();
    if(data.version && data.version > tchVer){
        logVersion(data);
    }else{
        fis.log.notice("你的tch是最新版本!");
    }
    var content = JSON.stringify(data);
    fis.util.write(__dirname+"/.versionTemp",content);
    callback && callback.call(this);
}
function logVersion(data){
    if(data.version > tchVer){
        fis.log.notice("你的tch版本是:"+tchVer);
        fis.log.notice("最新版本是:"+data.version+",是否需要更新?");
    }
}

function getBranchVer(){
    var now = new Date(),
        nowDay = now.getDay(),
        accDate = new Date("2015-09-08 00:00:00"),
        accVersion = 13;
    var diff = 0;
    //一月的4号肯定是第一周
    var week1 = new Date(2016, 0, 4,0),
        weekday1 = week1.getDay();
    if(weekday1 === 0){
        weekday1 = 7;
    }
    week1.setDate(4-weekday1);
    if((+now) < (+week1)){
        var wIndex = accDate.getWeek();
        diff = accVersion - wIndex;
    }
    var yearNum = Math.ceil(((+now)-(+week1))/ (1000*60*60*24*365))+1;
    var branchVer = now.getWeek()+diff;
    fis.log.notice("今日上线版本号为:"+(""+(yearNum)+"."+(branchVer)+"."+(nowDay?nowDay:7)).red);
}
