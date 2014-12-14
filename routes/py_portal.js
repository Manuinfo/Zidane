
var async=require('async');
var moment=require('moment');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var sql=require('../dbmodules/sql.js');
var m_anti=require('../dbmodules/m_anti.js');
var logger = require('../libs/log').logger;



exports.pt2001=function(req,res){
    res.render('home',{});
};