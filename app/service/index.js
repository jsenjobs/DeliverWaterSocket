let notify = require('./notify')
let queryorder = require('./queryorder')
let models = {
	'notify' : notify,
	'queryorder' : queryorder,
}

exports.boot = function(app) {
    app.use(function(req,res, next) {
        req.models = models;
        return next();
    })
}
