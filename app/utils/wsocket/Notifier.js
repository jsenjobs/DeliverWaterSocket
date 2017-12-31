
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
  if(socket.id) {
    console.log('del server:' + socket.id)
    delete sockets.server[socket.id]
  }
}
exports.DelClient = function(socket) {
  if(socket.id) {
    console.log('del client:' + socket.id)
    delete sockets.client[socket.id]
  }
}
// end socket hadle


// 保证通知必答一次
exports.NotifyClient = function(order, so, nosave) {
  console.log('notify client')
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
console.log('save c')
  // 保存到Mongo
  return new MsgClient(order).save().then(ok => {
console.log('save c' + ok)
    if(ok) {
      let socket
      if(so) {
        socket = so
      } else {
        let openid = order.openid
        console.log(order.openid)
        console.log(sockets.client)
        socket = sockets.client[openid]
      }
      if(socket) {
        console.log('nott')
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
  if(nosave) {
    return new Promise(resolve => {
        let servers = sockets.server
        for(let key in servers) {
          servers[key].sendUTF(JSON.stringify({type:'snotify', data:order}))
        }
        resolve(true)
    })
  }
  return new MsgServer(order).save().then(ok => {
    console.log('ok:' + ok)
    if(ok) {
      let servers = sockets.server
      for(let key in servers) {
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
    console.log('remove server;' + data._id)
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
