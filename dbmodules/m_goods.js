/**
 * Created by linly on 14-10-29.
 */



var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var sql_g=require('../dbmodules/sql_goods.js');
var dbm=require('../dbmodules/rule.js');
var logger = require('../libs/log').logger;

//ID管理，根据中文名称获取ID
exports.Get_IdByName=function(name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_id_by_name(name));
        conn.query(sql_g.get_id_by_name(name),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};
//ID管理，根据类型获取全量信息
exports.Get_IDByType=function(type,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_id_by_type(type));
        conn.query(sql_g.get_id_by_type(type),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//ID管理，获取全量信息
exports.Get_AllBase=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_all_base());
        conn.query(sql_g.get_all_base(),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};