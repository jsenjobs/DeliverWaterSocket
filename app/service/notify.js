/**
 * Created by jsen on 2017/4/19.
 */
let log4js = require('log4js');
let logger = log4js.getLogger('ServiceNotify');
let Promise = require("bluebird");

let Deliver = require('../model').deliver;
let Redis = require('../db/redis.init')
let Notifier = require('../utils/wsocket/Notifier')
const NotifyError = '<xml><return_code>FAIL</return_code><return_msg>支付通知失败</return_msg></xml>'

exports.WXPaySuccess = function(xmlParams) {
	let data = xmlParams.xml
	if(data && data.return_code === 'SUCCESS' &&
	data.result_code === 'SUCCESS' &&
	data.out_trade_no) {
		let out_trade_no = data.out_trade_no
		let key = 'dw:pre:order:' + out_trade_no
		return Redis.client().get(key).then(content => {
			let order = JSON.parse(content)
			Notifier.NotifyServer(mockNotify())
			if(!order) {
				return NotifyError
			}
			order.stat = 2
			return Redis.client().set('dw:paied:order:' + out_trade_no, JSON.stringify(order)).then(ok => {
				if(ok === 'OK') {
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
			})

		}).error(e => {
			return NotifyError
		})
	} else {
		return new Promise(resolve => {
			resolve(NotifyError)
		})
	}
}

function mockNotify() {
	let content = {
		_id: 'trade_no-mock' + require('uuid').v1(),
		openid: 'openid-mock',
		type: 0,
		num: 2,
		date: Date.now(),
		stat: 2
	}
	return content
}
exports.SaveAndNotifyOrder = function(out_trade_no) {

	let rID = 'dw:paied:order:' + out_trade_no
	return Redis.client().get(rID).then(data => {
		try {
			let data2 = JSON.parse(data)
			data2.stat = 1
			console.log(data2)
			return new Deliver(data2).save().then(ok => {
				if(ok) {
					return {code:0, order:data2}
				} else {
					return {code:1, msg:'保存订单数据出错'}
				}
			})
		} catch(e) {
			return {code:1, msg:'订单数据错误'}
		}
	}).then(data => {
		if(data.code === 0) {
			return Redis.client().del(rID).then(count => {
				return Notifier.NotifyClient(data.order).then(ok => {
					if(ok) return {code:0}
					return {code:1, msg:'处理出错001'}
				})
			})
		} else {
			return data
		}
	}).error(e => {
		return {code:1, msg:'unknown', err:e}
	})
}
