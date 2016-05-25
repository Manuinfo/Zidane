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

var prdObj={
    'a1':{
        'prd_img':'a1',
        'prd_name':'黑金藻酵素',
        'price':580,
        'intro_text':'24日上午，习近平来到黑龙江省抚远市玖成水稻种植专业合作社，了解合作社土地流转和采用先进种植技术提高水稻产量效益等情况。总书记登上一台自动插秧机，手扶方向盘，察看仪表盘，询问技术人员机械的工作原理、购买价格、插秧效率等。在快速育秧车间，农技人员介绍利用快速育秧设备进行超早育秧，提升稻米品质情况。总书记问：“这里种植什么品种？”“快速育苗产量能提高多少？”总书记问几位农民，合作社是什么时候成立的，土地流转后收入怎么样，还有什么打算。习近平说，黑龙江作为农业大省，保障国家粮食安全功不可没。在此基础上，要注重经济多元化发展，让农民生活水平不断提',
        'intro_img':'a1i'
    },
    'a2':{
        'prd_img':'a2',
        'prd_name':'牛樟菇',
        'price':680,
        'intro_text':'2种人早业大省，不断提',
        'intro_img':'a2i'
    },
    'a3':{
        'prd_img':'a3',
        'prd_name':'三素果酵素',
        'price':480,
        'intro_text':'2种人早业大省，不断提',
        'intro_img':'a3i'
    },
    'a4':{
        'prd_img':'a4',
        'prd_name':'三素藻酵素',
        'price':580,
        'intro_text':'2种人早业大省，不断提',
        'intro_img':'a4i'
    },
    'a5':{
        'prd_img':'a5',
        'prd_name':'益多菌',
        'price':380,
        'intro_text':'2种人早业大省，不断提',
        'intro_img':'a5i'
    }

};


//主管理界面
exports.prodHome=function(req,res){
    res.render('alipay/prodHome',{});
};

//商品详细介绍页
exports.prdDetailPage=function(req,res){
    var rendObj=prdObj[req.query.prd];
    res.render('alipay/prodDetail',rendObj);
};