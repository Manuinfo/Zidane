/**
 * Created by z30 on 16/5/25.
 */


var async=require('async');
var moment=require('moment');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var m_portal=require('../dbmodules/m_portal.js');
var m_goods=require('../dbmodules/m_goods.js');
var m_login=require('../dbmodules/m_login.js');

var fs = require('fs');
var os=require('os');

//主管理界面
exports.prodHome=function(req,res){
    res.render('alipay/prodHome',{});
};