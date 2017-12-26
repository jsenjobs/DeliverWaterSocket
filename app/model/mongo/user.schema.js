/**
 * Created by jsen on 2017/4/12.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var UserClientSchema = new Schema({
  _id : { type: String },                    //id
  password : {type : String},       //密码
  name : {type : String},       //用户名字
  address : {type : String},       //送货地址
  register_date: {type:Date},
  last_login: {type:Date},
});

var UserServerSchema = new Schema({
  _id : { type: String },                    //id
  password : {type : String},       //密码
  register_date: {type:Date},
  last_login: {type:Date},
});

// findOne
// object.save
exports.userClient = mongoose.model('userClient', UserClientSchema);
exports.userServer = mongoose.model('userServer', UserServerSchema);
