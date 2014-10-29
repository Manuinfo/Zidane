/**
 * Created by linly on 14-10-29.
 */


var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var m_goods=require('../dbmodules/m_goods.js');
//var dbm=require('../dbmodules/rule.js')
var logger = require('../libs/log').logger;


//取基础信息
exports.r2001=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    switch (req.param('cmd'))
    {
        case 'GETGOODSBASE':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_BRAND));
            break;
        case 'GETSERIASID':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_SERIAL));
            break;
        case 'GETCHANNELID':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_CHID));
            break;
        case 'GETLEVEL':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_LAY));
            break;
        case 'GETALLBASE':
            m_goods.Get_AllBase(function(dbres){ acc.SendOnErr(res,t.res_one('SUCC',dbres));});
            break;
        default :
            acc.SendOnErr(res,t.res_one('FAIL','访问有问题，请重新确认'));
    }
};

//根据系列取商品列表
exports.r2002=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    //console.log(req.param('sid'));
    //console.log(global.u_CHID);
    if(global.u_CHID[req.param('sid')])
    {
        m_goods.Get_NameBySerial(global.u_CHID[req.param('sid')].split(','),function(dbres){
        acc.SendOnErr(res,t.res_one('SUCC',dbres));
        });
    }
};

