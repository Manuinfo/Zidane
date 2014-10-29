/**
 * Created by z30 on 14-10-18.
 */

var logger = require('../libs/log').logger;

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


exports.Jspp=function(req,cb)
{
    logger.debug('Req:'+req.url+' '+req.method);
    var qss='';
    req.on('data',function(chunk)
    {
        qss+=chunk;
    });
    req.on('end',function(){
        //console.log(qss);
        logger.debug('Req:'+qss);
        cb(JSON.parse(qss));
    });
};

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
}