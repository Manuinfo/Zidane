/**
 * Created by linly on 14-10-29.
 */



var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var me=require('./m_goods.js');
var sql_trust=require('../dbmodules/sql.js');
var sql_g=require('../dbmodules/sql_goods.js');
var sql_py=require('../dbmodules/sql_py.js');
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
exports.Get_NameBySerial=function(sid,callback){
    pool.getConnection(function(err, conn) {
            //console.log(sid);
            logger.debug('Req:'+sql_g.get_goods_bySerialID(sid));
            conn.query(sql_g.get_goods_bySerialID(sid),function (err, sqlres) {
                callback(sqlres);
            });
    });
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

//账户管理，获取账户信息
exports.Get_ALLAccts=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_all_accts());
        conn.query(sql_g.get_all_accts(),function (err, sqlres) {
            conn.release();
            ///console.log(sqlres);
            callback(sqlres);
        });
    })
};

//根据NFC ID查商品名称
exports.Get_NameByNFCID=function(nfcid,number,callback){
    pool.getConnection(function(err, conn) {
        //var s = "[abc,abcd,aaa]";
        //console.log(s);
        //console.log(nfcid);
        //if (typeof nfcid=="string")
        console.log(nfcid.split(','));

        if(nfcid.length < 16)
        {
            console.log(111);
            logger.debug('Req:'+sql_g.get_goods_byNFCID(nfcid));
            conn.query(sql_g.get_goods_byNFCID(nfcid),function (err, sqlres) {
                conn.release();
            callback(sqlres[0]);
        });
        } else
        {
            var ncount=0;
            console.log(nfcid.split(','));
            async.map(nfcid.split(','),function(item,cb){
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
                 if(sqlres[0])  //记录数存在，为重复数据
                 {
                     cb(null,item);
                 }
                 else   //记录数不存在
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
        //console.log(now.format('YYYY-MM-DD HH:mm:ss'));
        async.each(sonid,function(item,cb){
            logger.debug('Req:'+sql_g.insert_boxhis(item,farid,now.format('YYYY-MM-DD HH:mm:ss'),uname,alname,cid));
            conn.query(sql_g.insert_boxhis(item,farid,now.format('YYYY-MM-DD HH:mm:ss'),uname,alname,cid),function (err, sqlres) {
                cb(null,'ok');
            });
        },function(err,exres){
            conn.release();
            callback(exres);
        });
    })
};

//查询装箱历史
exports.Query_PackHis=function(uname,stime,etime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_packhis(uname,stime,etime));
        conn.query(sql_g.query_packhis(uname,stime,etime),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//查询可以发给哪些下家
exports.WhoIsMySons=function(up_name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.query_downname(up_name));
        conn.query(sql_py.query_downname(up_name),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//查询我的上级是谁
exports.WhoIsMyDaddy=function(down_name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.query_upname(down_name));
        conn.query(sql_py.query_upname(down_name),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//查询这箱货是否属于我的
exports.Check_Belongme=function(nfcids,callback){
    var now=moment().subtract(1,'month').format('YYYY-MM-DD HH:mm:ss');
    pool.getConnection(function(err, conn) {
        async.map(nfcids,function(item,cb){
            logger.debug('Req:'+sql_g.query_belongme(item,now));
            conn.query(sql_g.query_belongme(item,now),function (err, sqlres) {
                if(sqlres[0])
                   cb(null,item+":"+sqlres[0].recv_name);
                else
                   cb(null,item+":记录为空")
            });
        },function(err,exres){
            //console.log(exres);
            callback(exres);
            conn.release();
        });
    })
};

//insert into py_send_his values('04a9be427236GF','2014-10-01 11:51:00','FACT','1314TP11','A0','1','2');

//给这项货开始发货
exports.SendBox=function(jbd,callback){
    var now=moment().format('YYYY-MM-DD HH:mm:ss');
    pool.getConnection(function(err, conn) {
        async.map(jbd.par_id,function(item,cb){
            logger.debug('Req:'+sql_g.insert_sendhis(item,now,jbd.username,jbd.cv_name,jbd.expgoods,jbd.sn_id,jbd.cv_id));
            conn.query(sql_g.insert_sendhis(item,now,jbd.username,jbd.cv_name,jbd.expgoods,jbd.sn_id,jbd.cv_id),function (err, sqlres) {
                cb(null,'OK');
            });
    },function(err,exres){
            callback(exres);
            conn.release();
        });
    })
};

//ADMIN 插入历史记录
exports.Insert_QuerySendLog_ByAdmin=function(uname,unfc){
    var now=moment();
    me.Get_NameByNFCID(unfc,1,function(alname){
        //console.log(unfc);
        //console.log(alname);
        if (alname.name) xalname=alname.name
        pool.getConnection(function(err, conn) {
            logger.debug('Req:'+sql_trust.Insert_Log_Basic(uname,xalname,'ADMINCHECK','NULL',unfc,now.format('YYYY-MM-DD HH:mm:ss'),'SUCC'));
            conn.query(sql_trust.Insert_Log_Basic(uname,xalname,'ADMINCHECK','NULL',unfc,now.format('YYYY-MM-DD HH:mm:ss'),'SUCC'),function (err, sqlres) {
                conn.release();
            });
        });
    });
};

//查询发货链
exports.Query_SendHis=function(uname,stime,etime,nfcid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_sendhis(stime,etime,nfcid));
        conn.query(sql_g.query_sendhis(stime,etime,nfcid),function (err, sqlres) {
            conn.release();
            logger.debug('如果是ADMIN查询，则插入记录');
            if (uname=='root'){
                me.Insert_QuerySendLog_ByAdmin(uname,nfcid);
            }
            callback(sqlres);
        });
    });
};


//ADMIN查询历史查询
exports.Query_AdminHis=function(stime,etime,goodsid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('ADMIN查过的记录开始查询');
        console.log(goodsid);
        console.log(global.u_BRAND);
        console.log(global.u_BRAND[goodsid]);
        logger.debug('Req:'+sql_g.query_adminhis(stime,etime,global.u_BRAND[goodsid]));
        conn.query(sql_g.query_adminhis(stime,etime,global.u_BRAND[goodsid]),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    });
};


//判断大箱还是小箱
exports.Query_BigOrSmall=function(nfcids,callback){
    pool.getConnection(function(err, conn) {
        async.map(nfcids,function(item,cb){
            logger.debug('Req:'+sql_g.check_bigorsmall(item));
            conn.query(sql_g.check_bigorsmall(item),function (err, sqlres) {
               // console.log(sqlres[0]);
                if(sqlres[0])   //存在NFCFLAG则是大箱
                    if(sqlres[0].nfc_flag==null)
                        cb(null,item+":小箱");
                    else
                        cb(null,item+":大箱");
                else
                    cb(null,item+":这个箱子不重复")
            });
        },function(err,exres){
            //console.log(exres);
            //console.log(exres);
            callback(exres);
            conn.release();
        });
    })

};