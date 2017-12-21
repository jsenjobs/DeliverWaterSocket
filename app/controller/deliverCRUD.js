let log4js = require('log4js');
let logger = log4js.getLogger('ControllerDeliver');



/**
    @name queryOrderByDay
    @link /order/query/day
    @method GET
    @param {'name':'date','type':'string','des':'查询的时间'}
    @desc 根据时间查询订单
**/
exports.queryByDay = function(req, res) {
    logger.info('queryByDay Api Call');

    let date = req.query.date

    req.models.queryorder.queryByDay(date).then(result => {
      return res.status(200).send(result);
    }).error(e => {
      return res.status(200).send(NotifyError);
    })
}

/**
    @name finishSend
    @link /order/sended/:order
    @method GET
    @param {'name':'order','type':'string','des':'订单id'}
    @desc 标记完成订单
**/
exports.finishSend = function(req, res) {
    logger.info('finishSend Api Call');

    let order = req.params.order

    req.models.queryorder.finishSend(order).then(result => {
      return res.status(200).send(result);
    }).error(e => {
      return res.status(200).send(NotifyError);
    })
}

/**
    @name queryOrderById
    @link /order/query/id
    @method GET
    @param {'name':'id','type':'string','des':'查询的用户id （openid）'}
    @desc 根据时间查询订单
**/
exports.queryById = function(req, res) {
    logger.info('queryById Api Call');

    let id = req.query.id

    req.models.queryorder.queryById(id).then(result => {
      return res.status(200).send(result);
    }).error(e => {
      return res.status(200).send(NotifyError);
    })
}
