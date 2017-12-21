/**
 * 
 * V1.0.0
 * 锁清除预处理
 * 和服务注册有关
 * 
 */

let path = require('path');
let fs = require('fs');

let rt = path.join(process.cwd(), 'runtime')
let lock = path.join(process.cwd(), 'runtime', 'lock');
let fsExistsSync = function (path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

if(!fsExistsSync(rt)) {
    fs.mkdirSync(rt)
}
if (fsExistsSync(lock)) {
  fs.unlinkSync(lock)
}
