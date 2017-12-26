let notify = require('./notify')
let models = {
	'notify' : notify,
}

exports.boot = function(app) {
    app.use(function(req,res, next) {
        req.models = models;
        return next();
    })
}
