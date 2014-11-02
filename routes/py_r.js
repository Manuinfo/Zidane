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
        case 'GETALLBASE':
            m_goods.Get_AllBase(function(dbres){ acc.SendOnErr(res,t.res_one('SUCC',dbres));});
            break;
        default :
            acc.SendOnErr(res,t.res_one('FAIL','访问有问题，请重新确认'));
    }
};

//根据系列取商品列表
exports.r2002=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    //console.log(req.param('sid'));
    //console.log(global.u_CHID);
    if(global.u_CHID[req.param('sid')])
    {
        m_goods.Get_NameBySerial(global.u_CHID[req.param('sid')].split(','),function(dbres){
        acc.SendOnErr(res,t.res_one('SUCC',dbres));
        });
    } else
    {
        acc.SendOnErr(res,t.res_one('FAIL','查询记录出错或该渠道下没有可售商品'));
    }
};

/*先根据NFCID查看商品信息
* 也就是看是否这个ID是这个商品
* 再看有无重复
*/
exports.r2003=function(req,res){
    res.set({'Content-Type':'text/html;charset=utf-8','Encodeing':'utf-8'});
    acc.Jspp(req,function(jbody){
        //console.log(jbody.son_id);
        if(jbody.son_id)  //判断小盒ID是否存在
        {
            logger.debug('判断商品是否属实');
            m_goods.Get_NameByNFCID(jbody.son_id,global.u_PACKLIMIT[jbody.expgoods],function(dbres){
                //console.log(dbres);

                if(dbres==1)  //判断商品是否属实
                {
                    var x=jbody.son_id;
                    x.push(jbody.par_id);
                    //console.log(x);
                    logger.debug('判断盒子是否重复');
                    //console.log(global.u_PACKLIMIT[jbody.expgoods]);
                    m_goods.Check_PackRepeat(x,function(xres){
                        //console.log(xres)
                        //console.log(acc.G_ARRAY_IF(xres,'ok'));
                        //console.log(global.u_PACKLIMIT[jbody.expgoods]+1);
                        if(acc.G_ARRAY_IF(xres,'ok')==parseInt(global.u_PACKLIMIT[jbody.expgoods])+1)
                        {
                            delete x;
                            logger.debug('不重复，开始装箱');
                            m_goods.Insert_PackHis(jbody.son_id,
                                                   jbody.par_id,
                                                   jbody.username,
                                                   jbody.expgoods,
                                                   jbody.channel_id,function(xxres){
                              logger.debug('装箱完毕');
                              acc.SendOnErr(res,t.res_one('SUCC','无重复记录,装箱完毕'));
                            });
                            //
                        } else
                        {
                            delete x;
                            logger.debug('有记录重复:'+xres);
                            acc.SendOnErr(res,t.res_one('FAIL','有记录重复:'+xres));
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
        m_goods.Check_Belongme(jbody.par_id,function(dbres){
            console.log(acc.G_ARRAY_KV_IF(dbres,':','记录为空'));
            if(acc.G_ARRAY_KV_IF(dbres,':','记录为空')==0)
            {
                acc.SendOnErr(res,t.res_one('SUCC',dbres));
            }
            else
                acc.SendOnErr(res, t.res_one('FAIL',dbres));
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
        //如果是工厂发货人员则不校验收货上家，NEW一根CHIAN出来
        logger.debug('验货前校验账号LEVEL:'+jbody.username+','+global.u_ACCTS[jbody.username]);
        if ( global.u_ACCTS[jbody.username]==1 )
        {
            m_goods.SendBox(jbody,function(xxres){
                acc.SendOnErr(res,t.res_one('SUCC','发货成功'));
            });
        } else
        {
            m_goods.Check_Belongme(jbody.par_id,function(dbres){
                //console.log(acc.G_ARRAY_KV_IF(dbres,':','记录为空'));
                if(acc.G_ARRAY_KV_IF(dbres,':','记录为空')==0)
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
            //console.log('222222222');
            m_goods.Query_SendHis(jbody.username,jbody.stime,jbody.etime,jbody.nfc_id,function(dbres){
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


