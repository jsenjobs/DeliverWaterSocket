/**
 * Created by jsen on 2017/4/17.
 */
let lodash = require('lodash')
var log4js = require('log4js');
var logger = log4js.getLogger('RedisIniter');

var redis = require("ioredis");
let bluebird = require('bluebird');
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

let timeout = parseInt(process.env.SessionTimeOut);

let client;


String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}

String.prototype.endWith=function(str){
  var reg=new RegExp(str+"$");
  return reg.test(this);
}
exports.boot = function() {
    let params = require('./utils').getParams(process.env.RedisUrl)
    client = new redis(params.port, params.host)
    let sub = new redis(params.port, params.host)
    // client = redis.createClient(params.port,params.host,{});
    client.on("ready", function () {
      logger.info("Ready");
    });
    sub.on("ready", function () {
      sub.psubscribe('__keyevent@' + 0 + '__:expired');
    });

    client.on("connect", function () {
      logger.info("connect");
    });

    sub.on("pmessage", function (pattern, channel, expiredKey) {
      if(expiredKey.startWith('serverso')) {
        let key = expiredKey.substring(8, expiredKey.length)
        client.lrem('so:server', -1, key)
      }
    });

    client.on("reconnect", function () {
      logger.warn("reconnect");
    });
    client.on("error", function (err) {
      logger.error("error " + err);
    });
}
/*

exports.SetAndOutRemove = function(k,v, timeout) {
    return client.setAsync(k,v).then((res) => {
        return client.expireAsync(k, timeout, _=>{
          exports.Del(k)
        })
    })
}
exports.Get = function(k) {
    return client.get(k)
}
exports.GetAndRemove = function(k) {
    return client.get(k).then(data => {
      client.del(k)
      return data
    })
}
exports.Del = function(k) {
    return client.del(k).then(count => count > 0);
}

exports.registerServer = function (serverAddress) {
  return client.get("serverso"+serverAddress).then(data => {
    if(data) {
      return client.expire("serverso"+serverAddress, 1).then(count => count > 0)
    } else {
      // insert
      return client.set("serverso"+serverAddress, 'ok').then(ok => {
        if(ok === 'OK') {
          return client.expire("serverso"+serverAddress, 1).then(count => count > 0)
        } else {
          return false
        }
      }).then(ok => {
        if(ok) {
          return client.rpush('so:server', serverAddress).then(allCount => {
            return true
          })
        } else {
          return ok
        }
      })
    }
  })
}
exports.randomGetServer = function() {
  return client.llen('so:server').then(len => {
    if(len == 0) return false
    let index = parseInt(Math.random() * len)
    return client.lrange('so:server', index, index).then(array => {
      if (array && array.length > 0) {
        return array[0]
      }
      return false
    })
  }).error(e => {
    return false
  })
}
*/
exports.client = function() {
    return client
}
