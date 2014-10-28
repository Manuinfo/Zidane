/**
 * Created by z30 on 14-10-18.
 */

var mysql = require('mysql');

module.exports = mysql.createPool({
    connectionLimit : 10,
    host: '210.209.80.221',
    user: 's596906db0',
    password: '05d21b87',
    database:'s596906db0',
    port: 3306
});

/*
 module.exports = mysql.createPool({
 connectionLimit : 10,
 host: '127.0.0.1',
 user: 'root',
 password: '1234',
 database:'minfo',
 port: 3306
 });
 */
