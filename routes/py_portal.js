
var async=require('async');
var moment=require('moment');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var sql=require('../dbmodules/sql.js');
var m_anti=require('../dbmodules/m_anti.js');
var logger = require('../libs/log').logger;


//主管理界面
exports.pt2001=function(req,res){
    console.log(req.cookies);
    if (req.cookies["l_st"])
    {
        res.render('home',{});
    } else
    {
        res.redirect('/xlogin')
    }

};

//主登陆路界面
exports.pt2002=function(req,res){
    res.render('xlogin',{});
};
exports.pt2002_p=function(req,res){
    //console.log(req.body);
    if (req.body.acc_name=="ccc")
    {
        res.cookie("l_st","2333",{ maxAge: 5*60*1000,domain:"www.131su.com",httpOnly:true,path:"/"});
        res.redirect('/xadmin')
    }
    else
    { res.redirect('/xlogin')}

};