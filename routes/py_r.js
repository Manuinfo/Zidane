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
var dbm=require('../dbmodules/rule.js')
var logger = require('../libs/log').logger;

exports.r2001=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    switch (req.param('cmd'))
    {
        case 'GETGOODSBASE':
            acc.SendOnErr(res,t.res_one('SUCC',dbm.goodsmapid));
            break;
        case 'GETSERIASID':
            acc.SendOnErr(res,t.res_one('SUCC',dbm.seriasid));
            break;
        case 'GETLEVEL':
            acc.SendOnErr(res,t.res_one('SUCC',dbm.ulevel));
            break;
        default :
            acc.SendOnErr(res,t.res_one('FAIL','访问有问题，请重新确认'));
    }
};
