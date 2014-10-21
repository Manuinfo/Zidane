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
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    var now=moment();
    var runsqls={
        'insertSQL':sql.insert_prd_basic(
                                            req.param('shopname'),
                                            req.param('prdname'),
                                            t.md5hash(req.param('prdname')),
                                            req.param('place'),
                                            req.param('price'),
                                            now.format('YYYY-MM-DD hh:mm:ss')
                                           )
    }
    tasks=['insertSQL'];
    pool.getConnection(function(err, conn) {
        async.mapSeries(tasks,function(item,callback){
            conn.query(runsqls[item],function (err, sqlres) {
                if(err)
                    callback(err,acc.SendOnErr(res,JSON.stringify(err.message+err.errno)));
                else
                    callback(null,acc.SendOnErr(res,JSON.stringify('新建记录成功')));
            });
        },function(err){
            conn.release();
            delete now;
        });
    });
};


//新增批次  2002  :shopname/:prdname/:place/:price
exports.w2002=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    var now=moment();

    pool.getConnection(function(err, conn) {
        var step={
            'select':function(cb) {
                        conn.query(sql.query_pid_byprdname(req.param('prdname')
                        ),function (err, sqlres) {
                        if(sqlres)
                            cb(null,sqlres[0].product_id);
                        });
            },
            'insert':function(n, cb) {
                        conn.query(sql.insert_bth_basic(
                            n,
                            n.substr(31,1),
                            t.md5hash(req.param('prdname')),
                            req.param('place'),
                            req.param('price'),
                            now.format('YYYY-MM-DD hh:mm:ss')
                        ),function (err, sqlres) {
                              cb(null,sqlres);
                        });
            }
        };
/*
     return 'insert into products values (\''+p_pid+"',"+
            '\''+p_pid_part+"',"+
            '\''+p_place+"',"+
            p_bth_count+","+
            p_nfc_count+","+
            p_vrftime+","+
            '\''+p_bthid+"',"+
            '\''+p_crdate+"',NULL)";
    }
    */
        var tasks=[step.select,step.insert];


        async.waterfall(tasks, function(err, result) {
            conn.release();
            delete now;
            //log('1.1 err: ', err);
            //log('1.1 result: ', result);
        });
    });

    /*
     return 'insert into products values (\''+p_pid+"',"+
     '\''+p_pid_part+"',"+
     '\''+p_place+"',"+
     p_bth_count+","+
     p_nfc_count+","+
     p_vrftime+","+
     '\''+p_bthid+"',"+
     '\''+p_crdate+"',NULL)";
     }

     */
    //tasks=['selectSQL','insertSQL'];

};