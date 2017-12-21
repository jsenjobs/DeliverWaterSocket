exports.getParams = function(url) {
	if (!url) {
		return {}
	}
	let p = url.split(/:\/\/|:|@|\/|\?/)
	return {
		type:p[0],
		username:p[1],
		password:p[2],
		host:p[3],
		port:p[4],
		db:p[5],
		param:p[6]
	}
}