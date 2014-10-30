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




