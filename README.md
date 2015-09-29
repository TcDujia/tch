##tch
####基于fis的前端解决方案


###安装
* 安装nodejs
* 打开命令行工具,比如git bash,babun,cmder等
* 使用npm安装tch组件

```bash
//由于npm的主站在国外,所以我们需要安装nrm,nrm可以将npm源切换到taobao镜像上
npm install -g nrm 
//添加npm 内部缓存服务器
nrm add ly "http://172.16.51.21:8765" 
//检查缓存服务器是否运行
nrm test ly  
 //使用内部镜像
nrm use ly
// 等待tch完成,大概1分钟
npm install -g tch  
```
####详细请见http://172.16.51.16:8090/pages/viewpage.action?pageId=557916

###升级日志
####.5.5
* tch-command-pack优化,增加了分目录打包功能
