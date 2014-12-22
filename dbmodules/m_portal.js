var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var me=require('./m_portal.js');
var sql_g=require('../dbmodules/sql_portal.js');
var sql_1st=require('../dbmodules/sql.js');
var logger = require('../libs/log').logger;


//查询当日装箱次数
exports.Get_PackNumToday=function(p_ddtime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_num_pack(p_ddtime));
        acc.Gen_DB(conn,sql_g.qs_num_pack(p_ddtime),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询当日工厂发货次数
exports.Get_SendNumToday=function(p_ddtime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_num_send_ud(p_ddtime));
        //console.log(sql_g.qs_num_send_ud(p_ddtime));
        acc.Gen_DB(conn,sql_g.qs_num_send_ud(p_ddtime),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询是否已装箱
exports.Get_BoxHasPacked=function(p_nfcid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_if_box_has_pack(p_nfcid));
       //console.log(sql_g.qs_if_box_has_pack(p_nfcid));
        acc.Gen_DB(conn,sql_g.qs_if_box_has_pack(p_nfcid),1,function(dbres){
            callback(dbres);
        });
    });
};

//查询标签是否合法
exports.Get_NFC_legal=function(p_nfcid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_if_nfc_exist_inbox(p_nfcid));
       // console.log(sql_g.qs_if_box_has_pack(p_nfcid));
        acc.Gen_DB(conn,sql_g.qs_if_nfc_exist_inbox(p_nfcid),1,function(dbres){
            if(dbres)
            {
                //盒子存在
                callback({msg:"BOX"});
            } else
            {
                logger.debug('Req:'+sql_g.qs_if_nfc_exist_inpackage(p_nfcid));
                pool.getConnection(function(err, conn) {
                acc.Gen_DB(conn,sql_g.qs_if_nfc_exist_inpackage(p_nfcid),1,function(dbres2){
                    if(dbres2)
                    {  //但箱子存在
                        callback({msg:"PACKAGE"});
                    } else  //箱子也存在
                    {
                        callback({msg:"NULL"});
                    }
                });
                })

            }
        });
    });
};


//新建批次
exports.New_Batch=function(p_pid,p_place,p_bth_count,p_nfc_count,p_vrftime,callback){
    pool.getConnection(function(err, conn) {
        console.log(p_pid);
        console.log(t.md5hash(p_pid));
        var now=moment();
        logger.debug('Req:'+sql_1st.Insert_Bth_Basic(
            t.md5hash(p_pid),
            t.md5hash(p_pid)[0],
            p_place,
            p_bth_count,
            p_nfc_count,
            p_vrftime,
            now.format('YYYYMMDDHHmmss')+'-'+global.u_BRAND_R[p_pid]+'-'+p_place,
            now.format('YYYY-MM-DD HH:mm:ss')
        ));
        //console.log(sql_g.qs_if_box_has_pack(p_nfcid));
        acc.Gen_DB(conn,sql_1st.Insert_Bth_Basic(
            t.md5hash(p_pid),
            t.md5hash(p_pid)[0],
            p_place,
            p_bth_count,
            p_nfc_count,
            p_vrftime,
            now.format('YYYYMMDDHHmmss')+'-'+global.u_BRAND_R[p_pid]+'-'+p_place,
            now.format('YYYY-MM-DD HH:mm:ss')
        ),1,function(dbres){
            callback(dbres);
        });
    });
};