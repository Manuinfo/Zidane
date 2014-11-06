/**
 * Created by linly on 14-10-29.
 */


var async=require('async');
var moment=require('moment');
var url=require('url');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var m_goods=require('../dbmodules/m_goods.js');
//var dbm=require('../dbmodules/rule.js')
var logger = require('../libs/log').logger;


//取基础信息
exports.r2001=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    switch (req.param('cmd'))
    {
        case 'GETGOODSBASE':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_BRAND));
            break;
        case 'GETSERIASID':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_SERIAL));
            break;
        case 'GETCHANNELID':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_CHID));
            break;
        case 'GETLEVEL':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_LAY));
            break;
        case 'GETLIMIT':
            acc.SendOnErr(res,t.res_one('SUCC',global.u_PACKLIMIT));
            break;
        case 'GETALLBASE':
            m_goods.Get_AllBase(function(dbres){ acc.SendOnErr(res,t.res_one('SUCC',dbres));});
            break;
        case 'GETREALNAME':
            m_goods.Get_RealName(function(dbres){
                //console.log(dbres);
                //xxx=acc.G_JSON({},dbres);
                //console.log(xxx);
                acc.SendOnErr(res,t.res_one('SUCC',acc.G_JSON({},dbres)));
            });
            break;
        default :
            acc.SendOnErr(res,t.res_one('FAIL','访问有问题，请重新确认'));
    }
};

//根据系列取商品列表
exports.r2002=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    //console.log(req.param('sid'));
    //console.log(global.u_SERIAL);
        logger.debug('根据系列取商品列表');
        m_goods.Get_NameBySerial(global.u_SERIAL[req.param('sid')],function(dbres){
            acc.SendOnErr(res,t.res_one('SUCC',dbres));
        });
        /*
    } else
    {
        acc.SendOnErr(res,t.res_one('FAIL','查询记录出错或该渠道下没有可售商品'));
    }*/
};

/* 装箱
* ---------------------------
* 1,判断盒子是否真实存在
* 2，判断盒子是否已装箱
* 3，判断箱子是否真实存在
* 4，判断箱子是否已装箱
*
*/
exports.r2003=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        //console.log(jbody);
        if(jbody.son_id)  //判断盒子ID是否属实
        {
            logger.debug('判断商品是否属实');
            m_goods.Get_NameByNFCID(jbody.son_id,global.u_PACKLIMIT[jbody.expgoods],function(dbres){

                if(dbres==1)
                {
                    logger.debug('判断商品属实');
                    var x=jbody.son_id.split(',');
                    logger.debug('判断盒子是否重复，限制为:'+global.u_PACKLIMIT[jbody.expgoods]);
                    //判断盒子ID是否重复
                    m_goods.Check_PackRepeat(x,function(xres){
                        if(acc.G_ARRAY_IF(xres,'ok')==parseInt(global.u_PACKLIMIT[jbody.expgoods]))
                        {
                            logger.debug('盒子不重复');
                            //判断箱子ID是否已存在
                            logger.debug('判断箱子ID是否存在，'+jbody.par_id);
                            m_goods.Check_BoxExist(jbody.par_id,function(boxres){
                                logger.debug(boxres);
                                //判断箱子ID是否已存在
                                if(boxres)
                                {
                                    logger.debug('箱子的ID存在'+jbody.par_id);
                                    if( (boxres.g_name!=jbody.expgoods ) && ((boxres.nfc_flag).substr(10,2)==jbody.expgoods))        //
                                    //if (boxres.g_name!=jbody.expgoods )
                                    {
                                        logger.debug('判断箱子ID存在与NFCFLAG相符合，继续校验是否已被装过箱');
                                        m_goods.Check_BoxExistMulti(jbody.par_id,jbody.expgoods,function(eeres){
                                            if(eeres[0]='NA')
                                            {
                                                logger.debug('箱子没有过装过箱，可以装箱');
                                                m_goods.Insert_PackHis(jbody.son_id.split(','),
                                                    jbody.par_id,
                                                    jbody.username,
                                                    jbody.expgoods,
                                                    jbody.channel_id,function(xxres){
                                                        logger.debug('装箱完毕');
                                                        acc.SendOnErr(res,t.res_one('SUCC','无重复记录,装箱完毕'));                                                                      //22222222222222
                                                    });
                                                m_goods.Update_BoxInfoPack(jbody.par_id,jbody.expgoods);

                                            }else
                                            {
                                                acc.SendOnErr(res,t.res_one('FAIL','箱子ID存在，但是已被装过箱，请核实'));
                                            }
                                        });
                                    } else
                                    {
                                        acc.SendOnErr(res,t.res_one('FAIL','箱子ID存在,但商品已被烧录，上次商品是:'+boxres.g_name+',上次时间为:'+boxres.bind_date));
                                        logger.debug('箱子ID存在,但商品已被烧录，上次商品是:'+boxres.g_name+',上次时间为:'+boxres.bind_date);
                                    }

                                } else
                                {
                                    acc.SendOnErr(res,t.res_one('FAIL','箱子ID不存在'));
                                    logger.debug('箱子不存在');
                                }
                            });
                        } else
                        {
                            delete x;
                            logger.debug('有记录重复:'+xres);
                            m_goods.Query_BigOrSmall(xres,function(repres){
                                acc.SendOnErr(res,t.res_one('FAIL','重复盒子:['+repres+']'));
                            });
                        }
                    });
                }else   //如果商品不匹配
                {
                    acc.SendOnErr(res,t.res_one('FAIL','有商品不匹配:['+dbres+']'));
                }
            });
        } else
        { acc.SendOnErr(res,t.res_one('FAIL','输入的ID有误，请重新输入'));  }
    });
};


