let _ = require('lodash')
var protobuf = require('protocol-buffers')
let fs = require('fs')
let path = require('path')
const messages = protobuf(fs.readFileSync(path.join(__dirname, 'AuthorizationInfo.proto')))

class AuthorizationInfo {
	constructor() {
		this.roles = []
		this.permissions = []
	}

	setRoles(roles) {
		if(!roles) return
		this.roles = roles
	}
	setPermissions(permissions) {
		if(!permissions) return
		this.permissions = permissions
	}

	hasRole(role) {
		return _(this.roles).indexOf(role) !== -1
	}
	hasPermission(permission) {
		return _(this.permissions).indexOf(permission) !== -1
	}

	hasRoles(roles) {
		let f = false
		_(roles).forEach((role) => {
			if (!this.hasRole(role)) return false
			f = true
		})
		return f
	}
	hasPermissions(permissions) {
		let f = false
		_(permissions).forEach((permission) => {
			if(!this.hasPermission(permission)) return false
			f = true
		})
		return f
	}

	static decode(dataStr) {
		let data = messages.AuthorizationInfo.decode(new Buffer(dataStr))
		let a = new AuthorizationInfo()
		a.setRoles(data.roles)
		a.setPermissions(data.permissions)
		return a
	}

	static encode(a) {
		return messages.AuthorizationInfo.encode({
			roles:a.roles,
			permissions:a.permissions
		})
	}


}

exports.AuthorizationInfo = AuthorizationInfo