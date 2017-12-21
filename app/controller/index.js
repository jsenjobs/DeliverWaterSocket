let appC = require('./app.js')
let deliverCRUDC = require('./deliverCRUD.js')
let socketservercontrollerC = require('./socketservercontroller.js')
// @require

/*
let JWT_SECRET = "ai*))!@wlamrhnsdk$%*@u~ksdu34id^";
let secret = process.env.profilesactive + JWT_SECRET
let jwtCheck = ejwt({
  // 获取secret
  secret: (req, payload, done) => {
    done(null, secret)
    */
    /*
    if (req.headers.principal) {
      redis.GetValue(req.headers.principal).then(v => done(null, v)).catch(e => done(null, ''))
    } else if(req.query && req.query.principal)  {
      redis.GetValue(req.query.principal).then(v => done(null, v)).catch(e => done(null, ''))
    }
    */
    /*
    if(req.headers.token) {
      redis.GetValue(req.headers.token).then(v => done(null, v)).catch(e => done(null, ''));
    } else if(req.query && req.query.token) {
      redis.GetValue(req.query.token).then(v => done(null, v)).catch(e => done(null, ''));
    }
    */
    /*
  },
  credentialsRequired:true,
  getToken: (req) => {
    if(req.headers.token) {
      return req.headers.token;
    }
    /*
    /* else if(req.query && req.query.token) {
      return req.query.token;
    }
    */
    /*
    return null;
  }
});
*/
exports.boot = function(app) {
  // @start
  app.get('/app/status',appC.status)
  app.get('/app/listinfo',appC.listinfo)
  app.get('/app/getLog',appC.getLog)
  app.get('/order/query/day',deliverCRUDC.queryByDay)
  app.get('/order/sended/:order',deliverCRUDC.finishSend)
  app.get('/order/query/id',deliverCRUDC.queryById)
  app.post('/order_notify',socketservercontrollerC.orderNotify)
  app.get('/ok_notify/:out_trade_no',socketservercontrollerC.ok_notify)
  // @end

}
