/**
 * Created by z30 on 14-10-17.
 */

var http=require('http');

/* 将商品名称转换成商品ID */
exports.md5hash=function(product_name){
    var md5 = require('crypto').createHash('md5');
    md5.update(product_name);
    return md5.digest('hex');
};

/* 从批次ID中获取商品ID */
exports.get_pid_f_bid=function(bid){
    return bid.split('-')[1];
};


exports.inner_get=function(url){
    http.get(url, function(res) {
        console.log(res);
    }).on('error', function(e) {
            console.log("Got error: " + e.message);
    });
}
