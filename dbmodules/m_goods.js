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
            logger.debug('根据类型获取有哪些配置信息');
            logger.debug('Req:'+sql_g.get_goods_bySerialID(sid));
            conn.query(sql_g.get_goods_bySerialID(sid),function (err, sqlres) {
                conn.release();
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
            var out_o={};
            var in_o_LAY={},in_o_CHANNEL={},in_o_SERIAL={},in_o_BRAND={},in_o_PACKLIMIT={};
            for(var i=0;i<sqlres.length;i++)
            {
                switch (sqlres[i].type)
                {
                    case 'LAY':
                    { in_o_LAY[sqlres[i].id]=sqlres[i].name; break; }
                    case 'CHANNEL':
                    { in_o_CHANNEL[sqlres[i].id]=sqlres[i].name; break;}
                    case 'SERIAL':
                    { in_o_SERIAL[sqlres[i].id]=sqlres[i].name;  break;}
                    case 'BRAND':
                    { in_o_BRAND[sqlres[i].id]=sqlres[i].name; break;}
                    case 'PACKLIMIT':
                    { in_o_PACKLIMIT[sqlres[i].id]=sqlres[i].name; break;}
                    default :
                        a=1;
                }
            }
            setTimeout(function(){
                out_o['LAY']=in_o_LAY;
                out_o['CHANNEL']=in_o_CHANNEL;
                out_o['SERIAL']=in_o_SERIAL;
                out_o['BRAND']=in_o_BRAND;
                out_o['PACKLIMIT']=in_o_PACKLIMIT;
                conn.release();
                callback(out_o);
            },300);
        });
    })
};

//获取登陆名和其他信息的对应关系
exports.Get_RealName=function(callback){
    pool.getConnection(function(err, conn) {
        //console.log(pool.domain);
        //console.log(pool._allConnections.length);
        //console.log(pool._freeConnections.length);
        logger.debug('Req:'+sql_g.get_all_realname());
        //console.log(sql_g.get_all_realname());
        conn.query(sql_g.get_all_realname(),function (err, sqlres) {
            conn.release();
            //console.log(sqlres);
            callback(sqlres);
            /*
            var out_o={};
            for(var i=0;i<sqlres.length;i++)
            {
                out_o[sqlres[i].name]=sqlres[i];
            }
           setTimeout(function(){
               //console.log(out_o);
               conn.release();
               callback(out_o);
           },300);
           */
        });
    })
};

//账户管理，获取账户信息与层级ID的关联
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

//查看箱子的ID是否存在
exports.Check_BoxExist=function(nfcid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_packexist(nfcid));
        conn.query(sql_g.query_packexist(nfcid),function (err, sqlres) {
            conn.release();
            ///console.log(sqlres);
            callback(sqlres[0]);
        });
    })
};

//批量查看箱子的ID是否存在
exports.Check_BoxExistMulti=function(nfcid,goodsid,callback){
    //console.log(goodsid);
    pool.getConnection(function(err, conn) {
        async.map(nfcid,function(item,cb)
        {
            logger.debug('Req:'+sql_g.query_packexistByFactSend(item,goodsid));
            conn.query(sql_g.query_packexistByFactSend(item,goodsid),function (err, sqlres) {
                console.log(sqlres[0]);
                if(sqlres[0])
                    cb(null,'YES');
                else
                    cb(null,'NA');
            })
        },function(err,dbres){
                //console.log(dbres);
                callback(dbres);
                conn.release();
          });
    })
};


//账户管理，获取账户信息与商铺名称的关联
exports.Get_ALLAcctsNAME=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.get_all_acctsname());
        conn.query(sql_g.get_all_acctsname(),function (err, sqlres) {
            conn.release();
            ///console.log(sqlres);
            callback(sqlres);
        });
    })
};

