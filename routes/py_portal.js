
var async=require('async');
var moment=require('moment');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var m_portal=require('../dbmodules/m_portal.js');
var m_goods=require('../dbmodules/m_goods.js');
var m_login=require('../dbmodules/m_login.js');

var fs = require('fs');
var os=require('os');

var logger = require('../libs/log').logger;


//主管理界面
exports.pt2001=function(req,res){
  res.render('home',{});
};

//主登陆界面
exports.pt2002=function(req,res){
    req.session.destroy();
    res.render('xlogin',{rtn_msg:null});
};

//首次登陆后的密码修改页面
exports.pt2002_get_updatepwd=function(req,res){
    if(req.session.r==req.query.r)
    {
        logger.debug('进入首次登陆的密码修改页');
        res.render('xlogin_uppwd',{});
    } else
    {
        logger.debug('非法登陆密码修改页面,踢出到登陆页')
        req.session.destroy();
        res.redirect('/xlogin');
    }
};

//首次登陆后的密码修改服务
exports.pt2002_post_updatepwd=function(req,res){
    logger.debug(req.body);
    logger.debug(req.url);
    logger.debug('首次登陆后的密码修改服务')
    if(req.session.r==req.query.r)
    {
        m_login.Get_AcctName(req.body.acc_name,function(db_res){
            //console.log(db_res);
            if(db_res.frstate==1)
            {
                m_login.Login_HisAppend(req.body.acc_name,req.headers['x-real-ip'],'非首次登陆不能修改密码，请联系厂商重置密码');
                acc.SendOnErr(res,t.res_one('FAIL','非首次登陆不能修改密码，请联系厂商重置密码'));
            }
            else
            {
                m_login.UpdatePasswdFr(req.body.acc_name,req.body.acc_pwd_2);
                m_login.Login_HisAppend(req.body.acc_name,req.headers['x-real-ip'],'首次密码修改成功，即将进入新的页面');
                req.session.user=req.body.acc_name;
                req.session.login_state='YES';
                req.session.menulevel=db_res.menulevel;
                acc.SendOnErr(res,t.res_one('SUCC','首次密码修改成功，即将进入新的页面'));
            }
        });
    } else
    {
        logger.debug('非法登陆密码修改页面基础服务,踢出到登陆页')
        req.session.destroy();
        res.redirect('/xlogin');
    }

};


