/**
 * Created by z30 on 14-10-17.
 */

var md5 = require('crypto').createHash('md5');

/* product_name --> product_id */
exports.md5hash=function(product_name){
    return md5.update(product_name).digest('hex');
};

