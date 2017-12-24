

// 通过阿里publickey验证是否是阿里调用的
exports.checkIsAliNotify = function(params) {
  let sign = params.sign
  let content = raw(params)
  return verify(content, sign)
}


let EN = process.env
let alipaypublickey = EN.alialipaypublickey //
alipaypublickey = createPrivatePem(alipaypublickey, '\n', 64)
alipaypublickey = "-----BEGIN PUBLIC KEY-----\n" + alipaypublickey + '-----END PUBLIC KEY-----\n'
const crypto = require('crypto')
function verify(sdata, sign) {
  let verifier = crypto.createVerify('RSA-SHA1')
  verifier.update(new Buffer(sdata, 'utf-8'))
  return verifier.verify(alipaypublickey, sign, 'base64')
}
function raw (args) {
	let keys = Object.keys(args)
	keys = keys.sort()
	let newArgs = {}
	keys.forEach(key => {
		if(key != 'sign' && key != 'sign_type' && args[key]) {
			newArgs[key] = decodeURIComponent(args[key])
		}
	})
	let string = ''
	for(let k in newArgs) {
		string += '&' + k + '=' + newArgs[k]
	}
	string = string.substr(1)
	return string
}

/**
 * 在指定位置插入字符串
 * @param str
 * @param insert_str
 * @param sn
 * @returns {string}
 */
function createPrivatePem(str, insert_str, sn) {
  var newstr = "";
    for (var i = 0; i < str.length; i += sn) {
        var tmp = str.substring(i, i + sn);
        newstr += tmp + insert_str;
    }
    return  newstr
}
