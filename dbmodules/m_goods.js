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
exports.Get_IdByName=function(name,type,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_id_by_name(name,type));
        conn.query(sql_g.get_id_by_name(name,type),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};


//根据类型获取有哪些配置信息
exports.Get_NameBySerial=function(types,callback){
    pool.getConnection(function(err, conn) {
        async.map(types,function(item,cb){
            logger.debug('Req:'+sql_g.get_goods_bySerial(item));
            conn.query(sql_g.get_goods_bySerial(item),function (err, sqlres) {
                cb(null,sqlres);
            });
        },function(err,exres){
            conn.release();
            //console.log(exres);
            callback(exres);
        });
    })
};

//根据SERIAL获取有哪些商品
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

//根据NFC ID查商品名称
exports.Get_NameByNFCID=function(nfcid,number,callback){
    pool.getConnection(function(err, conn) {
        if (nfcid.length==1)
        {
            logger.debug('Req:'+sql_g.get_goods_byNFCID(nfcid));
            conn.query(sql_g.get_goods_byNFCID(nfcid),function (err, sqlres) {
                conn.release();
            callback(sqlres[0]);
        });
        } else
        {
            var ncount=0;
            async.map(nfcid,function(item,cb){
                logger.debug('Req:'+sql_g.get_goods_byNFCID(item));
                conn.query(sql_g.get_goods_byNFCID(item),function (err, sqlres) {
                    //console.log(sqlres[0]);
                    if(sqlres[0])
                    {    ncount++;
                        cb(null,item+":"+sqlres[0].name);}
                    else
                        cb(null,item+":"+"记录为空");
                });
            },function(err,exres){
                conn.release();
                if(ncount==number){delete ncount;  callback(1); }
                else  {delete ncount; callback(exres); }
            });
        }
    })
};


//校验装箱历史
exports.Check_PackRepeat=function(sonid,callback){
    pool.getConnection(function(err, conn) {
        //console.log(sonid);
         async.map(sonid,function(item,cb){
             logger.debug('Req:'+sql_g.check_repeat(item));
             conn.query(sql_g.check_repeat(item),function (err, sqlres) {
                 //console.log(sqlres);
                 if(sqlres[0])  //记录不存在，为新纪录
                 {
                     cb(null,item);
                 }
                 else  //记录数存在，为重复数据
                     cb(null,'ok');
               });
         },function(err,exres){
            //console.log(exres);
             callback(exres);
             conn.release();
         });
    })
};

//插入装箱历史
exports.Insert_PackHis=function(sonid,farid,uname,alname,cid,callback){
    pool.getConnection(function(err, conn) {
        //console.log(farid+uname+alname+cid);
        var now=moment();
        async.each(sonid,function(item,cb){
            logger.debug('Req:'+sql_g.insert_boxhis(item,farid,now.format('YYYY-MM-DD hh:mm:ss'),uname,alname,cid));
            conn.query(sql_g.insert_boxhis(item,farid,now.format('YYYY-MM-DD hh:mm:ss'),uname,alname,cid),function (err, sqlres) {
                cb(null,'ok');
            });
        },function(err,exres){
            conn.release();
            callback(exres);
        });
    })
};
