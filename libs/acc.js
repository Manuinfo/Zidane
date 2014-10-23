/**
 * Created by z30 on 14-10-18.
 */

var logger = require('../libs/log').logger;

exports.SendOnErr=function(res,objsend){
    try{
        logger.info(objsend);
        res.send(objsend);
    }
    catch (err){
        logger.info(err.message);
        res.send(err.message);
        //console.log(err.message);
    }
};