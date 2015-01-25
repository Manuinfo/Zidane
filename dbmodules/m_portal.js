var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var me=require('./m_portal.js');
var me_login=require('./m_login.js');
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
            logger.debug('开始新建批次');
            logger.debug('Req:'+sql_1st.Insert_Bth_Basic(
                        t.md5hash(p_pid),
                        t.md5hash(p_pid)[0],
                        p_place,
                        0,
                        0,
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
                 0,
                 0,
                 p_vrftime,
                 now.format('YYYYMMDDHHmmss')+'-'+global.u_BRAND_R[p_pid]+'-'+city_res.city_code,
                 now.format('YYYY-MM-DD HH:mm:ss'),
                 p_rfile,
                 p_nfile,
                 p_bth_count,
                 p_bid_c
                 ),2,function(dbres){
                    logger.debug('批次新建完成');
                    callback(dbres);
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
        '白金橙花水润洁颜慕斯':'A2'
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
       // console.log(sql_1st.query_bth_bytime_pdname(p_ddtime,p_pdname));
        acc.Gen_DB(conn,sql_1st.query_bth_bytime_pdname(p_ddtime,p_pdname),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询批次号根据时间
exports.Get_BtdByTime=function(p_ddtime,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_1st.query_bth_bytime(p_ddtime));
       // console.log(sql_1st.query_bth_bytime(p_ddtime));
        acc.Gen_DB(conn,sql_1st.query_bth_bytime(p_ddtime),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询后台正在执行的任务
exports.Get_Tasks=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_batch_task());
        // console.log(sql_1st.query_bth_bytime(p_ddtime));
        acc.Gen_DB(conn,sql_g.qs_batch_task(),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询后台已完成的任务
exports.Get_Tasks_Done=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_batch_task_done());
        //console.log(sql_g.qs_batch_task_done());
        acc.Gen_DB(conn,sql_g.qs_batch_task_done(),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询后台已完成的任务的失败原因
exports.Get_Tasks_FailReason=function(p_tid,p_tname,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_batch_task_fail(p_tid,p_tname));
        //console.log(sql_g.qs_batch_task_done());
        acc.Gen_DB(conn,sql_g.qs_batch_task_fail(p_tid,p_tname),2,function(dbres){
            callback(dbres);
        });
    });
};

//查询后台代理商信息
exports.Get_ProxyInfo=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_proxy_info());
        //console.log(sql_g.qs_proxy_info());
        acc.Gen_DB(conn,sql_g.qs_proxy_info(),2,function(dbres){
            callback(dbres);
        });
    });
};


//查询我可以分配哪些上级
exports.Get_MyBossInfo=function(p_ulevel,p_name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.qs_my_upname(p_ulevel,p_name));
        //console.log(sql_g.qs_my_upname(p_ulevel,p_name));
        acc.Gen_DB(conn,sql_g.qs_my_upname(p_ulevel,p_name),2,function(dbres){
            callback(dbres);
        });
    });
};


//记录代理商表的变更日志
exports.InsertOpsLog=function(p_ip,p_ua,p_qtype,p_pk,p_old,p_obj,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_1st.Insert_Log_Basic(p_ip,p_ua,p_qtype,p_pk,p_old,p_obj));
        //console.log(sql_1st.Insert_Log_Basic(p_ip,p_ua,p_qtype,'NULL','NULL',p_obj));
        acc.Gen_DB(conn,sql_1st.Insert_Log_Basic(p_ip,p_ua,p_qtype,p_pk,p_old,p_obj),2,function(dbres){
            callback(dbres);
        });
    });
};


//更新代理商的信息表
exports.Up_ProxyInfo_Normal=function(p_obj_fd,p_obj_val,p_obj_pk,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_normal(p_obj_fd,p_obj_val,p_obj_pk));
       // console.log(sql_g.up_proxy_info_normal(p_obj_fd,p_obj_val,p_obj_pk));
        acc.Gen_DB(conn,sql_g.up_proxy_info_normal(p_obj_fd,p_obj_val,p_obj_pk),2,function(dbres){
            callback(dbres);
        });
    });
};

