/**
 * Created by jsen on 2017/12/18.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var MsgServerSchema = new Schema({
  _id : { type: String },                   // id out_trade_id
  openid: { type: String },                 // 用户ID 电话号码
  type: {type:Number},                      // 水的类型
  num:{type:Number},                        // 水的数量
  date:{type:Date},                         // 订单生成时间
  fee:{type:String},                         // 总价
  platform:{type:String},                   // 平台 支付宝ali 微信wx
  name:{type:String},                   // 用户名字
  address:{type:String},                   // 用户收货地址
  stat:{type:Number}                        // 订单状态
});
var MsgClientSchema = new Schema({
  _id : { type: String },                   // id out_trade_id
  openid: { type: String },                 // 用户ID 电话号码
  type: {type:Number},                      // 水的类型
  num:{type:Number},                        // 水的数量
  date:{type:Date},                         // 订单生成时间
  fee:{type:String},                         // 总价
  platform:{type:String},                   // 平台 支付宝ali 微信wx
  name:{type:String},                   // 用户名字
  address:{type:String},                   // 用户收货地址
  stat:{type:Number}                        // 订单状态
});

exports.msgServer = mongoose.model('smsgServer', MsgServerSchema);
exports.msgClient = mongoose.model('smsgClient', MsgClientSchema);