//更新箱子ID的信息，在装箱的时候
exports.Update_BoxInfoPack=function(nfcid,goods_id){
    var now=moment();
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.update_packboxhis(nfcid,goods_id,now.format('YYYY-MM-DD HH:mm:ss')));
        conn.query(sql_g.update_packboxhis(nfcid,goods_id,now.format('YYYY-MM-DD HH:mm:ss')),function (err, sqlres) {
            conn.release();
            ///console.log(sqlres);
           // callback(sqlres);
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

        if(nfcid.length < 14)
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

//查询装箱历史 根据起止时间、盒子ID，查绑定关系
exports.Query_PackHis=function(uname,stime,etime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_packhis(uname,stime,etime));
        conn.query(sql_g.query_packhis(uname,stime,etime),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//查询装箱历史 根据起止时间、箱子ID
exports.Query_PackHisByPackageID=function(nfcid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_packhis_by_pack_id(nfcid));
        conn.query(sql_g.query_packhis_by_pack_id(nfcid),function (err, sqlres) {
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

//查询这箱货是否属于我的，校验收货人是不是我
exports.Check_Belongme=function(cvname,nfcids,callback){
    var now=moment().subtract(1,'month').format('YYYY-MM-DD HH:mm:ss');
    pool.getConnection(function(err, conn) {
        async.map(nfcids.split(','),function(item,cb){
            logger.debug('Req:'+sql_g.query_belongme(cvname,item,now));
            conn.query(sql_g.query_belongme(cvname,item,now),function (err, sqlres) {
                if(sqlres[0])
                   cb(null,item+":"+sqlres[0].recv_name);
                else
                   cb(null,item+":不是你的箱子")
            });
        },function(err,exres){
            //console.log(exres);
            callback(exres);
            conn.release();
        });
    })
};


//防止发货员重复发货，备份并清空发货链
exports.DF_SendRepeate=function(nfcids,callback){
    var now=moment().subtract(1,'month').format('YYYY-MM-DD HH:mm:ss');
    pool.getConnection(function(err, conn) {
        async.map(nfcids.split(','),function(item,cb){
            logger.debug('先备份后删除');
            logger.debug('Req:'+sql_g.bak_sendhis_before_trunc(item));
            conn.query(sql_g.bak_sendhis_before_trunc(item),function (err, sqlres) {
                logger.debug('Req:'+sql_g.trunc_sendhis(item));
                conn.query(sql_g.trunc_sendhis(item),function(err,sqlres){
                    callback(null,1);
                });
            });
        },function(err,exres){
            //console.log(exres);
            logger.debug('备份删除后的结果:'+exres);
            callback(exres);
            conn.release();
        });
    })
};


//查询这箱货是否属于我的，校验发货人是不是我
exports.Check_Belongme2=function(cvname,nfcids,callback){
    var now=moment().subtract(1,'month').format('YYYY-MM-DD HH:mm:ss');
    pool.getConnection(function(err, conn) {
        async.map(nfcids.split(','),function(item,cb){
            logger.debug('Req:'+sql_g.query_belongme2(cvname,item,now));
            conn.query(sql_g.query_belongme2(cvname,item,now),function (err, sqlres) {
                if(sqlres[0])
                    cb(null,item+":"+sqlres[0].recv_name);
                else
                    cb(null,item+":不是你的箱子")
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
        async.map(jbd.par_id.split(','),function(item,cb){
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
exports.Insert_QuerySendLog_ByAdmin=function(goodsid,unfc){
    var now=moment();

        pool.getConnection(function(err, conn) {
            logger.debug('Req:'+sql_trust.Insert_Log_Basic(goodsid,global.u_BRAND[goodsid],'ADMINCHECK','NULL',unfc,now.format('YYYY-MM-DD HH:mm:ss'),'SUCC'));
            conn.query(sql_trust.Insert_Log_Basic(goodsid,global.u_BRAND[goodsid],'ADMINCHECK','NULL',unfc,now.format('YYYY-MM-DD HH:mm:ss'),'SUCC'),function (err, sqlres) {
                conn.release();
            });
        });

};

//查询发货链 ，条件为起止时间+发货人ACC_ID
exports.Query_SendHis=function(uname,stime,etime,nfcid,goodsid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_sendhis(stime,etime,uname));
        conn.query(sql_g.query_sendhis(stime,etime,uname),function (err, sqlres) {
            conn.release();
            logger.debug('如果是ADMIN查询，则插入记录');
            if (global.u_ACCTS[uname]=='0'){
                me.Insert_QuerySendLog_ByAdmin(uname,nfcid);
            }
            callback(sqlres);
        });
    });
};

//查询发货链 ，条件为起止时间+NFC_ID+所有记录
exports.Query_SendHis_NFCID=function(uname,stime,etime,nfcid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_sendhis_nfcid(stime,etime,nfcid));
        conn.query('show variables like \'system_time_zone\';',function(err,sqlres){
            console.log(sqlres);
            conn.query(sql_g.query_sendhis_nfcid(stime,etime,nfcid),function (err, sqlres) {
                conn.release();
                logger.debug('如果是ADMIN查询，则插入记录');
                if (global.u_ACCTS[uname]=='0'){
                    me.Insert_QuerySendLog_ByAdmin(uname,nfcid);
                }
                callback(sqlres);
            });

        });

    });
};


//查询发货链 ，条件为起止时间
exports.Query_SendHis_Common=function(uname,stime,etime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_sendhis_common(uname,stime,etime));
        conn.query(sql_g.query_sendhis_common(uname,stime,etime),function (err, sqlres) {
            conn.release();
            logger.debug('如果是ADMIN查询，则插入记录');
            if (global.u_ACCTS[uname]=='0'){
                me.Insert_QuerySendLog_ByAdmin(uname,nfcid);
            }
            callback(sqlres);
        });
    });
};


//ADMIN查询历史查询
exports.Query_AdminHis=function(stime,etime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('ADMIN查过的记录开始查询');
        //console.log(goodsid);
        //console.log(global.u_BRAND);
        //console.log(global.u_BRAND[goodsid]);
        logger.debug('Req:'+sql_g.query_adminhis(stime,etime));
        conn.query(sql_g.query_adminhis(stime,etime),function (err, sqlres) {
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


//判断发货员下面有多少省级代理
exports.WhoIsMySonsFSend=function(up_name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.query_senddownname(up_name));
        conn.query(sql_py.query_senddownname(up_name),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//判断省级代理下面有多少一级代理
exports.WhoIsMySonsFSD=function(up_name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.query_shengdownname(up_name));
        conn.query(sql_py.query_shengdownname(up_name),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//根据下层LEVEL_ID查找下家账号
exports.WhoIsMySonsAccLevel=function(up_name,down_id,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.query_downnameandlevel(up_name,down_id));
        conn.query(sql_py.query_downnameandlevel(up_name,down_id),function (err, sqlres) {
            conn.release();
            callback(sqlres);
        });
    })
};

//查询一个账号下的所有子树
exports.AllMySons=function(up_name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.query_allchild_recuris(up_name));
        conn.query(sql_py.query_allchild_recuris(up_name),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};


//查询发货链最后1条
exports.Query_SendHisLastOne=function(uname,stime,etime,nfcid,goodsid,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.query_sendhisLastOne(etime,nfcid));
        conn.query(sql_g.query_sendhisLastOne(etime,nfcid),function (err, sqlres) {
            logger.debug(sqlres);
            logger.debug('如果是ADMIN查询，则插入记录');
            if (global.u_ACCTS[uname]=='0'){
                me.Insert_QuerySendLog_ByAdmin(uname,nfcid);
                conn.release();
            }
            conn.release();
            callback(sqlres[0]);
        });
    });
};