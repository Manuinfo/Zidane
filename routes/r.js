/**
 * Created by z30 on 14-10-18.
 */

var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var sql=require('../dbmodules/sql.js');
var tasks=require('../dbmodules/rule.js');

//2001 根据商品名称查询商品
exports.r2001=function(req,res){
  res.set({'Content-Type':'text/json','Encodeing':'utf8'});
  pool.getConnection(function(err, conn) {
       conn.query(sql.query_prd_byprdname(req.param('prdname')),function (err, sqlres) {
           acc.SendOnErr(res,sqlres[0]);
       });
      conn.release();
  });
};

//2002 根据商品查询批次信息
exports.r2002=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_bth_byprdname(req.param('prdname')),function (err, sqlres) {
            //console.log(sql.query_bth_byprdname.selectSQL(req.param('prdname')));
            acc.SendOnErr(res,sqlres);
        });
        conn.release();
    });
};

//2003  根据批次号查询批次
exports.r2003=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_bth_bybid(req.param('bid')),function (err, sqlres) {
            console.log(sql.query_bth_bybid(req.param('bid')));
            acc.SendOnErr(res,sqlres[0]);
        });
        conn.release();
    });
};

//2004  根据QR查商品信息
exports.r2004=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_prd_byqrhref(req.param('qr')),function (err, sqlres) {
            //console.log(sql.query_prd_byqrhref.selectSQL(req.param('qr')));
            acc.SendOnErr(res,sqlres[0]);
        });
        conn.release();
    });
};

//2005  根据QR查询批次信息
exports.r2005=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    var now=moment();
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_bth_byqrhref(req.param('qr')),function (err, sqlres) {
            //console.log(sql.query_bth_byqrhref.selectSQL(req.param('qr')));
            acc.SendOnErr(res,sqlres[0]);
        });
        conn.release();
    });
};

//2006  根据名字查看厂商
exports.r2006=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_shop_byshopname(req.param('shopname')),function (err, sqlres) {
            console.log(sql.query_shop_byshopname(req.param('shopname')));
            acc.SendOnErr(res,sqlres);
        });
        conn.release();
    });
};

//2007  根据商品名称查询PID
exports.r2007=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_pid_byprdname(req.param('prdname')),function (err, sqlres) {
            console.log(sql.query_pid_byprdname(req.param('prdname')));
            acc.SendOnErr(res,sqlres);
        });
        conn.release();
    });
};

//2008  根据QR查批次号
exports.r2008=function(req,res){
    res.set({'Content-Type':'text/html','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.Query_ByQRhref(req.param('qrcode')),function (err, sqlres) {
            console.log(sql.Query_ByQRhref(req.param('qrcode')));
            if(sqlres[0])
            { acc.SendOnErr(res,sqlres[0].batch_id);}
            else
            { acc.SendOnErr(res,JSON.stringify({msg:"无记录"}))};
        });
        conn.release();
    });
};

//2009  验证随机码
exports.r2009=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf8'});
    var now=moment();

    pool.getConnection(function(err, conn) {
        conn.query(sql.Query_Random_Code(req.param('rdcode'),now.format('YYYY-MM-DD hh:mm:ss')),function (err, sqlres) {
            console.log(sql.Query_Random_Code(req.param('rdcode'),now.format('YYYY-MM-DD hh:mm:ss')));
            if(!sqlres[0])
            { acc.SendOnErr(res, t.res_one('FAIL','验证失败，随机码不存在或已超时5分钟'))}
            else
            {
              acc.SendOnErr(res, t.res_one('SUCCESS','验证成功'))
            }
        });
        conn.release();
    });
};
