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