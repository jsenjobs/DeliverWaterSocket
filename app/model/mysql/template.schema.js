// models-extra.js
/*
module.exports = function (db, cb) {
    db.define("person", {
            name      : String,
            surname   : String,
            age       : Number, // FLOAT
            male      : String,
            continent : String, // ENUM type
            photo     : String, // BLOB/BINARY
            data      : String // JSON encoded
        }, {
            methods: {
                fullName: function () {
                    return this.name + ' ' + this.surname;
                }
            },
            validations: {
                age: orm.enforce.ranges.number(18, undefined, "under-age")
            }
        })

    return cb();
};
*/
var orm = require("orm");

exports.person = {
    schema:{
        name      : String,
        surname   : String,
        age       : Number, // FLOAT
        male      : String,
        continent : String, // ENUM type
        photo     : String, // BLOB/BINARY
        data      : String // JSON encoded
    }, 
    action:{
        methods: {
            fullName: function () {
                return this.name + ' ' + this.surname;
            }
        },
        validations: {
            age: orm.enforce.ranges.number(18, undefined, "under-age")
        }
    }
}