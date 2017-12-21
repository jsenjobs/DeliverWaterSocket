/**
 * 
 * V1.0.0
 * 服务自动注册插件， 注册到req中
 * 
 */
let path = require('path')
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let _ = require('lodash')
const readline = require('readline');

let loopFind = require('./utils').loopFind

function ReadService(root) {
	return loopFind(root).then(controllers => {
		let task = _.map(controllers, controller => {
			return new Promise(resolve => {
                resolve(path.basename(controller, '.js'))
			})
		})


		return Promise.all(task).then(apis => {
            let services = _.flatMapDeep(apis)

            let head = ''
            let obj = ''
            _.forEach(services, service => {
                head += 'let ' + service + ' = require(\'./' + service + '\')\n'
                obj += '\t\'' + service + '\' : ' + service + ',\n'
            })
            obj = 'let models = {\n' + obj + '}'
            return head + obj
		}, _=>{})
	})
}

function MockService() {
	ReadService(path.join(process.cwd(), 'app', 'service')).then(data => {
        let allData = 
"\n\nexports.boot = function(app) {\n\
    app.use(function(req,res, next) {\n\
        req.models = models;\n\
        return next();\n\
    })\n\
}\n"
        data = data + allData
        fs.writeFileAsync(path.join(process.cwd(), 'app', 'service', 'index.js'), data).then(result => {
            if(result) {
                console.log(result)
            } else {
                console.log('handle service succeed')
            }
        }, _=>{
            console.error('handle service error')
        })
	})
}
exports.MockService = MockService