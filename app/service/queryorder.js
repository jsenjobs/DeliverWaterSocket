
let Order = require('../model').deliver;
let moment = require('moment')


exports.queryByDay = function(date) {
  let d = Date.now()
  try{
    let dd = parseInt(date)
    dd = new Date(dd)
    d = dd
  } catch(e) {
    console.log('error when parse date')
  }

  let query = new Date(moment(d).format('YYYY/MM/DD'))
  let query2 = new Date(moment(query).add(1, 'days'))
  console.log(query)
  console.log(query2)
  return Order.find({date: {$gte:query, $lt: query2}}).then(orders => {
    return {code:0, data:orders}
  }).error(e => {
    return {code:1, msg:'查询出错-1'}
  })
}

exports.queryById = function(id) {
  return Order.find({openid:id}).then(orders => {
    return {code:0, data:orders}
  }).error(e => {
    return {code:1, msg:'查询出错-1'}
  })
}


exports.finishSend = function(order_id) {
  return Order.findOneAndUpdate({_id:order_id}, {stat:0}).then(count => {
    return {code:0}
  }).error(e => {
    return {code:1, msg:'unknown-1'}
  })
}
