let Realm = require('../access/Realm').Realm

let AuthorizationInfo = require('../access/AuthorizationInfo').AuthorizationInfo
let SessionManager = require('../access/SessionManager').SessionManager
let SecurityManager = require('../access/SecurityManager').SecurityManager
let redis = require('../../db/redis.init')

let Promise = require('bluebird')
let _ = require('lodash')

let mySchemas = require('../../model/mysql')

class RedisRealm extends Realm {

	getPermission(roles) {
		let task = _.map(roles, role => {
			return mySchemas.sys_role_permission.findAsync({rid:role.id}).then(domain => domain, _ => [])
		})
		return Promise.all(task).then(items => {
			let findPsTask = _.map(_.flatten(items), item => {
				return mySchemas.sys_permission.findAsync({id:item.pid})
			})
			return Promise.all(findPsTask).then(items2 => {
				return _.uniq(_.map(_.flatten(items2), permission => {
					return permission.name
				}))
			}, _ => false)
		}, _ => false)
	}




	getUserGroups(user) {
		return mySchemas.sys_user_group.findAsync({uid:user.id}).then(userGroups => userGroups, _ => false)
	}

	loopGetGroup(groupsID) {
		if (!groupsID || groupsID.length === 0) return
		let task = []
		_(groupsID).forEach(groupID => {
			task.push(mySchemas.sys_group.findAsync({id:groupID}).then(domain => domain, _ => false))
		})
		return Promise.all(task).then(items => {
			let flatItems = _.flatten(items)
			let groupTask = []
			_(flatItems).forEach(item => {
				if (item.parent) {
					groupTask.push(item.parent)
				}
			})
			return Promise.join(flatItems, this.loopGetGroup(groupTask), (groups1, groups2) => {
				if (groups2) return _(groups1).concat(groups2).value()
				return groups1
			})
		}, _ => [])
	}
	getGroups(userGroupsPromise) {
		return userGroupsPromise.then(userGroups => {
			if (!userGroups || userGroups.length === 0) return []
			let task = []
			_(userGroups).forEach(userGroup => {
				task.push(mySchemas.sys_group.findAsync({id:userGroup.gid}).then(domain => domain, _ => []))
			})
			return Promise.all(task).then(items => {
				let flatItems = _.flatten(items)
				let groupTask = []
				_(flatItems).forEach(item => {
					if (item.parent) {
						groupTask.push(item.parent)
					}
				})
				return this.loopGetGroup(groupTask).then(groups2 => {
					return _(groups2).concat(flatItems).value()
				}, _ => [])
			}, _ => false)
		}, _ => false)
	}

	getGroupRoles(groupsPromise) {
		return groupsPromise.then(groups => {
			if(!groups || groups.length === 0) return []
			let task = []
			_(groups).forEach(group => {
				task.push(mySchemas.sys_group_role.findAsync({gid:group.id}).then(domain => domain, _ => []))
			})
			return Promise.all(task).then(items => {
				// console.log(_.flatten(items)) []
				return _.flatten(items)
			}, _ => false)
		}, _ => false)
	}


	getUserRoles(user) {
		return mySchemas.sys_user_role.findAsync({uid:user.id}).then(userRoles => userRoles, _ => false)
	}

	getRoles(userRolesPromise) {
		return userRolesPromise.then(userRoles => {
			if (!userRoles || userRoles.length === 0) return []
			let task = []
			_(userRoles).forEach(userRole => {
				task.push(mySchemas.sys_role.findAsync({id:userRole.rid}).then(domain => domain, _ => []))
			})
			return Promise.all(task).then(items => {
				return _.flatten(items)
			}, _ => false)
		}, _ => false)
	}

	doGetAuthorizationInfo(principal) {
		let username = principal.getPrimaryPrincipal()
		return mySchemas.sys_user.findAsync({username:username}).then(users => users[0], _ => false)
		.then(user => {
			if (user) {
				// get user_group
				// get user_role
				return {
					userGroups:this.getUserGroups(user),
					userRoles: this.getUserRoles(user)
				}
			}
			 // return user ? mySchemas.sys_user_role.findAsync({uid:user.id}).then(urs => urs[0], _ => false) : false
		}, _=>false).then(combine => {
			if (combine) {
				// get groups
				// get roles
				return {
					groups: this.getGroups(combine.userGroups),
					roles: this.getRoles(combine.userRoles)
				}
			}
		}, _=>false).then(combine => {
			if (combine) {
				// get group roles
				return {
					groupRoles:this.getGroupRoles(combine.groups),
					roles:combine.roles
				}
			}
		}, _=>false).then(combine => {
			if (combine) {
				// get roles
				return Promise.join(this.getRoles(combine.groupRoles), combine.roles, (roles1, roles2) => {
					return _.uniq(_(roles1).concat(roles2).value())
				})
			}
		}, _=>false).then(roles => {
			if (roles) {
				// console.log(5)
				// console.log(roles)
				let roleNames = _.map(roles, (role) => {
					return role.name
				})
				// console.log(roleNames)
				return Promise.join(roleNames, this.getPermission(roles), (roles, permissions) => {
					if (roles || permissions) {
						let info = new AuthorizationInfo()
						if (roles) info.setRoles(roles)
						if (permissions) info.setPermissions(permissions)
						console.log(roles)
						console.log(permissions)
						return info
					}
				})
			}
		}, _=>false)
	}
}

class JSessionManager extends SessionManager {
	get(key) {
		return redis.client().getAsync(key)
	}
	set(key, value) {
		return redis.client().setAsync(key, value).then((res) => {
			// 5 hour
	        return redis.client().expireAsync(key, 18000);
	    }, _ => false);
	}
}

exports.boot = function() {
	SecurityManager.initSecurityManager(new RedisRealm(), new JSessionManager())
}