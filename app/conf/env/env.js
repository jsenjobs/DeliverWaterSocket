let E = process.env;
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require('path');

let fsExistsSync = function (path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

let conf = function (path){
	if (fsExistsSync(path)) {
		let data = fs.readFileSync(path, 'utf8');
		if(data) {
			let jsonData = JSON.parse(data);
			parse(E, '', jsonData);
		}
	}
}

let parse = function(map, key, json) {
	if (json  instanceof Array) {
		map[key] = json
	} else if (json instanceof Object) {
		for(let k in json) {
			parse(map, key + k, json[k]);
		}
	} else {
		map[key] = json
	}
}

exports.ENVSET = function(modelConf, projectConf) {

	// E.PORT = 3004;
	// E.MongoUrl = 'mongodb://root:root@120.25.217.56:27017';
	// E.MongoUrl = 'mongodb://127.0.0.1:27017';
	// E.MongoTable = 'jabeta';
	// E.RedisPort = 6379;
	// E.RedisHost = '127.0.0.1';
	// E.SessionTimeOut = 60 * 60 * 5;

	if (modelConf) {
		conf(path.join(modelConf, 'project.json'));
		conf(path.join(modelConf, 'db.json'));
		conf(path.join(modelConf, 'cluster.json'));
	}
	if (projectConf) {
		conf(path.join(projectConf, 'project.json'));
		conf(path.join(projectConf, 'db.json'));
		conf(path.join(projectConf, 'cluster.json'));
	}

	if (process.env.model === 'production') {
		if (modelConf) {
			conf(path.join(modelConf, 'production', 'project.json'));
			conf(path.join(modelConf, 'production', 'db.json'));
			conf(path.join(modelConf, 'production', 'cluster.json'));
		}
		if (projectConf) {
			conf(path.join(projectConf, 'production', 'project.json'));
			conf(path.join(projectConf, 'production', 'db.json'));
			conf(path.join(projectConf, 'production', 'cluster.json'));
		}
	}



}

