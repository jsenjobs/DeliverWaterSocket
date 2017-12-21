let Realm = require('./Realm').Realm
var sM = ''

class SecurityManager {
	constructor(realm, sessionManager) {
		this.realm = realm
		this.sessionManager = sessionManager
	}
	getRealm() {
		return this.realm
	}
	getSessionManager() {
		return this.sessionManager
	}

	hasRole(principal, role) {
		return this.sessionManager.getAuthorizationInfo(principal).then(info => {
			if (info) {
				return info.hasRole(role)
			} else {
				return false
			}
		}, _ => false)
	}
	hasPermission(principal, permission) {
		return this.sessionManager.getAuthorizationInfo(principal).then(info => {
			if (info) {
				return info.hasPermission(permission)
			} else {
				return false
			}
		}, _ => false)
	}

	hasRoles(principal, roles) {
		return this.sessionManager.getAuthorizationInfo(principal).then(info => {
			if (info) {
				return info.hasRoles(roles)
			} else {
				return false
			}
		}, _ => false)
	}
	hasPermissions(principal, permissions) {
		return this.sessionManager.getAuthorizationInfo(principal).then(info => {
			if (info) {
				return info.hasPermissions(permissions)
			} else {
				return false
			}
		}, _ => false)
	}

	static initSecurityManager(realm, sessionManager) {
		sM = new SecurityManager(realm, sessionManager)
	}
	static getSecurityManager() {
		return sM
	}
}


exports.SecurityManager = SecurityManager