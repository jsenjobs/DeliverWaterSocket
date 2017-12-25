
let MsgServer = require('../../model').msgServer
let MsgClient = require('../../model').msgClient
let Promise = require('bluebird')
var sockets = {
  client:{},
  server:{}
}
exports.AddServer = function(socket) {
  let id = socket.id
  if(id) {
    if(!sockets.server[id]) {
      sockets.server[id] = socket
    } else {
      sockets.server[id].close()
      sockets.server[id] = socket
    }
    onSLogin(socket)
  }
}
exports.AddClient = function(socket) {
  let id = socket.id
  if(id) {
    if(!sockets.client[id]) {
      sockets.client[id] = socket
    } else {
      sockets.client[id].close()
      sockets.client[id] = socket
    }
    onCLogin(socket)
  }
}
exports.DelServer = function(socket) {
  delete sockets.server[socket.id]
}
exports.DelClient = function(socket) {
  delete sockets.client[socket.id]
}
// end socket hadle


// 保证通知必答一次
exports.NotifyClient = function(order, so, nosave) {
  if(nosave) {
    return new Promise(resolve => {
      let socket
      if(so) {
        socket = so
      } else {
        let openid = order.openid
        socket = sockets.client[openid]
      }
      if(socket) {
        socket.sendUTF(JSON.stringify({type:'cnotify', data:order}))
      }
      resolve(true)
    })
  }
  // 保存到Mongo
  return new MsgClient(order).save().then(ok => {
    if(ok) {
      let socket
      if(so) {
        socket = so
      } else {
        let openid = order.openid
        socket = sockets.client[openid]
      }
      if(socket) {
        socket.sendUTF(JSON.stringify({type:'cnotify', data:order}))
      }
      return true
    } else {
      return false
    }
  }).error(_=>false)
}
exports.NotifyServer = function(order, nosave) {
  // 保存到Mongo
  console.log('no server')
  if(nosave) {
    return new Promise(resolve => {
        let servers = sockets.server
        console.log('servers:' + servers)
        for(key in servers) {
          console.log(JSON.stringify({type:'snotify', data:order}))
          servers[key].sendUTF(JSON.stringify({type:'snotify', data:order}))
        }
        resolve(true)
    })
  }
  console.log('save:' + JSON.stringify(order) + order._id)
  return new MsgServer(order).save().then(ok => {
    console.log('ok:' + ok)
    if(ok) {
      let servers = sockets.server
      console.log('servers:' + servers)
      for(key in servers) {
        console.log(JSON.stringify({type:'snotify', data:order}))
        servers[key].sendUTF(JSON.stringify({type:'snotify', data:order}))
      }
      return true
    } else {
      return false
    }
  }).error(_=>false)
}



exports.NotifyResponse = function(type, data) {
  // notify成功 直接删除Mongo中的数据
  if(type === 'ok_snotify') {
    MsgServer.remove({_id: data._id})
  } else if(type === 'ok_cnotify') {
    MsgClient.remove({_id: data._id})
  }
}


function onSLogin () {
  return MsgServer.find().then(orders => {
    if(orders)
      orders.forEach(order => {
        console.log(order)
        exports.NotifyServer(order, true)
      })
    return true
  }).error(_ => false)
}
function onCLogin (socket) {
  return MsgClient.find({openid:socket.id}).then(orders => {
    if(orders)
      orders.forEach(order => {
        console.log(order)
        exports.NotifyClient(order, socket, true)
      })
    return true
  }).error(_ => false)
}
