let env = require('./env');
let log4j = require('./log');

exports.boot = function(modelConf, projectConf) {
	env.boot(modelConf, projectConf);
	log4j.boot();
}