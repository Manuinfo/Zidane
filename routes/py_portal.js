
var async=require('async');
var moment=require('moment');
var pool=require('../conf/db.js');
var acc=require('../libs/acc.js');
var t=require('../libs/t.js');
var m_portal=require('../dbmodules/m_portal.js');
var m_goods=require('../dbmodules/m_goods.js');

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
        res.cookie("l_st", t.md5hash('fsdf'),{ maxAge: 10*60*1000,domain:"www.131su.com",httpOnly:true,path:"/"});
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
       // m_goods.Get_AllGoods(function(dbres){
            //console.log(dbres);
            res.render('goods_change',{})
       // });
    } else
    {
        res.redirect('/xlogin')
    }
};