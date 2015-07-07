var mysql   = require('mysql');
var config  = require('../config/config');
var Util = require('util');

config.db.connectionLimit = 50;

var pool = mysql.createPool(config.db);

module.exports.connection = function(callback) {

    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports.pool = pool;