//查询装箱历史
exports.r2004=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
        acc.Jspp(req,function(jbody){
            if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
            else
            {
            logger.debug('查询装箱历史');
            m_goods.Query_PackHis(jbody.username,jbody.stime,jbody.etime,function(dbres){
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            });
            }
        });
};


//查询下家范围
exports.r2005=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
        logger.debug('查询下家范围');
        m_goods.WhoIsMySons(jbody.username,function(dbres){
            //if(dbres)
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
        });
        }
    });
};

//查询上家是谁
exports.r2006=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
        logger.debug('查询上家范围');
        m_goods.WhoIsMyDaddy(jbody.username,function(dbres){
            acc.SendOnErr(res,t.res_one('SUCC',dbres));
        });
        }
    });
};

//收货时的验货接口
exports.r2007=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    logger.debug('收货时进行验货');
    acc.Jspp(req,function(jbody){
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
        m_goods.Check_Belongme(jbody.username,jbody.par_id,function(dbres){
            console.log(acc.G_ARRAY_KV_IF(dbres,':','记录为空'));
            if(acc.G_ARRAY_KV_IF(dbres,':','记录为空')==0)
            {
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            }
            else
                acc.SendOnErr(res, t.res_one('FAIL',dbres));
            m_goods.SendBox(jbody,function(insres){

            });
        });
        }
    });
};

//发货接口，也包含了验货
exports.r2008=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    logger.debug('准备发货');

    acc.Jspp(req,function(jbody){
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
        logger.debug('发货前验货');
        logger.debug('验货前校验账号LEVEL:'+jbody.username+','+global.u_ACCTS[jbody.username]);

        if ( parseInt(global.u_ACCTS[jbody.username])==2 )
        {
            //console.log(jbody.expgoods);
            logger.debug('工厂发货员:'+jbody.username+','+global.u_ACCTS[jbody.username]+'正校验这些箱子是否已装箱');
            m_goods.Check_BoxExistMulti(jbody.par_id.split(','),jbody.expgoods,function(yres){
                logger.debug('校验箱子ID是否已经装箱并且数量与扫描一致');
                console.log(yres);
                if(acc.G_ARRAY_IF(yres,'YES')==jbody.par_id.split(',').length)
                {
                    m_goods.SendBox(jbody,function(xxres){
                        acc.SendOnErr(res,t.res_one('SUCC','发货成功'));
                    });
                } else
                {
                    acc.SendOnErr(res,t.res_one('FAIL','有箱子未装箱或不存在:'+yres));
                }
            });

        } else
        {
            m_goods.Check_Belongme(jbody.username,jbody.par_id,function(dbres){
                console.log(dbres);
                //console.log(acc.G_ARRAY_KV_IF(dbres,':','记录为空'));
                if(acc.G_ARRAY_KV_IF(dbres,':','不是你的箱子')==0)
                {
                    logger.debug('验货通过，准备发货');
                    m_goods.SendBox(jbody,function(xxres){
                        acc.SendOnErr(res,t.res_one('SUCC','发货成功'));
                    });
                    //
                }
                else
                    acc.SendOnErr(res, t.res_one('FAIL',dbres));
            });
        }

        }
    });
};


//查询发货历史
exports.r2009=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    //
    acc.Jspp(req,function(jbody){
        logger.debug('查询发货历史');
        //console.log(jbody);
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
            m_goods.Query_SendHis(jbody.username,jbody.stime,jbody.etime,jbody.nfc_id,jbody.expgoods,function(dbres){
            acc.SendOnErr(res,t.res_one('SUCC',dbres));
        });
        }
    });
};

//查询ADMIN发货历史
exports.r2010=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    //
    acc.Jspp(req,function(jbody){
        logger.debug('查ADMIN的查询历史');
        //console.log(jbody);
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
            //console.log('222222222');
            m_goods.Query_AdminHis(jbody.stime,jbody.etime,jbody.goods_id,function(dbres){
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            });
        }
    });
};

//查询发货员的下家省级代理
exports.r2011=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        logger.debug('查询发货员的下家一级代理');
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
            logger.debug('查询下家范围');
            m_goods.WhoIsMySonsFSend(jbody.username,function(dbres){
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            });
        }
    });
};

//查询省级代理下面有多少一级代理
exports.r2012=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        logger.debug('查询省级代理下面有多少一级代理');
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
            logger.debug('查询下家范围');
            m_goods.WhoIsMySonsFSD(jbody.username,function(dbres){
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            });
        }
    });
};


//根据下家层级和上级NAME查这个下家有哪些下家
exports.r2013=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        logger.debug('根据下家层级和上级NAME查这个下家有哪些下家');
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
            logger.debug('查询下家范围');
            m_goods.WhoIsMySonsAccLevel(jbody.username,jbody.down_id,function(dbres){
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            });
        }
    });
};




//查询某项货最后一次收发记录
exports.r2014=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        logger.debug('查询某项货最后一次收发记录');
        //console.log(jbody);
        if(jbody.msg)  acc.SendOnErr(res,t.res_one('FAIL',jbody.msg));
        else {
            m_goods.Query_SendHis(jbody.username,jbody.stime,jbody.etime,jbody.nfc_id,jbody.expgoods,function(dbres){
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            });
        }
    });
};