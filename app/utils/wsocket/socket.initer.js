
let log4js = require('log4js');
let logger = log4js.getLogger('SocketIniter');
const WebSocketServer = require('websocket').server
let Notifier = require('./Notifier')

exports.init = function(httpServer) {
  const wsServer = new WebSocketServer({
      httpServer,
      autoAcceptConnections: true
  })
  wsServer.on('connect', socket => {
    logger.info('connect')
    // socket.sendUTF(JSON.stringify({type:'echo', data:'echo data'}))

    socket.on('message', msg => {
      if(msg.type === 'utf8') {
        try{
          let data = JSON.parse(msg.utf8Data)
          let type = data.type
          if(type === 'slogin') {
            logger.info('slogin')
            socket.id = data.id
            socket.utype = 'server'
            Notifier.AddServer(socket)
            socket.sendUTF(JSON.stringify({type:'ok_login'}))
          } else if(type === 'clogin') {
            logger.info('clogin')
            socket.id = data.id
            socket.utype = 'client'
            Notifier.AddClient(socket)
            socket.sendUTF(JSON.stringify({type:'ok_login'}))
          } else if(type === 'ping') {
            logger.info('ping')
            socket.sendUTF(JSON.stringify({'type':'ping', 'msg':'hb'}))
          } else {
            Notifier.NotifyResponse(type, data.data)
          }
        } catch(e) {
          socket.sendUTF(JSON.stringify({'type':'err', 'msg':e}))
        }
      }
    }).on('close', (reasonCode, description) => {
      logger.info('close')
      if(socket.utype === 'client') {
        Notifier.DelClient(socket.id)
      } else {
        Notifier.DelServer(socket.id)
      }
    }).on('error', e => {
      logger.info('error')
      if(socket.utype === 'client') {
        Notifier.DelClient(socket.id)
      } else {
        Notifier.DelServer(socket.id)
      }
    })
  })
}
