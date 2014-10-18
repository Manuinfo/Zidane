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

//商品查询  2001  入参为商品的中文名称
exports.r2001=function(req,res){
  res.set({'Content-Type':'text/json','Encodeing':'utf8'});
  pool.getConnection(function(err, conn) {
       conn.query(sql.query_prd.selectSQL(req.param('prdname')),function (err, sqlres) {
           acc.SendOnErr(res,sqlres[0]);
       });
      conn.release();
  });
};

//批次查询  2002  入参为商品的中文名称
exports.r2002=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    pool.getConnection(function(err, conn) {
        conn.query(sql.query_prd.selectSQL(req.param('prdname')),function (err, sqlres) {
            acc.SendOnErr(res,sqlres[0]);
        });
        conn.release();
    });
};