//登陆页面的基础POST服务
exports.pt2002_p=function(req,res){

    logger.debug(req.body);
    logger.debug('先判断用户名是否存在?');
    //console.log(jbody);

    m_login.Get_AcctName(req.body.acc_name,function(db_res){
        if(!db_res)   //先判断用户名是否存在？
        {
            logger.debug(req.body.acc_name+'该登陆名不存在，请重新再试');
            m_login.Login_HisAppend(req.body.acc_name,req.headers['x-real-ip'],'该登陆名不存在');
            acc.SendOnErr(res,t.res_one('FAIL','该登陆名不存在，请重新再试'));
        } else if (req.body.acc_name.substr(0,2)!='ch')  //存在后再判断是否可以登陆PORTAL
        {
            logger.debug(req.body.acc_name+'该用户名不允许登陆PORTAL');
            m_login.Login_HisAppend(req.body.acc_name,req.headers['x-real-ip'],'该用户名不允许登陆PORTAL');
            acc.SendOnErr(res,t.res_one('FAIL','该用户名不允许登陆PORTAL'));
        }
        else //再判断密码是否正确
        {
            m_login.Get_PassWord(req.body.acc_name,req.body.acc_pwd,function(db_res){
                if(!db_res)
                {
                    logger.debug(req.body.acc_name+'密码错误');
                    m_login.Login_Fail(req.body.acc_name,
                                       req.body.acc_pwd,
                                       req.headers['x-real-ip'],'密码错误');
                    acc.SendOnErr(res,t.res_one('FAIL','密码错误'));
                } else if (db_res.state=='D')  //再判断账户是否被锁定
                {
                    logger.debug(req.body.acc_name+'账户被锁定');
                    m_login.Login_Fail(req.body.acc_name,req.body.acc_pwd,req.headers['x-real-ip'],'账户被锁定');
                    acc.SendOnErr(res,t.res_one('FAIL','账户被锁定'));
                } else if (db_res.frstate==0)
                {
                    logger.debug(req.body.acc_name+'首次登陆需要修改密码');
                    m_login.Login_Fail(req.body.acc_name,req.body.acc_pwd,req.headers['x-real-ip'],'首次登陆需要修改密码');
                    x_rand=t.get_random(10);
                    req.session.r=x_rand;
                    res.send({code:'DOUBT',msg:'首次登陆需要修改密码',r: x_rand});
                } else //登陆成功
                {
                    logger.debug(req.body.acc_name+'登陆成功');
                    m_login.Login_Succ(req.body.acc_name,req.body.acc_pwd,req.headers['x-real-ip']);
                    m_login.Get_AcctName(req.body.acc_name,function(dbres2){
                        //console.log(dbres2)
                        req.session.user=req.body.acc_name;
                        req.session.login_state='YES';
                        req.session.menulevel=dbres2.menulevel;
                        acc.SendOnErr(res,t.res_one('SUCC',dbres2));
                    });
                }
            })
        }
    })
    /*
    if (req.body.acc_name=="ch_abc")
    {
        res.cookie("l_st", t.md5hash('fsdf'),{ maxAge: 30*60*1000,domain:"www.131su.com",httpOnly:true,path:"/"});
        res.redirect('/xadmin')
    }
    else
    { res.redirect('/xlogin')}
    */

};

//查询当日装箱和发货
exports.pt2003=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
    {
        //console.log(req.body.nfc_id)
        logger.debug('需要查询的ID为：'+req.body.nfc_id)
        m_portal.Get_NFC_legal(req.body.nfc_id,function(dbres){
            console.log(dbres);
            logger.debug('需要查询的ID的结果为：'+dbres)
            res.send(dbres)
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//查询单个NFC_ID是否有效
exports.pt2004=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
    {
          res.render('goods_change',{})
    } else
    {
        res.redirect('/xlogin')
    }
};

//变更商品，添加、删除-POST
exports.pt2005_p=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
    {
        console.log(req.body);
        console.log(req.headers);

        //console.log(req.files);
        console.log(req.files.houseMaps.originalFilename);
        console.log(req.files.houseMaps.ws.path);
        var fname='';
        os.type()=='Windows_NT'?fname='./public/admin/uploads/'+req.files.houseMaps.ws.path.split('\\')[6]:fname=req.files.houseMaps.ws.path;
        logger.debug('获得文件名为:'+req.files.houseMaps.originalFilename);
        logger.debug('落地的路径为:'+req.files.houseMaps.ws.path);
        logger.debug('导入文件名为:'+fname);
        /*
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
        });*/
    } else
    {
        res.redirect('/xlogin')
    }
};




//批次NFC_ID箱子上传的页面GET
exports.pt2007=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        m_goods.Get_AllGoods(function(dbres){
            // console.log(dbres);
            res.render('batch_upload_package',{res_goods:dbres})
        });
    } else
    {
        res.redirect('/xlogin')
    }
};

