/**
 * Created by z30 on 14-10-18.
 */

var logger = require('../libs/log').logger;

//发送时做校验
exports.SendOnErr=function(res,objsend){
    try{
        logger.debug('Res:'+objsend);
        res.send(objsend);
    }
    catch (err){
        logger.debug('Res:'+err.message);
        res.send(err.message);
        //console.log(err.message);
    }
};

//翻译REQ至JSON
exports.Jspp=function(req,cb)
{
    logger.debug('Req:'+req.url+' '+req.method);
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