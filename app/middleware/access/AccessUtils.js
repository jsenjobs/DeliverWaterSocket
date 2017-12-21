
let _ = require('lodash')
let Subject = require('./Subject').Subject
let Promise = require('bluebird')
var pool = []
class AccessUtils {
	getSubject(primaryPrincipal) {
		let subject = pool.pop()
		if (subject) {
			subject.reinit(primaryPrincipal)
		} else {
			subject = new Subject(primaryPrincipal)
		}
		return subject
	}
	free(subject) {
		if(subject) {
			pool.push(subject)
		}
	}
	checkRole(req, role) {
	  console.log('access')
  	let principal = req.headers.principal
	  if(!principal && req.query && req.query.principal) {
	    principal = req.query.principal
	  }
	  if (!principal) {
	      return new Promise((resolve) => {
	      	resolve(false)
	      })
	  }
	  let subject = this.getSubject(principal)
	  return subject.hasRole(role).then((has) => {
	    subject.free()
	    if(has) return true
	    return false
  	})
	}
	checkRoles(req, roles) {
	  console.log('access')
  	  let principal = req.headers.principal
	  if(!principal && req.query && req.query.principal) {
	    principal = req.query.principal
	  }
	  if (!principal) {
	      return new Promise((resolve) => {
	      	resolve(false)
	      })
	  }
	  let subject = this.getSubject(principal)
	  return subject.hasRoles(roles).then((has) => {
	    subject.free()
	    if(has) return true
	    return false
  	})
	}
}
var asu = new AccessUtils()

exports.AccessUtils = function() {
	return asu
}