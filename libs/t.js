/**
 * Created by z30 on 14-10-17.
 */

var http=require('http');
var pool=require('../conf/db.js');
var sql=require('../dbmodules/sql.js');


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
}

/* 获取经销地ID */
exports.get_zoneid=function(zname,callback){
    pool.getConnection(function(err, conn) {
        conn.query(sql.Query_Zid_ByZoneName(zname),function (err, sqlres) {
            conn.release();
            console.log(sqlres[0]);
            callback(sqlres[0]);
        });
    });
}
