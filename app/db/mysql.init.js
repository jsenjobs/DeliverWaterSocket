var orm = require("orm");
let log4js = require('log4js');
let logger = log4js.getLogger('MysqlIniter');

let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));

// jdbc:mysql://localhost:3306/template?useUnicode=true&amp;characterEncoding=UTF-8
exports.boot = function() {
	orm.connect(process.env.MysqlUrl, function (err, db) {
		if (err) {
			logger.error('Can not connect mysql')
			return
		};
		logger.info('Connect Mysql succeed')

		let s = require("../model/mysql/index")
		for(let table in s) {
			let schema = s[table]
			s[table] = db.define(table, schema.schema, schema.action)
			Promise.promisifyAll(s[table])
		}
		/*
		var Person = ''
		let s = require("../model/mysql/index")
		console.log(s.person)
		db.load("../model/mysql/index", function (err) {
			if (err) {
				logger.error(err)
				logger.error('error 2')
			}
		    s.person = db.models.person;
		    		console.log(s.person)
			// console.log(db.models.person)
		});
		*/

	    // add the table to the database
	    /*
	    let Person = s.person
	    setTimeout(()=>{
	    	db.sync(err=>{
				if (err) {
					logger.error('can not sync')
				}
	    		Person.create({name: "John", surname: "Doe", age: 27 }, function(err) {
				if (err) {
					logger.error('can not add data')
				}

					// query the person table by surname
					Person.find({ surname: "Doe" }, function (err, people) {
				        // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
			        	if (err) throw err;

				        console.log("People found: %d", people.length);
				        console.log("First person: %s, age %d", people[0].fullName(), people[0].age);

				        people[0].age = 16;
				        people[0].save(function (err) {
				            // err.msg = "under-age";
			        });
			    });

			});
	    	})
	    }, 10000)
	    */

	});
}
