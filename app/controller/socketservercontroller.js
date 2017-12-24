let log4js = require('log4js');
let logger = log4js.getLogger('ControllerSocketServer');
const NotifyError = '<xml><return_code>FAIL</return_code><return_msg>支付通知失败</return_msg></xml>'


/**
    @name ok_notify
    @link /ok_notify/:out_trade_no
    @method GET
    @desc 商家确认订单(https)
    @param {'name':'out_trade_no','type':'string','des':'订单out_trade_no'}
**/
exports.ok_notify = function(req, res) {
    logger.info('ok_notify Api Call');

    let out_trade_no = req.params.out_trade_no
    if(!out_trade_no) {
      return res.status(200).json({code:1, 'msg':'参数错误-1'})
    }

    req.models.notify.SaveAndNotifyOrder(out_trade_no).then(result => {
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({code:1, 'msg':'unknown-1'})
        }
    }).error(e => {
      return res.status(200).json({code:1, 'msg':'unknown-2'})
    })
}
