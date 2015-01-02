/**
 * Created by z30 on 14-10-18.
 */

var logger = require('../libs/log').logger;
var pool   = require('../conf/db.js');
var http   = require('http');
var me     = require('./acc.js');




//发送时做校验
exports.SendOnErr=function(res,objsend){
    try{
        logger.debug('Res:'+objsend);
        logger.debug('DB Pool Monitor Info@Res:'+pool._freeConnections.length+'/'+pool._allConnections.length);
        res.send(objsend);
    }
    catch (err){
        logger.debug('Res:'+err.message);
        logger.debug('DB Pool Monitor Info@Res:'+pool._freeConnections.length+'/'+pool._allConnections.length);
        res.send(err.message);
        //console.log(err.message);
    }
};

//翻译REQ至JSON
exports.Jspp=function(req,cb)
{
    logger.debug('Req:'+req.url+' '+req.method);
    logger.debug('DB Pool Monitor Info@Req:'+pool._freeConnections.length+'/'+pool._allConnections.length);

    //logger.debug(req);
    var qss='';
    req.on('data',function(chunk)
    {
        qss+=chunk;
    });
    req.on('end',function(){
        //console.log(qss);
        //console.log(qss);
        logger.debug('Req:'+qss);
        try{
            JSON.parse(qss);
            cb(JSON.parse(qss));
        }
        catch (err){
            if(err)
            {
                logger.debug('Res:'+err.message);
                cb(JSON.parse("{\"msg\":\""+err.message+"\"}"));
            }
            else
                cb(JSON.parse(qss));
            //console.log(err.message);
        }
    });
};

//翻译JSON拼接
exports.Jsadd=function extend(des, src, override){
    if(src instanceof Array){
        for(var i = 0, len = src.length; i < len; i++)
            extend(des, src[i], override);
    }
    for( var i in src){
        if(override || !(i in des)){
            des[i] = src[i];
        }
    }
    return des;
};



//从数组组装成JSON 格式1
exports.G_JSON=function extend(des, src){
    des={};
    //console.log(src);
    for(var i = 0, len = src.length; i < len; i++)
        //console.log(src[i]);
        des[src[i].id]=src[i].name;
   // console.log(des);
    return des;
};

//从数组组装成JSON 格式2
exports.G_JSON_R=function extend(des, src){
    des={};
    //console.log(src);
    for(var i = 0, len = src.length; i < len; i++)
        //console.log(src[i]);
        des[src[i].name]=src[i].id;
    // console.log(des);
    return des;
};

//判断数组制定字符重复数量
exports.G_ARRAY_IF=function(arr,xstr){
    var n=0;
    for(var i=0,len=arr.length;i<len;i++)
        if (arr[i]==xstr) n++;
    return n;
};

//判断数组内K-V中V的制定字符重复数量
exports.G_ARRAY_KV_IF=function(arr,delimer,xstr){
    var n=0;
    for(var i=0,len=arr.length;i<len;i++)
    {  if ((arr[i].split(delimer))[1]==xstr) n++;}
    return n;
};


/*自定义框架，统一查询DB
 * 连接串、SQL、返回的记录数、CB
 *
 */

exports.Gen_DB=function(p_conn,p_sql,p_rec_num,callback){
    p_conn.query(p_sql,function (err, sqlres) {
        if (err) {p_conn.release();throw err;logger.debug(err);}
        p_conn.release();
        (p_rec_num==1) ? callback(sqlres[0]) : callback(sqlres);
    });
};


//JS 去重数组
exports.getNoRepeat=function (s_arr) {
    return s_arr.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");
}

//讲分组数据返回成html select optgroup 的格式
exports.ConvToGroup=function(p_arr,p_title,callback){

    var arr_new=[];
    for(var i=0;i<p_arr.length;i++)
    {
        var obj={};
        obj['text']=p_title+p_arr[i].ulevel;
        obj['children']=[];

        for(var j=0;j<p_arr[i].text.split(',').length;j++)
        {
            var obj_inner={};
            obj_inner['id']=p_arr[i].text.split(',')[j];
            obj_inner['text']=p_arr[i].text.split(',')[j];
            obj['children'].push(obj_inner)
        }
        arr_new.push(obj)
    }
  //  console.log(arr_new);
    callback(arr_new);

};