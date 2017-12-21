exports.boot = function() {
	require('./mongose.init').boot()
	require('./redis.init').boot()
	// mysql require('./mysql.init').boot()
}
