/**
 * Created by z30 on 14-10-20.
 */


var crypto = require('crypto');
var content = 'password'
var md5 = crypto.createHash('md5');
md5.update(content);
var d = md5.digest('hex');
var md5 = crypto.createHash('md5');
md5.update(content);