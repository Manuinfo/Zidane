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
        //console.log(sql_g.qs_num_pack(p_ddtime));
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

//查询销售地ID
exports.Get_SaleCityID=function(p_city,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_1st.Query_Zid_ByZoneName(p_city+'市'));
        //console.log(sql_g.qs_if_box_has_pack(p_nfcid));
        acc.Gen_DB(conn,sql_1st.Query_Zid_ByZoneName(p_city+'市'),1,function(dbres){
            callback(dbres);
        });
    });
};

//新建批次
exports.New_Batch=function(p_pid,p_place,p_bth_count,p_nfc_count,p_vrftime,p_rfile,p_nfile,p_rawdata,p_bid_c,callback){

    me.Get_SaleCityID(p_place,function(city_res){
        pool.getConnection(function(err, conn) {
            console.log(p_pid);
            console.log(t.md5hash(p_pid));
            var now=moment();
            global.u_UPLOAD_NFC_PROGRESS=0;
            global.u_UPLOAD_NFC_TOTAL=p_bth_count;

            //console.log(sql_g.qs_if_box_has_pack(p_nfcid));
                //开始导入NFC_ID，再新建批次
            me.Insert_NFCID(now.format('YYYYMMDDHHmmss')+'-'+global.u_BRAND_R[p_pid]+'-'+city_res.city_code,
                p_rawdata,function(xdbres){
                    logger.debug('NFC_ID导入完毕，结果为:'+xdbres)
                    logger.debug('开始新建批次');
                    logger.debug('Req:'+sql_1st.Insert_Bth_Basic(
                        t.md5hash(p_pid),
                        t.md5hash(p_pid)[0],
                        p_place,
                        xdbres.split('条')[0],
                        xdbres.split('条')[0],
                        p_vrftime,
                        now.format('YYYYMMDDHHmmss')+'-'+global.u_BRAND_R[p_pid]+'-'+city_res.city_code,
                        now.format('YYYY-MM-DD HH:mm:ss'),
                        p_rfile,
                        p_nfile,
                        p_bth_count,
                        p_bid_c
                    ));
                    acc.Gen_DB(conn,sql_1st.Insert_Bth_Basic(
                            t.md5hash(p_pid),
                            t.md5hash(p_pid)[0],
                            p_place,
                            xdbres.split('条')[0],
                            xdbres.split('条')[0],
                            p_vrftime,
                            now.format('YYYYMMDDHHmmss')+'-'+global.u_BRAND_R[p_pid]+'-'+city_res.city_code,
                            now.format('YYYY-MM-DD HH:mm:ss'),
                            p_rfile,
                            p_nfile,
                            p_bth_count,
                            p_bid_c
                        ),2,function(dbres){
                            logger.debug('批次新建完成');
                            callback(xdbres);
                        });
            });
        });
    });

};


//导入NFC_ID盒子
exports.Insert_NFCID=function(p_btd_id,p_rawdata,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('开始导入NFC_ID');
        var n_cc=0;
        var n_rec_cc=0;
        async.mapLimit(p_rawdata.split("\r\n"),10,function(item,cb)
        {
            logger.debug('Req:'+n_rec_cc+':'+sql_1st.Insert_NFCID(p_btd_id,item));
            n_rec_cc++;
            global.u_UPLOAD_NFC_PROGRESS++;
            conn.query(sql_1st.Insert_NFCID(p_btd_id,item),function (err, sqlres) {
                if(err)
                {
                    logger.debug('DBRES-ERROR:'+err.message);
                    cb(null,err.message+'</br>');
                }
                else
                {
                    n_cc++;          //成功则加1
                    cb(null,'YES');
                }
            })
        },function(err,dbres){
            //console.log(n_cc);
            //xc(n_cc);
            if(n_cc==p_rawdata.split("\r\n").length)
            { callback(n_cc+'条记录，全部导入成功');}
            else
            {
                callback(n_cc+'条导入成功,'+(p_rawdata.split("\r\n").length-n_cc)+
                    '条导入失败，失败原因为</br>,'+dbres)
            }
            conn.release();
        });
    });
};


//导入NFC_ID箱子
exports.Insert_NFCID_PACKAGE=function(p_pid,p_city,p_rawdata,callback){
    var map_serias={
        '酵素':'A1',
        '牛樟菇':'A1',
        '乳酸菌':'A1',
        '益多菌':'A1',
        '三素藻':'A1',
        '白金橙花匀亮修护隐形面膜':'A2',
        '洁面慕斯':'A2'
    };
    logger.debug('查询城市编码'+p_city);
    me.Get_SaleCityID(p_city,function(city_res){

        logger.debug('查询城市编码的结果'+city_res);
       // console.log(city_res);
       // console.log(map_serias['酵素']);
        var nfc_flag='CH'+city_res.city_code+map_serias[p_pid]+u_BRAND_R[p_pid]+'AA'
        console.log(nfc_flag);
        pool.getConnection(function(err, conn) {
            logger.debug('开始导入NFC_ID箱子');
            var n_cc=0;
            var n_rec_cc=0;
            async.mapLimit(p_rawdata.split("\r\n"),10,function(item,cb)
            {
                logger.debug('Req:'+n_rec_cc+':'+sql_1st.Insert_NFCID_PACKAGE(item,global.u_BRAND_R[p_pid],nfc_flag));
                n_rec_cc++;
                conn.query(sql_1st.Insert_NFCID_PACKAGE(item,global.u_BRAND_R[p_pid],nfc_flag),function (err, sqlres) {
                    if(err)
                    {
                        logger.debug('DBRES-ERROR:'+err.message);
                        cb(null,err.message+'</br>');
                    }
                    else
                    {
                        n_cc++;          //成功则加1
                        cb(null,'YES');
                    }
                })
            },function(err,dbres){
                if(n_cc==p_rawdata.split("\r\n").length)
                { callback(n_cc+'条记录，全部导入成功');}
                else
                {
                    callback(n_cc+'条导入成功,'+(p_rawdata.split("\r\n").length-n_cc)+
                        '条导入失败，失败原因为</br>,'+dbres)
                }
                conn.release();
            });
        });
    });
};

//查询批次号根据时间和商品
exports.Get_BtdByTimeandPd=function(p_ddtime,p_pdname,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_1st.query_bth_bytime_pdname(p_ddtime,p_pdname));
        console.log(sql_1st.query_bth_bytime_pdname(p_ddtime,p_pdname));
        acc.Gen_DB(conn,sql_1st.query_bth_bytime_pdname(p_ddtime,p_pdname),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询批次号根据时间
exports.Get_BtdByTime=function(p_ddtime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_1st.query_bth_bytime(p_ddtime));
        console.log(sql_1st.query_bth_bytime(p_ddtime));
        acc.Gen_DB(conn,sql_1st.query_bth_bytime(p_ddtime),2,function(dbres){
            callback(dbres);
        });
    });
};