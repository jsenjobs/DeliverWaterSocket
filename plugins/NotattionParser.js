/**
 * 
 * V1.0.0
 * 将注解翻译成api文件，并自动添加到index.js文件中
 * 
 */
let path = require('path')
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let _ = require('lodash')
const readline = require('readline');

function loopFind(p) {
	return fs.statAsync(p).then(stat => {
		if(stat) {
			if(stat.isFile()) {
				if(!_.endsWith(p, 'index.js')) {
					return [p]
				} else {
					return []
				}
			} else if(stat.isDirectory()) {
				return fs.readdirAsync(p).then(files => {
					if(files) {
						let task = _.map(files, item => {
							return loopFind(path.join(p, item))
						})
						return Promise.all(task).then(paths => {
							return _.flattenDeep(paths)
						})
					} else {
						return []
					}
				}, _=>[])
			}
		} else {
			return []
		}
	}, _=> [])
}
function appendApi(mockApi, api) {
	let name = api.name
	delete api.name
	delete api.functionName
	delete api.controllerName
	mockApi[name] = api
}
function ReadController(root) {
	return loopFind(root).then(controllers => {
		let task = _.map(controllers, controller => {
			return new Promise(resolve => {
				let read = false
				let findFunction = false
				let api = {params:[]}
				let apiList = []
				let objReadline = readline.createInterface({  
			    	input: fs.createReadStream(controller),  
				})
				objReadline.on('line', line => {
					if(_.includes(line, '/**')) {
						read = true
						findFunction = false
						api = {params:[], controllerName:path.parse(controller).name}
						return
					}
					if(_.includes(line, '**/')) {
						read = false
						findFunction = true
						// save 
						// appendApi(mockApi, api)
						apiList.push(api)
						return
					}
					if(read) {
						if(_.includes(line, '@name')) {
							api.name = _.map(line.split('@name'),_.trim)[1]
						} else if(_.includes(line, '@link')) {
							api._links = _.map(line.split('@link'),_.trim)[1]
						} else if(_.includes(line, '@method')) {
							api.method = _.map(line.split('@method'),_.trim)[1]
						} else if(_.includes(line, '@desc')) {
							api.des = _.map(line.split('@desc'),_.trim)[1]
						} else if(_.includes(line, '@param')) {
							let param = _.map(line.split('@param'),_.trim)[1]
							param = param.replace(/\'/g, '\"')
							try{
								let p = JSON.parse(param)
								if(api.params) {
									api.params.push(p)
								} else {
									api.params = [p]
								}
							} catch(e) {
								// console.error(e)
							}
						} else if(_.includes(line, '@header')) {
							let header = _.map(line.split('@header'),_.trim)[1]
							header = header.replace(/\'/g, '\"')
							try{
								let h = JSON.parse(header)
								if(api.headers) {
									api.headers.push(h)
								} else {
									api.headers = [h]
								}
							} catch(e) {}
						}
					} else if (findFunction && _.startsWith(line, 'exports') && _.includes(line, '=')) {
						findFunction = false
						api.functionName = _.map(line.split(/=|\./), _.trim)[1]
					}
				})
				objReadline.on('close', _=>{
					resolve({apiList:apiList, controller:controller})
					// console.log('close:'+controller)
				})
			})
		})


		return Promise.all(task).then(apis => {
			let controllerNames = ''

			let m1 = _.map(apis, apiO => {
				let api = apiO.apiList
				if(api && api.length > 0) {
					let name = path.parse(apiO.controller).name
					controllerNames += ('let '+name+'C = require(\'./'+name+'.js\')' + '\n')
					return api
				} else {
					return []
				}
			})
			let m2 = _.flattenDeep(m1)
			let mockApi = {}
			let reqPath = ''
			_(m2).forEach(m => {
				if(m.method.toLocaleLowerCase() === 'get') {
					reqPath += '  app.get(\'' + m._links + '\','+m.controllerName+'C.'+m.functionName+')\n'
				} else {
					reqPath += '  app.post(\'' + m._links + '\','+m.controllerName+'C.'+m.functionName+')\n'
				}
				appendApi(mockApi, m)
			})
			return {code:0, api:JSON.stringify(mockApi, null, 2),reqPath:reqPath, controllerNames:controllerNames}
		}, _=>{})
	})
}

function indexHandle(p, strs, controllerNames) {
	return fs.statAsync(p).then(stat => {
		if(stat.isFile()) {
			let objReadline = readline.createInterface({  
		    	input: fs.createReadStream(p)  
			})
			let data = ''
			let start = false
			let required = false
			objReadline.on('line', line => {
				if(_.includes(line, '@require')) {
					required = true
					data += controllerNames
					data += line + '\n'
					return
				}
				if(!required) return
				if(_.includes(line, '@start')) {
					start = true
					data += line + '\n'
					data += strs
					return
				}
				if (_.includes(line, '@end')) {
					start = false
					data += line + '\n'
					return
				}
				if(start) return
				data += line + '\n'
			})
			objReadline.on('close', _=>{
				fs.writeFileAsync(path.join(path.dirname(p), 'index.js'), data).then(result => {
					if(result) {
						console.log(result)
					} else {
						console.log('handle controller index succeed')
					}
				}, _=>{
					console.error('handle controller error')
				})
			})
		} else {
			console.log('not find file at: '+p)
		}
	}, _=>{
		console.log('error happend when handle controller index file')
	})
}



function MockApi() {
	ReadController(path.join(process.cwd(), 'app', 'controller')).then(data => {
		if(data.code === 0) {
			indexHandle(path.join(process.cwd(), 'app', 'controller', 'index.js'), data.reqPath, data.controllerNames)
			fs.writeFileAsync(path.join(process.cwd(), 'mock', 'mock.api.json'), data.api).then(result => {
				if(result) {
					console.log(result)
				} else {
					console.log('mock api succeed')
				}
			}, _=>{
				console.error('mock api error')
			})
		}
	})
}
MockApi()
require('./MockService').MockService()
require('./MockDB').MockMongo()
require('./MockDB').MockMysql()

/*
ReadController(path.join(process.cwd(), 'app', 'controller')).then(paths => {
	console.log(paths)
})
*/