let SecurityManager = require('./SecurityManager').SecurityManager
let log4js = require('log4js');
let logger = log4js.getLogger('SessionManager')
let AuthorizationInfo = require('./AuthorizationInfo').AuthorizationInfo
let redis = require('../../db/redis.init')
class SessionManager {
	constructor() {
		
	}

	getAuthorizationInfo(principal) {
		let key = 'access:'+principal.getPrimaryPrincipal()
		// redis.client().del(key)
		return this.get(key).then(dataStr => {
			if (!dataStr) {
				logger.info('get AuthorizationInfo from mysql')
				return SecurityManager.getSecurityManager().getRealm().doGetAuthorizationInfo(principal)
				.then((p) => {
						if (p) {
							this.setAuthorizationInfo(principal, p)
							return p
						}
					})
			} else {
				return AuthorizationInfo.decode(dataStr)
			}
		}, err => {
			console.error(err)
			return false
		})
	}
	setAuthorizationInfo(principal, authorizationInfo) {
		let key = 'access:'+principal.getPrimaryPrincipal()
		let buf = AuthorizationInfo.encode(authorizationInfo)
		this.set(key, buf)
	}

	// need impl
	get(key) {
	}
	// need impl
	set(key, value) {
	}
}

exports.SessionManager = SessionManager