let path = require('path')
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let _ = require('lodash')

exports.loopFind = function(p, exIndex = true) {
	return fs.statAsync(p).then(stat => {
		if(stat) {
			if(stat.isFile()) {
				if(!exIndex || !_.endsWith(p, 'index.js')) {
					return [p]
				} else {
					return []
				}
			} else if(stat.isDirectory()) {
				return fs.readdirAsync(p).then(files => {
					if(files) {
						let task = _.map(files, item => {
							return exports.loopFind(path.join(p, item))
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