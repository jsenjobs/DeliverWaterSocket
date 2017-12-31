/**
 * Created by jsen on 2017/12/18.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var WaterOrderSchema = new Schema({
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
WaterOrderSchema.index({date:-1})
var PreOrderSchema = new Schema({
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
// stat
// 3 创建预订单， 保存在redis中
// 2 订单完成支付后的通知时订单标记为2 表示订单已经支付完成 mongo中
// 1 管理员确认准备配送订单 mongo中
// 0 客户确认订单已经完成 mongo中

exports.deliver = mongoose.model('deliver', WaterOrderSchema);
exports.porder = mongoose.model('preorder', PreOrderSchema);
