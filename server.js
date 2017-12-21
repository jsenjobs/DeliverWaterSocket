let log4js = require('log4js');
let logger = log4js.getLogger('server');
let express = require('express');
let http = require('http');
let path = require('path');
let bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser)
let cors = require('cors');
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));

let Apis = require('./mock/mock.api.json');
let dbConf = require('./app/db');
let controller = require('./app/controller');
let service = require('./app/service');

let app = express();
service.boot(app)


// app.use(bodyParser());
// 支持参数解析
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.xml({
  limit: '1MB',   // Reject payload bigger than 1 MB
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  }
}))
app.use(cors());

let errorHandler = require('errorhandler');
if(process.env.NODE_ENV === 'development') {
    app.use(errorHandler({
        dumpExceptions:true,
        showStack:true
    }));
} else if(process.env.NODE_ENV === 'production') {
    app.use(errorHandler());
}
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('x-powered-by', 'Jsen');
    next();
});
*/

controller.boot(app)
dbConf.boot()


app.all('*', function (req, res) {
    res.status(404).json({code:404,msg:'没有此Api', _links:Apis});
});

app.use(function(err, req, res, next){
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({code:401, errCode:401000,msg:'未许可Api'});
        return;
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({'code':500,msg:'发生未知错误', _links:Apis});
});

let PORT = process.env.PORT || 3000;


var server = http.createServer(app);
require('./app/utils/wsocket/socket.initer').init(server)
server.on('error', (err) => {
    logger.error(err);
});
process.on('uncaughtException', (err) => {
    logger.error(err);
    // process.exit(1);
    logger.error(err.stack);
})
function boot () {
    if (app.get('env') === 'test') return;
    server.listen(PORT, function () {
        logger.info('服务器端口：'+PORT)
    });
}

function shutdown() {
    server.close();
}

exports.app = app;
exports.boot = boot;
exports.shutdown = shutdown;
exports.port = PORT;
if(require.main === module) {
    require('./boot');
} else {
    console.log('Running app as a module');
}
