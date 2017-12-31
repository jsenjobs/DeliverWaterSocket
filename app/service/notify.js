/**
 * Created by jsen on 2017/4/19.
 */
let log4js = require('log4js');
let logger = log4js.getLogger('ServiceNotify');
let Promise = require("bluebird");

let Deliver = require('../model').deliver;
let Order = require('../model').deliver;
let PreOrder = require('../model').porder;
let MsgServer = require('../model').msgServer;
let MsgClient = require('../model').msgClient;
let Redis = require('../db/redis.init')
let Notifier = require('../utils/wsocket/Notifier')

let EN = process.env
// 小程序支付成功异步回调执行逻辑
exports.WXTinyPaySuccess = function(xmlParams) {
	let data = xmlParams.xml
	if(data && data.return_code === 'SUCCESS' &&
	data.result_code === 'SUCCESS' &&
	data.out_trade_no) {
		let out_trade_no = data.out_trade_no
		let key = 'dw:pre:order:' + out_trade_no
		return Redis.client().get(key).then(content => {
			let order = JSON.parse(content)
			if(!order) {
				return NotifyError
			}
			order.stat = 2
			return new Order(order).save().then(result => {
				if(result) {
					Redis.client().expire(key, 0)
					Redis.client().del(key)
					return Notifier.NotifyServer(order).then(ok1 => {
						if(ok1) {
							return "<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>"
						}
						return NotifyError
					})
				} else {
					return NotifyError
				}
			}).error(e => {
				return NotifyError
			})


		}).catch(e => {
			return NotifyError
		})
	} else {
		return new Promise(resolve => {
			resolve(NotifyError)
		})
	}
}


const AliPayUtils = require('../utils').AliPayUtils
const sellerid = EN.alisellerid
const appid = EN.aliappid
// 支付宝支付成功异步回调执行逻辑
exports.aliPayAsyncNotify = function (params) {
	return new Promise(resolve => {
		if (AliPayUtils.checkIsAliNotify(params)) {
			let out_trade_no = params.out_trade_no
			if(!out_trade_no) {
				resolve('fail')
				return
			}
			PreOrder.findOneAndRemove({_id:out_trade_no}).then(order => {
				if(!order) {
						Order.findOne({_id: out_trade_no}).then(obj => {
							if(obj) {
								resolve("success")
							} else {
								resolve("fail")
							}
						}).error(e => {
							resolve("fail")
						})
						return
				}
				if(parseFloat(params.total_amount) !== parseFloat(order.fee + '') ||
					params.out_trade_no !== order._id ||
					params.app_id !== appid) {
					resolve('fail')
					return
				}
				let saveData = {
					_id:order._id,
					openid: order.openid,
					type: order.type,
					num: order.num,
					date: order.date,
					fee: order.fee,
					platform: order.platform,
					name: order.name,
					address: order.address,
					stat: 2,
				}
				new Order(saveData).save().then(obj => {
					if(obj) {
							return Notifier.NotifyServer(saveData).then(ok1 => {
								if(ok1) {
									resolve('success')
									return
								}
								resolve('fail')
								return
							})
					} else {
						resolve('fail')
					}
				}).error(e => {
					resolve('fail')
				})


			}).error(e => {
				resolve('fail')
			})

		} else {
			resolve('n')
		}
	})
}

const NotifyOK = "<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>"
const NotifyError = '<xml><return_code>FAIL</return_code><return_msg>支付通知失败</return_msg></xml>'

const WxPayUtils = require('../utils').WxPayUtils
exports.wxPayAsyncNotify = function(xmlParams) {
	let params = xmlParams.xml
	return new Promise(resolve => {
		if(WxPayUtils.checkIsWxNotify(params)) {
			let out_trade_no = params.out_trade_no
			if(!out_trade_no) {
				resolve(NotifyError)
				return
			}

			PreOrder.findOneAndRemove({_id:out_trade_no}).then(order => {
				if(!order) {
						Order.find({_id: out_trade_no}).then(obj => {
							if(obj) {
								resolve(NotifyOK)
							} else {
								resolve(NotifyError)
							}
						}).error(e => {
							resolve(NotifyError)
						})
						return
				}

				if(parseFloat(params.total_fee) !== parseFloat(order.fee  + '')||
					params.result_code !== 'SUCCESS') {
					resolve(NotifyError)
					return
				}

				let saveData = {
					_id:order._id,
					openid: order.openid,
					type: order.type,
					num: order.num,
					date: order.date,
					fee: order.fee,
					platform: order.platform,
					name: order.name,
					address: order.address,
					stat: 2,
				}
				new Order(saveData).save().then(obj => {
					if(obj) {
							return Notifier.NotifyServer(saveData).then(ok1 => {
								if(ok1) {
									resolve(NotifyOK)
									return
								}
								resolve(NotifyError)
								return
							})
					} else {
						resolve(NotifyError)
					}
				}).error(e => {
					resolve(NotifyError)
				})

			}).catch(e => {
				resolve(NotifyError)
			})

		} else {
			resolve('n')
		}
	})
}



// 管理员确认订单即将配送 用户将受到通知
exports.SaveAndNotifyOrder = function(out_trade_no) {


	return Order.findOneAndUpdate({_id: out_trade_no}, {stat:1}).then(order => {

		console.log(out_trade_no)
		console.log(order)

		if (!order) {
			return {code:1, msg:'无法获取订单信息'}
		}
		return MsgServer.remove({_id: out_trade_no}).then(ok => {
			if (!ok) {
				return {code:1, msg:'更改失败'}
			} else {
					let saveData = {
						_id:order._id,
						openid: order.openid,
						type: order.type,
						num: order.num,
						date: order.date,
						fee: order.fee,
						platform: order.platform,
						name: order.name,
						address: order.address,
						stat: 1
					}
					return Notifier.NotifyClient(saveData).then(ok => {
						if(ok) return {code:0}
						return {code:1, msg:'处理出错001'}
					})
			}
		})
	}).error(e => {
		return {code:1, msg:'数据库查询错误', err:e}
	})
}

exports.ClientOK = function(out_trade_no, openid) {
	return MsgClient.remove({_id: out_trade_no, openid: openid}).then(result => {
		return {code:0}
	}).catch(e => {
		return {code:1, msg:'确认失败'}
	})
}
