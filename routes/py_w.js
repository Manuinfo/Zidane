/**
 * Created by linly on 14-10-28.
 */


var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var sql=require('../dbmodules/sql.js');
var m_login=require('../dbmodules/m_login.js');
var logger = require('../libs/log').logger;


//单元测试
exports.w2000=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
       // m_login.Get_AcctName(jbody.username,function(db_res){
       // m_login.Get_PassWord(jbody.username,jbody.passwd,function(db_res){
          //m_login.Login_Succ(jbody.username,jbody.passwd){
           //console.log(db_res);
           //acc.SendOnErr(res,t.res_one('SUCCESS','登陆成功'))
        //});
       // m_login.Login_Succ(jbody.username,jbody.passwd,jbody.ip,jbody.os);
        m_login.Login_Fail(jbody.username,jbody.passwd,jbody.ip,jbody.os);
        acc.SendOnErr(res,t.res_one('SUCCESS','登陆成功'))
    });
};


//登陆验证
exports.w2001=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        logger.debug('先判断用户名是否存在?');
        //先判断用户名是否存在？
        m_login.Get_AcctName(jbody.username,function(db_res){
            if(!db_res)
            {
                logger.debug(jbody.username+'该登陆名不存在');
                m_login.Login_HisAppend(jbody.username,jbody.ip,'该登陆名不存在');
                acc.SendOnErr(res,t.res_one('FAIL','该登陆名不存在'));
            }
            else //再判断密码是否正确
            {
                m_login.Get_PassWord(jbody.username,jbody.passwd,function(db_res){
                    if(!db_res)
                    {
                        logger.debug(jbody.username+'密码错误');
                        m_login.Login_Fail(jbody.username,jbody.passwd,jbody.ip,'密码错误');
                        acc.SendOnErr(res,t.res_one('FAIL','密码错误'));
                    } else if (db_res.state=='D')  //再判断账户是否被锁定
                    {
                        logger.debug(jbody.username+'账户被锁定');
                        m_login.Login_Fail(jbody.username,jbody.passwd,jbody.ip,'账户被锁定');
                        acc.SendOnErr(res,t.res_one('FAIL','账户被锁定'));
                    } else if (db_res.frstate==0)
                    {
                        logger.debug(jbody.username+'首次登陆需要修改密码');
                        m_login.Login_Fail(jbody.username,jbody.passwd,jbody.ip,'首次登陆需要修改密码');
                        acc.SendOnErr(res,t.res_one('FAIL','首次登陆需要修改密码'));
                    } else //登陆成功
                    {
                        logger.debug(jbody.username+'登陆成功');
                        m_login.Login_Succ(jbody.username,jbody.passwd,jbody.ip);
                        m_login.Get_AcctName(jbody.username,function(dbres2){
                            acc.SendOnErr(res,t.res_one('SUCC',dbres2));
                        });
                    }
                })
            }
        })
    });
};

//密码重置
exports.w2002=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        m_login.Get_AcctName(jbody.username,function(db_res){
            if(!db_res)
            {
                m_login.Login_HisAppend(jbody.username,jbody.ip,'重置用户名不存在');
                acc.SendOnErr(res,t.res_one('FAIL','重置用户名不存在'));
            } else
            {
                m_login.ResetPassword(jbody.username,jbody.passwd);
                m_login.Login_HisAppend(jbody.username,jbody.ip,'密码重置成功');
                acc.SendOnErr(res,t.res_one('SUCC','重置成功'));
            }
        });
    });
};


//首次登陆时的密码修改
exports.w2003=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        m_login.Get_AcctName(jbody.username,function(db_res){
            //console.log(db_res);
            if(db_res.frstate==1)
            {
                m_login.Login_HisAppend(jbody.username,jbody.ip,'非首次登陆不能修改密码，请联系厂商重置密码');
                acc.SendOnErr(res,t.res_one('FAIL','非首次登陆不能修改密码，请联系厂商重置密码'));
            }
            else
            {
                m_login.UpdatePasswdFr(jbody.username,jbody.passwd);
                m_login.Login_HisAppend(jbody.username,jbody.ip,'首次密码修改成功，请重新登陆');
                acc.SendOnErr(res,t.res_one('SUCC','首次密码修改成功，请重新登陆'));
            }
        });

    });
};