//更新代理商的等级，但其授权编号NAME、上下级关系等不变化
exports.Up_ProxyInfo_Level=function(p_obj_fd,p_obj_val,p_obj_pk,callback){
    //更新我作为下级的时候
    logger.debug('更新我作为下级的时候');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_level_1(p_obj_val,p_obj_pk));
        // console.log(sql_g.up_proxy_info_level_1(p_obj_val,p_obj_pk));
        acc.Gen_DB(conn,sql_g.up_proxy_info_level_1(p_obj_val,p_obj_pk),2,function(dbres1){

            //更新我作为上级的时候
            logger.debug('更新我作为上级的时候');
            pool.getConnection(function(err, conn) {
                logger.debug('Req:'+sql_g.up_proxy_info_level_2(p_obj_val,p_obj_pk));
                // console.log(sql_g.up_proxy_info_level_2(p_obj_val,p_obj_pk));
                acc.Gen_DB(conn,sql_g.up_proxy_info_level_2(p_obj_val,p_obj_pk),2,function(dbres2){
                    callback(dbres2);
                });
            });
        });
    });
};


//更新我的唯一上级 --新增
exports.Up_ProxyInfo_MyBoss_1=function(p_downame,p_upname,p_upid,p_downid,callback){
    logger.debug('新增我的唯一上级');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_myboss_1(p_downame,p_upname,p_upid,p_downid));
        acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_1(p_downame,p_upname,p_upid,p_downid),2,function(dbres){
            callback(dbres);
        });
    });
};


//更新我的唯一上级 -- 更新
exports.Up_ProxyInfo_MyBoss_2=function(p_downame,p_upname,p_upid,callback){
    logger.debug('更新我的唯一上级');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_myboss_2(p_downame,p_upname,p_upid));
        acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_2(p_downame,p_upname,p_upid),2,function(dbres){
            callback(dbres);
        });
    });
};


//更新代理商的等级，WHEN 授权编号发生变化的时候
exports.Up_ProxyInfo_Boss_All=function(p_oldname,p_newname,p_newid,callback){
    //更新我作为下级的时候
    logger.debug('授权编号变更_1：更新我作为下级的时候');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_myboss_all_s1(p_oldname,p_newname,p_newid));
        acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_all_s1(p_oldname,p_newname,p_newid),2,function(dbres1){

            //更新我作为上级的时候
            logger.debug('授权编号变更_2：更新我作为上级的时候');
            pool.getConnection(function(err, conn) {
                logger.debug('Req:'+sql_g.up_proxy_info_myboss_all_s2(p_oldname,p_newname,p_newid));
                acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_all_s2(p_oldname,p_newname,p_newid),2,function(dbres2){
                    callback(dbres2);
                });
            });
        });
    });
};


//更新代理商的等级后的日志，WHEN 授权编号发生变化的时候
exports.Up_ProxyInfo_Boss_Log=function(p_oldname,p_newname,callback){
    //更新我作为下级的时候
    logger.debug('授权编号变更_3：更新LifeLog的oldname，增加结束时间');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_myboss_all_s3(p_oldname));
        acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_all_s3(p_oldname),2,function(dbres1){

            //更新我作为上级的时候
            logger.debug('授权编号变更_4：新增LifeLog的newname，增加开始时间');
            pool.getConnection(function(err, conn) {
                logger.debug('Req:'+sql_g.up_proxy_info_myboss_all_s4(p_newname));
                acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_all_s4(p_newname),2,function(dbres2){

                    //最后更新代理商资料表
                    logger.debug('授权编号变更_5：更新py_user_accounts表');
                    pool.getConnection(function(err, conn) {
                        logger.debug('Req:'+sql_g.up_proxy_info_myboss_all_s5(p_oldname,p_newname));
                        acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_all_s5(p_oldname,p_newname),2,function(dbres3){
                            callback(dbres3);
                        });
                    });
                });
            });
        });
    });
};

//新增代理商的记录
exports.New_ProxyInfo=function(p_name,p_alname,p_ulevel,p_uzone,p_sid,p_person_id,
                               p_person_name,p_person_cell,p_tbname,p_menulevel,callback){                            //----
    logger.debug('新增代理商的记录');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.new_proxy_info(p_name,p_alname,p_ulevel,p_uzone,p_sid,p_person_id,p_person_name,
            p_person_cell,p_tbname,p_menulevel));
        acc.Gen_DB(conn,sql_g.new_proxy_info(p_name,p_alname,p_ulevel,p_uzone,p_sid,
            p_person_id,p_person_name,p_person_cell,p_tbname,p_menulevel),2,function(dbres){
            callback(dbres);
        });
    });
};

//新增代理商生命表的记录
exports.New_ProxyInfo_Life=function(p_newname,callback){                            //----
    logger.debug('新增代理商的生命记录');
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_g.up_proxy_info_myboss_all_s4(p_newname));
        acc.Gen_DB(conn,sql_g.up_proxy_info_myboss_all_s4(p_newname),2,function(dbres){
            callback(dbres);
        });
    });
};