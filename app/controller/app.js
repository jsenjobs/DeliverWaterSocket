let log4js = require('log4js');
let logger = log4js.getLogger('ControllerApp');
let os = require('os');
let exec = require('child_process').exec;
let async = require('async');
let started_at = new Date();
let path = require('path');
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
/**
    @name appStatus
    @link /app/status
    @method GET
    @desc 服务器信息
    @param {"name":"info", "type":"任意","des":"详细信息", "necessary":false}
**/
exports.status = function(req, res) {
	logger.info('Status Api Call');
	let server = req.app;
	if(req.query.info) {
		let connections = {}, swap;

		async.parallel([
			(done) => {
				exec('netstat -an | grep :80 | wc -l', (e, res) => {
					connections['80'] = parseInt(res, 10);
					done();
				});
			},
			(done) => {
				exec('netstat -an | grep :' + server.set('port') + ' | wc -l', (e, res) => {
					connections[server.set('port')] = parseInt(res, 10);
					done();
				});
			}// ,
			// (done) => {
			// 	exec('vmstat -SM -s | grep "used swap" | sed -E "s/[^0-9]*([0-9]{1,8}).*/\1/"', (e, res) => {
			// 		swap = res;
			// 		done();
			// 	});
			// }
		],
		(e) => {
			res.json({
				status: 'up',
				version: server.get('version'),
				sha:server.get('git sha'),
				started_at:started_at,
				node: {
					version:process.version,
					memory:Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
					uptime:process.uptime(),		// 进程执行时间
				},
				system: {
					loadavg:os.loadavg(),
					freeMemory:Math.round(os.freemem() / 1024 / 1024) + 'M'
				},
				env: process.env.NODE_ENV,
				hostname:os.hostname(),
				connections:connections,
				swap:swap
			});
		}
		); // end parallel
	} else {
		res.json({
			status:'up'
		})
	}
	/*
	res.json({
		pid:process.pid,
		memory:process.memoryUsage(),
		uptime:process.uptime()		// 进程执行时间
	})*/
}

let Apis = require('../../mock/mock.api.json')
let Simple = {
	code:0, data:Apis, model:process.env.model, PVersion: process.env.PVersion, state: process.env.state
}

/**
    @name listinfo
    @link /app/listinfo
    @method GET
    @desc 显示api信息
**/
exports.listinfo = function(req, res) {
	return res.status(200).json(Simple)
}


let fsExistsAsync = function (path) {
	return fs.accessAsync(path, fs.F_OK).then(_ => {
		return true
	}, _ => {
		return false
	})
}
let readJson = function (path){
	return fs.readFileAsync(path, 'utf8').then(data => {
		if (data) {
			return data;
		}
	})
}
let handleLog = function(filename, res) {
	let rtp = path.join(process.cwd(), 'runtime', 'logs', filename);
	fsExistsAsync(rtp).then(exist => {
		if (exist) {
			return readJson(rtp).then(json => {
				if (json) {
					return res.status(200).json({code:0, data:json});
				} else {
					return res.status(200).json({code:1});
				}
			})
		} else {
			return res.status(200).json({code:1});
		}
	})
}
/**
    @name getLog
    @link /app/getLog
    @method GET
    @desc 获取日志文件，beta
    @param {"name":"filename", "type":"string","des":"日志文件名字", "necessary":false}
**/
exports.getLog = function(req, res) {
	logger.info('getLog api call');

	if (req.query.filename) {
		handleLog(req.query.filename, res);
	} else {
		handleLog('latest.log', res);
	}
}


