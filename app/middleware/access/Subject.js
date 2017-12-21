let SecurityManager = require('./SecurityManager').SecurityManager
let Promise = require('bluebird')

class PrincipalCollection {
	constructor(username) {
		this.init(username)
	}

	init(username) {
		this.data = {}
		this.data.username = username
	}

	getPrimaryPrincipal() {
		return this.data.username
	}
	put(key, v) {
		this.data.key = v
	}
	get(key) {
		return this.data.key
	}
}

class Subject {
	constructor(username = '') {
		this.init(username)
	}

	init(username) {
		this.username = username
		this.principal = new PrincipalCollection(username)
	}

	reinit(username) {
		this.username = username
		this.principal.init(username)
	}

	getPrincipalCollection() {
		return this.principal
	}

	setPrimaryPrincipal(username) {
		this.principal.put('username', username)
	}

	free() {
		require('./AccessUtils').AccessUtils().free(this)
	}

	hasRole(role) {
		if (!this.username) return new Promise((resolve) => {resolve(false)})
		return SecurityManager.getSecurityManager().hasRole(this.principal, role)
	}

	hasRoles(roles) {
		if (!this.username) return new Promise((resolve) => {resolve(false)})
		return SecurityManager.getSecurityManager().hasRoles(this.principal, roles)
	}

	hasPermission(permission) {
		if (!this.username) return new Promise((resolve) => {resolve(false)})
		return SecurityManager.getSecurityManager().hasPermission(this.principal, permission)
	}

	hasPermissions(permissions) {
		if (!this.username) return new Promise((resolve) => {resolve(false)})
		return SecurityManager.getSecurityManager().hasPermissions(this.principal, permissions)
	}



}

exports.PrincipalCollection = PrincipalCollection
exports.Subject = Subject