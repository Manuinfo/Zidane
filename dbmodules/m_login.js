/**
 * Created by linly on 14-10-28.
 */

var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var sql_py=require('../dbmodules/sql_py.js');
var dbm=require('../dbmodules/rule.js');
var logger = require('../libs/log').logger;
var me=require('./m_login.js');


//检验APP的版本号
exports.Get_AppVersion=function(callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.check_app_version());
        console.log(sql_py.check_app_version())
        conn.query(sql_py.check_app_version(),function (err, sqlres) {
            if (err)  {throw err; logger.debug(err);}
            conn.release();
            callback(sqlres[0]);
        });
    })
};

//检验用户名是否存在
exports.Get_AcctName=function(name,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.check_acc_exist(name));
        conn.query(sql_py.check_acc_exist(name),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};

//检验密码是否存在
exports.Get_PassWord=function(name,passwd,callback){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.check_acc_pass(name,passwd));
        conn.query(sql_py.check_acc_pass(name,passwd),function (err, sqlres) {
            conn.release();
            callback(sqlres[0]);
        });
    })
};


//登陆成功，更新状态，时间,失败置0,插入记录
exports.Login_Succ=function(name,passwd,ip){
    var now=moment();
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.update_acclogintime(now.format('YYYY-MM-DD HH:mm:ss'),name));
        conn.query(sql_py.update_acclogintime(now.format('YYYY-MM-DD HH:mm:ss'),name),function (err, sqlres) {
            logger.debug('Req:'+sql_py.insert_accloginhis(name,now.format('YYYY-MM-DD HH:mm:ss'),ip,'SUCC','NULL'));
            conn.query(sql_py.insert_accloginhis(name,now.format('YYYY-MM-DD HH:mm:ss'),ip,'SUCC','NULL'),function (err, sqlres) {
                conn.release();
            });
        });
    });
};

//登陆失败，更新状态，时间,失败+1,插入记录
exports.Login_Fail=function(name,passwd,ip,reason){
    var now=moment();
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.update_acclogintime_err(now.format('YYYY-MM-DD HH:mm:ss'),name));
        conn.query(sql_py.update_acclogintime_err(now.format('YYYY-MM-DD HH:mm:ss'),name),function (err, sqlres) {
            logger.debug('Req:'+sql_py.insert_accloginhis(name,now.format('YYYY-MM-DD HH:mm:ss'),ip,'FAIL',reason));
            conn.query(sql_py.insert_accloginhis(name,now.format('YYYY-MM-DD HH:mm:ss'),ip,'FAIL',reason),function (err, sqlres) {
                conn.release();
            });
        });
    });
};

//用户名不存在，插入记录，不对用户表做修改
exports.Login_HisAppend=function(name,ip,reason){
    var now=moment();
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.insert_accloginhis(name,now.format('YYYY-MM-DD HH:mm:ss'),ip,'FAIL',reason));
        conn.query(sql_py.insert_accloginhis(name,now.format('YYYY-MM-DD HH:mm:ss'),ip,'FAIL',reason),function (err, sqlres) {
             conn.release();
        });
    });
};

//密码重置
exports.ResetPassword=function(name,passwd){
    var now=moment();
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.reset_passwd(name,passwd));
        conn.query(sql_py.reset_passwd(name,passwd),function (err, sqlres) {
            conn.release();
        });
    });
};

//首次登陆时的密码修改
exports.UpdatePasswdFr=function(name,passwd){
    pool.getConnection(function(err, conn) {
        logger.debug('Req:'+sql_py.update_passwd_fr(name,passwd));
        conn.query(sql_py.update_passwd_fr(name,passwd),function (err, sqlres) {
            //console.log(err,sqlres);
            conn.release();
        });
    });
};

//更新新资料
//13140731-1-1	王煜熳	一级代理	王孟佳	省级代理	湖南	110105198204118641	18301333551	lena1117

exports.UpdateNewID=function(accid,alname,ulevel,uzone,person_id,person_cell,person_name,serial_id){
    pool.getConnection(function(err, conn) {
        if(person_id=='无') {
            var passwd= t.md5hash('admin7890')
        } else
        {
            console.log(person_id.substr(12,6));
            var passwd= t.md5hash(person_id.substr(12,6))
        }
        logger.debug('Req:'+sql_py.update_new_id(accid,alname,passwd,ulevel,uzone,'A','0',serial_id,person_id,person_name,person_cell));                                                //3333333333
        conn.query(sql_py.update_new_id(accid,alname,passwd,ulevel,uzone,'A','0',serial_id,person_id,person_name,person_cell),function (err, sqlres) {
            if (!err)
            {
                conn.release();
                logger.debug('更新记录成功'+accid);
            } else
            {
                conn.release();
                logger.debug('更新记录失败'+accid+' '+err);
            }
        });
    });
};

//首次录入新资料
//13140731-1-1	王煜熳	一级代理	王孟佳	省级代理	湖南	110105198204118641	18301333551	lena1117
//0             1          2        3   4       5   6                   7           8
exports.AddNewID=function(accid,alname,ulevel,uzone,person_id,person_cell,person_name,serial_id){
    pool.getConnection(function(err, conn) {
        if(person_id=='无') {
            var passwd= t.md5hash('admin7890')
        } else
        {
            console.log(person_id.substr(12,6));
            var passwd= t.md5hash(person_id.substr(12,6))
        }
        logger.debug('Req:'+sql_py.insert_new_id(accid,alname,passwd,ulevel,uzone,'A','0',serial_id,person_id,person_name,person_cell));                                                //3333333333
        conn.query(sql_py.insert_new_id(accid,alname,passwd,ulevel,uzone,'A','0',serial_id,person_id,person_name,person_cell),function (err, sqlres) {
            if (!err)
            {
                conn.release();
                logger.debug('新增记录成功'+accid);
            } else
            {
                conn.release();
                logger.debug('新增记录失败'+accid+' '+err);
            }

        });
    });
};






