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
        logger.debug('Req:'+qss);
        cb(JSON.parse(qss));
    });
};