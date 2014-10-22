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
    };
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
    };
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

//2004 新增 指定位数的随机短链接 app.get('/w/2004/:bid/:qrcount/:qravtimes', rest_w.w2004);
exports.w2004=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    var now=moment();

    tasks=['insertSQL'];
    pool.getConnection(function(err, conn) {
         for(var i=0;i<req.param('qrcount');i++)
         {
             runsqls=sql.Insert_QRHrefID(req.param('bid'),t.get_random(10),req.param('qravtimes'));
             //console.log(runsqls);
             conn.query(runsqls,function (err, sqlres) {
                 if(err)
                 {
                    console.log(err.errno+' > '+err.message);
                    i--; }
                  //else
             });
         }
         console.log('DONE');
         conn.release();
    });
    acc.SendOnErr(res,JSON.stringify('新建二维码短链接记录成功，约2分钟后能全部录入完毕'));
};


//2005 二维码验证 面向用户 app.get('/w/2005/:qrhref/:cip/:cua', rest_w.w2005);
exports.w2005=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    var now=moment();

    var runsqls=sql.Query_ByQRhref(req.param('qrhref'));
    pool.getConnection(function(err, conn) {

        /* 先验证 QRCODE  */
        conn.query(runsqls,function (err, sqlres){
            console.log(sqlres);
            if(!sqlres[0])
            {  acc.SendOnErr(res,JSON.stringify({msg:"该短链接不存在"}));}
            else
            {
               if(sqlres[0].verify_av_times<1)
               {
                   acc.SendOnErr(res,JSON.stringify({msg:"该短链接存在，但可验证次数已达到上限"}));
               }
               else
               {
                   acc.SendOnErr(res,JSON.stringify({msg:"验证成功:未达到验证上限"}));
               }
            }
        })

    });

};


