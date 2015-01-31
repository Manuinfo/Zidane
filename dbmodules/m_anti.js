/**
 * Created by z30 on 14-12-13.
 */

var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var me=require('./m_goods.js');
var sql_g=require('../dbmodules/sql.js');
var logger = require('../libs/log').logger;


//二维码验证成功后的信息获取
exports.Get_InfoAfQrcode_succ=function(qrhref,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_infoaf_qrcode_succ(qrhref));
        conn.query(sql_g.get_infoaf_qrcode_succ(qrhref),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};

//二维码验证成功后的信息获取
exports.Update_QRAVtimes=function(qrhref,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.Update_QRAVtimes(qrhref));
        conn.query(sql_g.Update_QRAVtimes(qrhref),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};

//根据批次获取商品的信息，公司名称等等
exports.Get_PrdByBid=function(bid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_prd_bybid(bid));
        acc.Gen_DB(conn,sql_g.query_prd_bybid(bid),1,function(dbres){
            callback(dbres);
        });
    });
};