let schedule = require("node-schedule");
let log4js = require('log4js');
let logger = log4js.getLogger('Task');
let httpinvoke = require('httpinvoke');
let Redis = require('../db/redis.init')
function serverRegister() {
	let succeedDelay = 1000 * 60
	let lastTickTime = 0
	schedule.scheduleJob('*/1 * * * * *', function() {
		if(lastTickTime + succeedDelay < Date.now()) {
			lastTickTime = Date.now()
			let address = encodeURIComponent(process.env.Address)
			let name = encodeURIComponent(process.env.name)
			let desc = encodeURIComponent(process.env.desc)
			httpinvoke('http://'+process.env.Register+'/register/register?address='+address+'&name='+name+'&desc='+desc, 'GET', function(err, body, statusCode, headers) {
			    if(err || !body) {
			    	lastTickTime = 0
			        logger.error('Failure', err);
			        return
			    }
				let json = '';
				try {
					json = JSON.parse(body);
				} catch(e) {
					lastTickTime = 0
					console.log(body)
				}
				if (err || !json || !json.code == 0) {
					lastTickTime = 0
					logger.error('no register server at:'+'http://'+process.env.Register+'/register/register?address='+address+'&name='+name+'&desc='+desc)
				} else {
					logger.info('register succeed at time:'+new Date())
				}
			})
		}
　})
}


exports.RegisterTask = function() {
	serverRegister()
}
