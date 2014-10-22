/**
 * Created by z30 on 14-10-17.
 */

var http=require('http');
var pool=require('../conf/db.js');
var sql=require('../dbmodules/sql.js');


var chars = ['0','1','2','3','4','5','6','7','8','9',
             'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
             'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
             '0','1','2','3','4','5','6','7','8','9'];



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


/* 获取商品ID */
exports.get_pid=function(prdname,callback){
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_pid_byprdname(prdname),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });

    });
};

/* 获取经销地ID */
exports.get_zoneid=function(zname,callback){
    pool.getConnection(function(err, conn) {
        conn.query(sql.Query_Zid_ByZoneName(zname),function (err, sqlres) {
            conn.release();
            console.log(sqlres[0]);
            callback(sqlres[0]);
        });
    });
};


/* 产生随机数 */
exports.get_random=function(n){
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*71);
        res += chars[id];
    }
    return res;
};