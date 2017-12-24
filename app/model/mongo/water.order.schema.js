/**
 * Created by jsen on 2017/12/18.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var WaterDeliverSchema = new Schema({
  _id : { type: String },                   // id out_trade_id
  openid: { trpe: String },                 // 用户ID
  type: {type:Number},                      // 水的类型
  num:{type:Number},                        // 水的数量
  date:{type:Date},                         // 订单生成时间
  fee:{type:String},                         // 总价
  platform:{type:String},                   // 平台 支付宝ali 微信wx
  // 3 预订单[保存在Redis中] 2 已经支付订单[保存在Redis中] 1 已经支付并由管理员确认订单[保存在Mongo中] 0 完成配送
  stat:{type:Number}                        // 订单状态
});

exports.deliver = mongoose.model('deliver', WaterDeliverSchema);
