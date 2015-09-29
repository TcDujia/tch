//设置产出的文件编码为utf8
fis.config.set('project.charset','utf8');

fis.config.set('modules.postpackager', 'simple');
//开始autoCombine可以将零散资源进行自动打包
fis.config.set('settings.postpackager.simple.autoCombine', true);
//配置自动编译的插件
fis.config.merge({
    roadmap : {
        ext : {
            md : 'html',
            less: 'css'
        }
    },
    modules : {
        parser : {
            md : 'marked',
            less: 'less'
        }
    },
   server : {
       type: "node",
       port: "8083",
       root: "."

   },
   deploy: {
        ftp: {
            method: "ftp",
            server:{
                host: "112.124.182.20",
                port: 21,
                user: "hxw0050274",
                pass: "ydx000918"
            },
            //从产出的结果的static目录下找文件
            from : '/build',
            //保存到远端机器的/test目录下
            //这个参数会跟随post请求一起发送
            to : '/test',
            //通配或正则过滤文件，表示只上传所有的js文件
            include : '**.*'
        },
        local : {
            //from参数省略，表示从发布后的根目录开始上传
            //发布到当前项目的上一级的output目录中
            to : './output',
            exclude: /\/node\_modules\//i
        }
   }
});
//combo脚本和样式
fis.config.set('pack', {
    '/build/global.css': [
        '/global/**.less'
    ]
});

//源码编译时屏蔽 node_modules,bin文件夹，屏蔽tch.js,package.json
fis.config.set('project.exclude', /^(\/node\_modules)|^(\/bin)|(tch\.js)|(package\.json)|(\.md)|(LICENSE)/i);
fis.config.set('modules.lint.js', 'jshint');
fis.config.set('modules.test.js', 'phantomjs');
fis.config.set('modules.optimizer.js', 'uglify-js');

fis.config.set('modules.spriter', 'csssprites');
//为所有样式资源开启csssprites
fis.config.set('roadmap.path', [{
    reg: '**.css',
    useSprite: true
}]);
//设置csssprites的合并间距
fis.config.set('settings.spriter.csssprites.margin', 20);
fis.config.set('settings.spriter.csssprites', {
    scale: 0.5
});