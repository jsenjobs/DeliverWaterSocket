// 通过key验证是否是阿里调用的
exports.checkIsWxNotify = function(params) {
  return params.sign === sign(params)
}

let EN = process.env
let key = EN.wxsecret //
const crypto = require('crypto')
function sign(params) {
  console.log("签名验证的参数", params)
  let str= raw1(params) + '&key=' + key
  return crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase()
}
function raw1 (args) {
    let keys = Object.keys(args)
    keys = keys.sort()
    let newArgs = {}
    keys.forEach(key => {
      if(key != 'sign')
        newArgs[key.toLowerCase()] = args[key]
    })
    let string = ''
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
}
