// exports.log4j = require('./log4jConfig');
let log4j = require('./log4jConfig');
exports.boot = function() {
	log4j.set();
}