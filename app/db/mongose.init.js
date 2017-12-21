/**
 * Created by jsen on 2017/4/17.
 */

let log4js = require('log4js');
let logger = log4js.getLogger('MongoseIniter');

let Promise = require("bluebird");

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

exports.boot = function(){
    let params = require('./utils').getParams(process.env.MongoUrl)
    let url = 'mongodb://127.0.0.1:27017'
    if(params.host && params.port) {
        url = 'mongodb://'+params.host+':'+params.port
    }
    var options = { useMongoClient:true };
    mongoose.connect(url + '/' + (params.db || 'template'), options);
    let conn = mongoose.connection;
    conn.on('error', (err) => {
        logger.error(err);
    })
    // .on('disconnected', this.Init(app))
    conn.once('open', () => {
        logger.info('MongoDB open:'+params.db);
    });
}
