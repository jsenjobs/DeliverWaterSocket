/**
 * Created by jsen on 2017/12/18.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var MsgServerSchema = new Schema({
  _id : { type: String },                   // id out_trade_no
  openid: { trpe: String },                 // 用户ID
  type: {type:Number},                      // 水的类型
  num:{type:Number},                        // 水的数量
  date:{type:Date},                         // 订单生成时间
  fee:{type:String},                         // 总价
  platform:{type:String},                    // 平台 支付宝ali 微信wx
  stat:{type:Number}                        // 订单状态，0.. 订单完成成功 1 订单已确认正在配送 2 等待确认 3 订单失败
});
var MsgClientSchema = new Schema({
  _id : { type: String },                   // id out_trade_no
  openid: { trpe: String },                 // 用户ID
  type: {type:Number},                      // 水的类型
  num:{type:Number},                        // 水的数量
  date:{type:Date},                         // 订单生成时间
  fee:{type:String},                         // 总价
  platform:{type:String},                    // 平台 支付宝ali 微信wx
  stat:{type:Number}                        // 订单状态，0.. 订单完成成功 1 订单已确认正在配送 2 等待确认 3 订单失败
});

exports.msgServer = mongoose.model('msgServer', MsgServerSchema);
exports.msgClient = mongoose.model('msgClient', MsgClientSchema);
