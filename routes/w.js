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



//新增商品  2001  入参为商品的中文名称  :prdname/:place/:price
exports.w2001=function(req,res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    var now=moment();
    var runsqls={
        'selectSQL':sql.insest_prd.selectSQL(req.param('prdname')),
        'insertSQL':sql.insest_prd.insertSQL(
                                            req.param('prdname'),
                                            t.md5hash(req.param('prdname')),
                                            req.param('place'),
                                            req.param('price'),
                                            now.format('YYYY-MM-DD hh:mm:ss')
                                           )
    }
    tasks=['selectSQL','insertSQL'];

    pool.getConnection(function(err, conn) {
        async.mapSeries(tasks,function(item,callback){
            conn.query(runsqls[item],function (err, sqlres) {
                //console.log(runsqls[item]);
                console.log(sqlres);
                if(sqlres[0].cc>0)
                {
                    callback('该商品已存在',acc.SendOnErr(res,sqlres));
                } else
                {
                    callback(null,acc.SendOnErr(res,sqlres));
                }
            });
        },function(err,results){
            //console.log('该商品已存在');
            //console.log(results.join());
            conn.release();
        });
        /*
        conn.query(sql.query_prd.selectSQL(req.param('prdname')),function (err, sqlres) {
            acc.SendOnErr(res,sqlres[0]);
        });
        */
    });
};