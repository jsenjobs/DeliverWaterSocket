/**
 *
 * V1.0.0
 * 数据库模型自动注册插件
 * 支持MYSQL MONGO
 *
 */

let path = require('path')
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let _ = require('lodash')
const readline = require('readline');

let loopFind = require('./utils').loopFind

function ReadMysql(p) {
    return loopFind(p).then(models => {
        let task = _.map(models, model => {
            return new Promise(resolve => {

                let fileReadline = readline.createInterface({
                    input: fs.createReadStream(model)
                })
                let items = []
                fileReadline.on('line', line => {
                    if(_.startsWith(line, 'exports.')) {
                        items.push(_.map(line.substring(8, line.length).split('='), _.trim)[0])
                    }
                })
                fileReadline.on('close', _=>{
                    resolve({key:path.relative(path.join(process.cwd(), 'app', 'model', 'mysql'), model), values: items})
                })
            })
        })

        return Promise.all(task).then(items => {
            let data = 'module.exports = {\n'
            _.forEach(items, item => {
                let values = item.values
                let key = item.key
                _.forEach(values, value => {
                    data += '\t' + value + ' : require(\'' + key + '\').' + value + ',\n'
                })
            })
            data += '}\n'
            return data
        })
    })
}

function MockMysql() {
    let p =  path.join(process.cwd(), 'app', 'model', 'mysql')
    ReadMysql(p).then(result => {
        fs.writeFileAsync(path.join(p, 'index.js'), result).then(err => {
            if(err) {
                console.error(err)
            } else {
                console.log('handle mysql model succeed')
            }
        }, _=>{
            console.error('handle mysql model error')
        })
    })
}

function ReadMongo(p) {
    return loopFind(p).then(models => {
        let task = _.map(models, model => {
            return new Promise(resolve => {
                let fileReadline = readline.createInterface({
                    input: fs.createReadStream(model)
                })
                let items = []
                fileReadline.on('line', line => {
                    if(_.startsWith(line, 'exports.')) {
                        items.push(_.map(line.substring(8, line.length).split('='), _.trim)[0])
                    }
                })
                fileReadline.on('close', _=> {
                    resolve({key:path.relative(path.join(process.cwd(), 'app', 'model'), model), values:items})
                })
            })
        })

        return Promise.all(task).then(items => {
            let data = ''
            _.forEach(items, item => {
                let values = item.values
                let key = item.key
                _.forEach(values, value => {
                    data += 'exports.' + value + ' = require(\'./' + key + '\').' + value + '\n'
                })
            })
            return data
        })
    })
}
function MockMongo() {
    let p = path.join(process.cwd(), 'app', 'model', 'mongo')
    ReadMongo(p).then(result => {
        fs.writeFileAsync(path.join(process.cwd(), 'app', 'model', 'index.js'), result).then(err => {
            if(err) {
                console.error(err)
            } else {
                console.log('handle mongo model succeed')
            }
        }, _=>{
            console.error('handle mongo model error')
        })
    })
}

exports.MockMongo = MockMongo
exports.MockMysql = MockMysql
