/**
 * Created by z30 on 14-10-18.
 */

var logger = require('../libs/log').logger;

exports.SendOnErr=function(res,objsend){
    try{
        logger.debug(objsend);
        res.send(objsend);
    }
    catch (err){
        logger.debug(err.message);
        res.send(err.message);
        //console.log(err.message);
    }
};


exports.Jspp=function(req,cb)
{
    var qss;
    req.on('data',function(chunk)
    {
        qss+=chunk;
    });
    req.on('end',function(){
        cb(qss);
    });
};