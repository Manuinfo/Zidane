
var async=require('async');
var moment=require('moment');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var m_portal=require('../dbmodules/m_portal.js');
var m_goods=require('../dbmodules/m_goods.js');
var fs = require('fs');
var os=require('os');

var logger = require('../libs/log').logger;


//主管理界面
exports.pt2001=function(req,res){
    console.log(req.cookies);
    if (req.cookies["l_st"])
    {
        res.render('home',{});
    } else
    {
        res.redirect('/xlogin')
    }
};

//主登陆路界面
exports.pt2002=function(req,res){
    res.render('xlogin',{});
};
exports.pt2002_p=function(req,res){
    //console.log(req.body);
    if (req.body.acc_name=="ch_abc")
    {
        res.cookie("l_st", t.md5hash('fsdf'),{ maxAge: 30*60*1000,domain:"www.131su.com",httpOnly:true,path:"/"});
        res.redirect('/xadmin')
    }
    else
    { res.redirect('/xlogin')}

};

//查询当日装箱和发货
exports.pt2003=function(req,res){
    if (req.cookies["l_st"])
    {
        var now=moment();
        m_portal.Get_PackNumToday(now.format('YYYY-MM-DD'),function(dbres){
            m_portal.Get_SendNumToday(now.format('YYYY-MM-DD'),function(dbres2){
                //console.log(dbres)
                res.render('pack_send',{
                    n_res:dbres,
                    n_res_2:dbres2
                });
            });
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//查询单个NFC_ID的装箱记录
exports.pt2003_p_1=function(req,res){
    if (req.cookies["l_st"])
    {
        //console.log(req.body.nfc_id)
        m_portal.Get_BoxHasPacked(req.body.nfc_id,function(dbres){
            if(!dbres) res.send({msg:"NULL"});
            else res.send(dbres)
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//查询单个NFC_ID是否有效
exports.pt2003_p_2=function(req,res){
    if (req.cookies["l_st"])
    {
        console.log(req.body.nfc_id)
        m_portal.Get_NFC_legal(req.body.nfc_id,function(dbres){
            console.log(dbres);
            res.send(dbres)
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//查询单个NFC_ID是否有效
exports.pt2004=function(req,res){
    if (req.cookies["l_st"])
    {
        m_goods.Get_AllGoods(function(dbres){
            //console.log(dbres);
            res.render('goods_query',{n_res:dbres})
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//变更商品，添加、删除
exports.pt2005=function(req,res){
    if (req.cookies["l_st"])
    {
          res.render('goods_change',{})
    } else
    {
        res.redirect('/xlogin')
    }
};

//变更商品，添加、删除-POST
exports.pt2005_p=function(req,res){
    if (req.cookies["l_st"])
    {
        console.log(req.body);
        console.log(req.files);
        res.send({msg:'5555'})
    } else
    {
        res.redirect('/xlogin')
    }
};


//批次NFC_ID上传的页面GET 盒子
exports.pt2006=function(req,res){
    if (req.cookies["l_st"])
    {
        m_goods.Get_AllGoods(function(dbres){
           // console.log(dbres);
            res.render('batch_upload',{res_goods:dbres})
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//处理批次NFC_ID的POST请求盒子
exports.pt2006_p=function(req,res){
    res.setTimeout(360*1000);
    if (req.cookies["l_st"])
    {
        //console.log(req.body);
        //console.log(req.files);
        console.log(req.files.houseMaps.originalFilename);
        console.log(req.files.houseMaps.ws.path);
        var fname='';
        os.type()=='Windows_NT'?fname='./public/admin/uploads/'+req.files.houseMaps.ws.path.split('\\')[6]:fname=req.files.houseMaps.ws.path;
        logger.debug('获得文件名为:'+req.files.houseMaps.originalFilename);
        logger.debug('落地的路径为:'+req.files.houseMaps.ws.path);
        logger.debug('导入文件名为:'+fname);
        fs.readFile(fname,
            'utf-8',
            function (err, xdata) {
            if (err) throw err;
            //console.log(data.split('\r\n'));

            m_portal.New_Batch(req.body.i_goods,req.body.i_city,xdata.split('\r\n').length,xdata.split('\r\n').length,req.body.i_qrcc,
                req.files.houseMaps.originalFilename,
                fname,
                xdata,req.body.i_btd_c,
                function(dbres){
                    if(dbres.affectedRows==1)
                        res.send('新建批次成功，约1分钟后，后台会自动执行NFC_ID的导入，您可进入“后台任务”菜单进行查看')
                    else
                        res.send('新建批次失败，查看批次种是否有重复记录')
                    //res.send(dbres)
                });
        });
    } else
    {
        res.redirect('/xlogin')
    }
};




//批次NFC_ID箱子上传的页面GET
exports.pt2007=function(req,res){
    if (req.cookies["l_st"])
    {
        m_goods.Get_AllGoods(function(dbres){
            // console.log(dbres);
            res.render('batch_upload',{res_goods:dbres})
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//处理批次NFC_ID的POST请求 箱子
exports.pt2007_p=function(req,res){
    res.setTimeout(300*1000);
    if (req.cookies["l_st"])
    {
        //console.log(req.body);
        //console.log(req.files);
        console.log(req.files.houseMaps.originalFilename);
        console.log(req.files.houseMaps.ws.path);
        var fname='';
        os.type()=='Windows_NT'?fname='./public/admin/uploads/'+req.files.houseMaps.ws.path.split('\\')[6]:fname=req.files.houseMaps.ws.path;
        logger.debug('获得文件名为:'+req.files.houseMaps.originalFilename);
        logger.debug('落地的路径为:'+req.files.houseMaps.ws.path);
        logger.debug('导入文件名为:'+fname);
        fs.readFile(fname,
            'utf-8',
            function (err, xdata) {
                if (err) throw err;
                //console.log(data.split('\r\n'));

                m_portal.Insert_NFCID_PACKAGE(req.body.i_goods,req.body.i_city,
                    //req.files.houseMaps.originalFilename,
                    //req.files.houseMaps.ws.path.split('\\')[6],
                    xdata,
                    function(dbres){
                        //console.log(dbres);
                        //res.send({msg:dbres.affectedRows})
                        res.send(dbres)
                    });
            });
    } else
    {
        res.redirect('/xlogin')
    }
};



//管理我的批次
exports.pt2008=function(req,res){
    if (req.cookies["l_st"])
    {
        m_goods.Get_AllGoods(function(dbres){
            // console.log(dbres);
            res.render('batch_mgnt',{res_goods:dbres})
        });    } else
    {
       res.redirect('/xlogin')
    }
};

//批次的定向刷新
exports.pt2008_p=function(req,res){
    if (req.cookies["l_st"])
    {
       console.log(req.body);
       var x_ddtime='';
       var now=moment();
      //  console.log(now.format('HH')*60+now.format('mm'))
       // 时间默认值为NULL=今日从00:00到now()
       req.body.m_ddtime=='NULL'?x_ddtime=parseFloat(now.format('HH')*60+parseInt(now.format('mm')))/(24*60):x_ddtime=req.body.m_ddtime;
       console.log(x_ddtime);
       // 商品初始不选择，则选择所有商品
      if(req.body.m_pdname=='NULL')
      {
          m_portal.Get_BtdByTime(x_ddtime,function(dbres){
              res.send(dbres);
          })
      } else
      {
          m_portal.Get_BtdByTimeandPd(x_ddtime,req.body.m_pdname,function(dbres){
              res.send(dbres);
          });
      }

    } else
    {
        res.redirect('/xlogin')
    }
};


//管理批次的后台任务
exports.pt2009=function(req,res){
    if (req.cookies["l_st"])
    {
        m_portal.Get_Tasks(function(dbres){
            m_portal.Get_Tasks_Done(function(dbres2){
              //  console.log(dbres2)
                res.render('batch_task',{n_res:dbres,done_res:dbres2})
            });
        })
    } else
    {
        res.redirect('/xlogin')
    }
};

//管理批次的后台任务
exports.pt2009_p=function(req,res){
    if (req.cookies["l_st"])
    {
        //console.log(req.body);
        m_portal.Get_Tasks_FailReason(req.body.m_tid,req.body.m_tname,function(dbres){
            res.send(dbres)
        });
    } else
    {
        res.redirect('/xlogin')
    }
};


//代理商信息维护的GET 页面
exports.pt2010=function(req,res){
    if (req.cookies["l_st"])
    {
        logger.debug(req.body);
        m_portal.Get_ProxyInfo(function(dbres){
            logger.debug('资料读取完毕')
           // logger.debug(dbres);
            res.render('proxy_info',{n_res:dbres});
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的姓名
exports.pt2010_upt_pname=function(req,res){
    if (req.cookies["l_st"])
    {
        res.send({msg:'ok'})
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的普通资料
exports.pt2010_upt_normal=function(req,res){
    if (req.cookies["l_st"])
    {
        //console.log(req.body);
        m_portal.Up_ProxyInfo_Normal(req.body.name.split('-')[1],
                                     req.body.value,
                                     req.body.pk,function(dbres){
                if(dbres.affectedRows==1)
                {
                    m_portal.InsertOpsLog(req.connection.remoteAddress,
                                          'ch_abc',
                                          'update_proxy_info_normal',
                                          req.body.pk,
                                          JSON.stringify(req.body),
                        function(xres){
                            acc.SendOnErr(res,t.res_one('SUCC','Update OK!'));
                    });
                } else
                {
                    acc.SendOnErr(res,t.res_one('error',dbres.message));
                }
            });
    } else
    {
        res.redirect('/xlogin')
    }
};


exports.pt2010_upt_level=function(req,res){
    if (req.cookies["l_st"])
    {
        //console.log(req.body);
        m_portal.Up_ProxyInfo_Normal(req.body.name.split('-')[1],
            req.body.value,
            req.body.pk,function(dbres){
                if(dbres.affectedRows==1)
                {
                    m_portal.InsertOpsLog(req.connection.remoteAddress,
                        'ch_abc',
                        'update_proxy_info_level',
                        req.body.pk,
                        JSON.stringify(req.body),
                        function(xres){
                            m_portal.Up_ProxyInfo_Level(req.body.name.split('-')[1],
                                req.body.value,
                                req.body.pk,function(xxres){
                                acc.SendOnErr(res,t.res_one('SUCC','Update OK!'));
                            });
                        });
                } else
                {
                    acc.SendOnErr(res,t.res_one('error',dbres.message));
                }
            });
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的账户
exports.pt2010_upt_accname=function(req,res){
    if (req.cookies["l_st"])
    {
        res.send({msg:'ok'})
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的上级
exports.pt2010_upt_boss=function(req,res){
    if (req.cookies["l_st"])
    {
        console.log(req.body);
        res.send({msg:'ok'})
    } else
    {
        res.redirect('/xlogin')
    }
};

//查询我可以分配哪些上级
exports.pt2010_query_myboss=function(req,res){
    if (req.cookies["l_st"])
    {
        logger.debug(req.body);
        m_portal.Get_MyBossInfo(req.body.m_ulevel,req.body.m_name,function(dbres){
            //console.log(dbres.length);
            logger.debug(JSON.stringify(dbres));
            logger.debug('获取到了上级BOSS信息，开始调整格式至select2');
            acc.ConvToGroup(dbres,'渠道代理等级_',function(group_res){
                acc.SendOnErr(res, t.res_one('SUCC',group_res))
                logger.debug('返回上级BOSS结果');
            });
        });
    } else
    {
        res.redirect('/xlogin')
    }
};


//增加代理商的记录
exports.pt2011=function(req,res){
    if (req.cookies["l_st"])
    {
        logger.debug(req.body);
        //res.send({msg:'22222'});
        res.send({msg:'3333333'})
    } else
    {
        res.redirect('/xlogin')
    }
};
