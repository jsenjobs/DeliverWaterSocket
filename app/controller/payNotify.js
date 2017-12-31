let log4js = require('log4js');
let logger = log4js.getLogger('ControllerPayNotify');
const NotifyError = '<xml><return_code>FAIL</return_code><return_msg>支付通知失败</return_msg></xml>'

/**
    @name order_notify
    @link /order_notify
    @method POST
    @desc 微信小程序支付完成通知 生成一个支付完成的订单, 传入xml数据(https)
**/
exports.wxTinyPayNotify = function(req, res) {
    logger.info('wxTinyPayNotify Api Call');

    let xmlParams = req.body
    console.log(xmlParams)

    req.models.notify.WXTinyPaySuccess(xmlParams).then(result => {
      return res.status(200).send(result);
    }).error(e => {
      return res.status(200).send(NotifyError);
    })
}

/**
    @name aliPayAsyncNotify
    @link /notify/ali/asyncpay
    @method POST
    @desc 异步通知 (https)
**/
exports.aliPayAsyncNotify = function(req, res) {
    logger.info('aliPayAsyncNotify Api Call')

    let params = req.body
    req.models.notify.aliPayAsyncNotify(params).then(result => {
        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(200).send("fail")
        }
    })
}

/**
    @name wxPayAsyncNotify
    @link /notify/wx/asyncpay
    @method POST
    @desc 异步通知 (https)
**/
exports.wxPayAsyncNotify = function(req, res) {
    logger.info('wxPayAsyncNotify Api Call')

    let xmlParams = req.body
    return res.status(200).json({code:0});
    req.models.notify.wxPayAsyncNotify(xmlParams).then(result => {
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({code:1, 'msg':'unknown'})
        }
    })
}
