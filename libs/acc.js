/**
 * Created by z30 on 14-10-18.
 */


exports.SendOnErr=function(res,objsend){
    try{
        res.send(objsend)}
    catch (err){
        res.send(err.message);
        console.log(err.message);
    }
};