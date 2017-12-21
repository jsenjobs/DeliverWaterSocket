// exports.env = require('./env');
let ENV = require('./env');

exports.boot = function(modelConf, projectConf) {
	ENV.ENVSET(modelConf, projectConf);
}