//处理批次NFC_ID的POST请求 箱子
exports.pt2007_p=function(req,res){
    res.setTimeout(300*1000);
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
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
   // console.log(req.session)
    if (req.session.user && req.session.login_state=='YES')
    {
        logger.debug('检验登陆状态OK，继续检验菜单权限'+req.session.menulevel)
        if( req.session.menulevel>4)
        {
            logger.debug(req.body);
            m_portal.Get_ProxyInfo(function(dbres){
                logger.debug('资料读取完毕')
                // logger.debug(dbres);
                res.render('proxy_info',{n_res:dbres});
            });
        } else
        {
            res.redirect('/xadmin')
        }
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的姓名
exports.pt2010_upt_pname=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        res.send({msg:'ok'})
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的普通资料
exports.pt2010_upt_normal=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        logger.debug(req.body);
        m_portal.Up_ProxyInfo_Normal(req.body.name.split('-')[1],
                                     req.body.value,
                                     req.body.pk,function(dbres){
                if(dbres.affectedRows==1)
                {
                    m_portal.InsertOpsLog(req.connection.remoteAddress,
                                          'ch_abc',
                                          'update_proxy_info_normal',
                                          req.body.pk,
                                          req.body.old_value,
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

//更新代理商的纯粹的等级，但PK和ID不变
exports.pt2010_upt_level=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        logger.debug(req.body);
        m_portal.Up_ProxyInfo_Normal(req.body.name.split('-')[1],
            req.body.value,
            req.body.pk,function(dbres){
                if(dbres.affectedRows==1)
                {
                    m_portal.InsertOpsLog(req.connection.remoteAddress,
                        'ch_abc',
                        'update_proxy_info_level',
                        req.body.pk,
                        req.body.old_value,
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

//更新代理商的账户==授权编号
exports.pt2010_upt_accname=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        //console.log(req.body.pk);
        if(req.body.pk.length==0)
        {
            acc.SendOnErr(res,t.res_one('error','PK 为空不能更新'));
        } else
        {
            logger.debug(req.body);
            m_portal.Up_ProxyInfo_Boss_All(req.body.old_value,req.body.value,req.body.old_id,function(dbres)
            {
            m_portal.Up_ProxyInfo_Boss_Log(req.body.old_value,req.body.value,function(dbres2)
            {
                //console.log(dbres2)
                if(dbres2.code)
                {
                    acc.SendOnErr(res,t.res_one('error',dbres2.message));
                } else
                {
                m_portal.InsertOpsLog(req.connection.remoteAddress,
                    'ch_abc',
                    'update_proxy_info_accname',
                    req.body.pk,
                    req.body.old_value,
                    JSON.stringify(req.body),
                    function(xres){
                        acc.SendOnErr(res,t.res_one('SUCC','Update OK!'));
                    });
                }
            })

        })
        }
    } else
    {
        res.redirect('/xlogin')
    }
};

//更新代理商的指定上级
exports.pt2010_upt_boss=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        logger.debug(req.body);
        m_login.Get_AcctName(req.body.value,function(boss_res){
           logger.debug(req.body.pk+'想获取新的上级'+req.body.value+'的等级是'+boss_res.ulevel);
            logger.debug('准备更新上级信息');
            if(req.body.old_value=='null') //新增
            {
                m_login.Get_AcctName(req.body.pk,function(my_res){
                    logger.debug('准备自己的ID信息');
                    m_portal.Up_ProxyInfo_MyBoss_1(req.body.pk,req.body.value,boss_res.ulevel,my_res.ulevel,function(ops_res){
                        logger.debug('新增成功，记录OPS日志');
                        acc.SendOnErr(res, t.res_one('SUCC','Update OK!'));
                    });
                });
            } else  // 更新
            {
                m_portal.Up_ProxyInfo_MyBoss_2(req.body.pk,req.body.value,boss_res.ulevel,function(ops_res){
                    logger.debug('更新成功，记录OPS日志');
                    acc.SendOnErr(res, t.res_one('SUCC','Update OK!'));
                });
            }

        });
    } else
    {
        res.redirect('/xlogin');
    }
};

//查询我可以分配哪些上级
exports.pt2010_query_myboss=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
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
    if (req.session.user && req.session.login_state=='YES')
    {
        logger.debug(req.body);
        m_portal.New_ProxyInfo(req.body.name,
                               req.body.alname,
                               req.body.ulevel,
                               req.body.uzone,
                               req.body.sid,
                               req.body.person_id,
                               req.body.person_name,
                               req.body.person_cell,
                               req.body.tbname,
                               req.body.menulevel,function(dbres){
           if(dbres.code)
           {
               logger.debug('新增记录时出现问题:'+dbres.message)
               acc.SendOnErr(res,t.res_one('error',dbres.message));
           }else
           {
               logger.debug('新增记录时成功，接下来新增我的上级')
               m_login.Get_AcctName(req.body.my_boss,function(my_res){
                   logger.debug('准备好BOSS的ID信息');
                   console.log(my_res);
                   if (!my_res)
                   {
                       logger.debug('由于未设置上级信息，直接更新');
                       m_portal.New_ProxyInfo_Life(req.body.name,function(dbres2){
                           m_portal.InsertOpsLog(req.connection.remoteAddress,
                               'ch_abc',
                               'add_proxy_info_newacc',
                               req.body.name,
                               '新增记录',
                               '新增记录',
                               function(dbres3){
                                   acc.SendOnErr(res,t.res_one('SUCC','新增记录成功'));
                               });
                       });
                   } else
                   {
                       logger.debug('上级信息已查询到，进行更新');
                       m_portal.Up_ProxyInfo_MyBoss_1(req.body.name,req.body.my_boss,my_res.ulevel,req.body.ulevel,
                           function(ops_res){
                               logger.debug('新增成功，记录OPS日志');
                               m_portal.New_ProxyInfo_Life(req.body.name,function(dbres2){
                                   m_portal.InsertOpsLog(req.connection.remoteAddress,
                                       'ch_abc',
                                       'add_proxy_info_newacc',
                                       req.body.name,
                                       '新增记录',
                                       '新增记录',
                                       function(dbres3){
                                           acc.SendOnErr(res,t.res_one('SUCC','新增记录成功'));
                                       });
                               });
                           });
                   }
                   //p_downame,p_upname,p_upid,p_downid,callback
               });
           }
           });
    }
    else
    {
        res.redirect('/xlogin')
    }
};

//QR URL 随机生成的页面
exports.pt2012=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        m_goods.Get_AllGoods(function(dbres){
            //console.log(dbres);
            m_portal.Query_QRTask(3,function(dbres2){
                res.render('batch_qrmake',
                    {res_goods:dbres,n_res:dbres2})
            });
        });
    } else
    {
        res.redirect('/xlogin')
    }
}

//QR URL 随机生成的页面
exports.pt2012_p_submit=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        console.log(req.body)
        m_goods.Get_SerialByName(req.body.name,function(dbres){
          //  console.log(global.u_SITE[dbres[0].serias]);
            m_portal.New_QRCC(req.body.name,
                global.u_SITE[dbres[0].serias],
                req.body.cc,
                req.body.ccv,function(dbres2){
                   // console.log(dbres2);
                    acc.SendOnErr(res,t.res_one('SUCC',dbres2));
                })
        });
    } else
    {
        res.redirect('/xlogin')
    }
}


//QR URL 导出二维码
exports.pt2012_p_export=function(req,res){
    if (req.session.user && req.session.login_state=='YES')
    {
        console.log(req.body)
        var fname=req.body.tid+'_'+req.body.ele.replace(/,/g,'_')+'.qr.txt'
        fs.exists('./public/xdownload/'+fname, function (exists) {
            if(exists)
            {
                logger.debug('文件已经存在不需要再导出');
                m_portal.Update_ExpQR(req.body.tid,function(dbres){
                    res.send({filename:'/xdownload/'+fname});
                });
            } else
            {
                m_portal.Export_QR(req.body.tid,function(dbres){
                    logger.debug('导出的文件记录数为'+dbres.length);
                    for(var i=0;i<dbres.length;i++)
                    {
                        // xstring=dbres[i].qr_href+'\n'
                        fs.appendFileSync('./public/xdownload/'+fname,dbres[i].qr_href+'\n');
                    }
                    setTimeout(function(){
                        res.send({filename:'/xdownload/'+fname})
                    },4000);
                });
            }
        });


    } else
    {
        res.redirect('/xlogin')
    }
}