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
var sql_py=require('../dbmodules/sql_py.js');
var dbm=require('../dbmodules/rule.js');
var logger = require('../libs/log').logger;


//检验用户名是否存在，2001，入参为用户名、密码
exports.w2001=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){

    acc.SendOnErr(res,t.res_one('SUCCESS','登陆成功'))
    pool.getConnection(function(err, conn) {



    async.series({
        one: function(callback){
            conn.query(sql_py.check_acc_exist(jbody.username),function (err, sqlres) {
               callback(null,sqlres);
            });
        },
        two: function(callback){

        }
    },
    function(err, results) {
        console.log(results);
    });

    });
    });
};

