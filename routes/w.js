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
                    callback(err,acc.SendOnErr(res,JSON.stringify(err.errno+' > '+err.message)));
                else
                    callback(null,acc.SendOnErr(res,JSON.stringify('新建记录成功')));
            });
        },function(err){
            conn.release();
            delete now;
        });
    });
};


//新增批次  2002  /w/2002/:prdname/:place/:bcount/:nfccount/:vrftime
exports.w2002=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    var now=moment();
    var p_pid,p_place_id;
    //t.get_pid(req.param('prdname'),function(res1){p_pid=res1});
    //t.get_zoneid(req.param('place'),function(res1){p_place_id=res1});

    var runsqls={
        's1':sql.Query_Pid_ByPrdName(req.param('prdname')),
        's2':sql.Query_Zid_ByZoneName(req.param('place'))
    };

    var tasks=['s1','s2'];

    pool.getConnection(function(err, conn) {
        async.map(tasks,function(item,callback){
            conn.query(runsqls[item],function (err, sqlres) {
                callback(null,sqlres[0])
            });
        },function(err,everes){
            conn.query(sql.Insert_Bth_Basic(
                everes[0].product_id,
                everes[0].product_id.substr(31,1),
                req.param('place'),
                req.param('bcount'),
                req.param('nfccount'),
                req.param('vrftime'),
                now.format('YYYYMMDD')+p_pid+everes[1].city_code+now.format('hhmm'),
                now.format('YYYY-MM-DD hh:mm:ss')
            ),function (err, sqlres) {
                //console.log(err);
                conn.release();
                delete now;
                if(err)
                    acc.SendOnErr(res,JSON.stringify(err.errno+' > '+err.message));
                else
                    acc.SendOnErr(res,JSON.stringify('新建记录成功'));
            });
        });
    });
};

//2003 新增NFCID /w/2003/:bid/:nfcid
exports.w2003=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    var now=moment();
    var runsqls={
        'insertSQL':sql.Insert_NFCID(req.param('bid'),req.param('nfcid'))
    }
    tasks=['insertSQL'];
    pool.getConnection(function(err, conn) {
        async.mapSeries(tasks,function(item,callback){
            conn.query(runsqls[item],function (err, sqlres) {
                if(err)
                    callback(err,acc.SendOnErr(res,JSON.stringify(err.errno+' > '+err.message)));
                else
                    callback(null,acc.SendOnErr(res,JSON.stringify('新建记录成功')));
            });
        },function(err){
            conn.release();
            delete now;
        });
    });

}