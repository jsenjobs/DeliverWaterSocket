exports.msgServer = require('./mongo/msg.schema.js').msgServer
exports.msgClient = require('./mongo/msg.schema.js').msgClient
exports.userClient = require('./mongo/user.schema.js').userClient
exports.userServer = require('./mongo/user.schema.js').userServer
exports.deliver = require('./mongo/water.order.schema.js').deliver
exports.porder = require('./mongo/water.order.schema.js').porder
