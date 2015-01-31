var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var fs = require('fs');
var conf=require('./dbmodules/m_goods.js');
var acc=require('./libs/acc.js');
var logger = require('./libs/log').logger;
var logger_core = require('morgan');
var cluster = require('cluster');
var SessionStore = require('express-mysql-session');

var options = {
    host: 'minfo2014.mysql.rds.aliyuncs.com',
    port: 3306,
    user: 'minfo',
    password: '6yhn7ujm',
    database: 'minfo'
};

var sessionStore = new SessionStore(options);


//var morgan = require('morgan');
//var accessLogStream = fs.createWriteStream(__dirname + '/logs/run.log', {flags: 'a'});
//112.124.117.97

if (cluster.isMaster) {
    // Fork workers
    for (var i = 0; i < 4; i++) {
        cluster.fork();
    }

    logger.debug('Main Cluster PID:'+process.pid);

    cluster.on('exit', function(worker, code, signal) {
        logger.debug('Worker-'+worker.id+' PID['+worker.process.pid+'] died by '+signal+';'+code+'.Rstarting...');
        cluster.fork();
    });
    cluster.on('online', function(worker) {
        logger.debug('Worker-'+worker.id+' PID['+worker.process.pid+'] ready to response Master');
    });
} else
{

var log = require('./libs/log');

var rest_r = require('./routes/r.js');
var rest_w = require('./routes/w.js');
var rest_pw = require('./routes/py_w.js');
var rest_pr = require('./routes/py_r.js');
var rest_pt = require('./routes/py_portal.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* https://github.com/nomiddlename/log4js-node */
app.use(favicon(__dirname + '/public/admin/favicon.ico'));
log.use(app);  //放在其他APP前面
app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, 'public/admin/uploads') }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());


    //app.use(express.cookieSession({ secret: 'ch!', cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(session({
   key: 'session_zidane',
   secret: 'session_goldenking',
   store: sessionStore,
   cookie:{maxAge:30*60*1000},
   resave:true,
   saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public'),{
    maxAge:'1d',
    setHeaders: function (res, path) {
        res.set('X-Powered-By', 'X-Man');
        res.set('x-timestamp', Date.now());
    }
}));
app.use(logger_core('dev'));  //打印CONSOLE的日志

//session 自定义处理的中间件 校验真实
app.use(function(req, res, next){
        res.setHeader('X-Powered-By', 'X-Man');
        logger.debug(req.headers);
        if(req.url[1]=='x')  //说明是访问Portal，进行session校验
        {
            if(!req.session)   //非法session
                res.redirect('/xadmin');
             next();
        } else
        {
            next();
        }
});





//Portal管理
//== 登陆
app.get('/xadmin',rest_pt.pt2001);   //管理页
app.get('/xlogin',rest_pt.pt2002);   //登陆页
app.post('/xlsfjl34lsdflsllewrojlwej',rest_pt.pt2002_p);  //登陆的基础POST服务
app.post('/xmls39sjfll2nz40cmnfl3sk3',rest_pt.pt2002_post_updatepwd);  //登陆的基础POST服务
app.get(/^\/xlogin_uppwd/,rest_pt.pt2002_get_updatepwd);   //修改密码
//== 商品
app.get('/xadmin/goods_query',rest_pt.pt2004);
app.get('/xadmin/goods_change',rest_pt.pt2005);
app.post('/xadmin/goods_change',rest_pt.pt2005_p);
//== 上传
app.get('/xadmin/batch_upload',rest_pt.pt2006);
app.post('/xadmin/batch_upload',rest_pt.pt2006_p);
app.get('/xadmin/batch_upload_package',rest_pt.pt2007);
app.post('/xadmin/batch_upload_package',rest_pt.pt2007_p);
app.get('/xadmin/batch_mgnt',rest_pt.pt2008);
app.post('/xadmin/batch_mgnt',rest_pt.pt2008_p);
app.get('/xadmin/batch_task',rest_pt.pt2009);
app.post('/xadmin/batch_task',rest_pt.pt2009_p);
app.get('/xadmin/batch_qrmake',rest_pt.pt2012);
app.post('/xadmin/batch_qrmake',rest_pt.pt2012_p_submit);
app.post('/xadmin/batch_qrmake_exp',rest_pt.pt2012_p_export);

//== 发货
app.get('/xadmin/pack_send',rest_pt.pt2003);
app.post('/xadmin/pack_send_1',rest_pt.pt2003_p_1);
app.post('/xadmin/pack_send_2',rest_pt.pt2003_p_2);
//== 代理商
app.get('/xadmin/proxy_info',rest_pt.pt2010);
app.post('/xadmin/proxy_upt_pk',rest_pt.pt2010_upt_accname);
app.post('/xadmin/proxy_upt_nml',rest_pt.pt2010_upt_normal);
app.post('/xadmin/proxy_upt_level',rest_pt.pt2010_upt_level);
app.post('/xadmin/proxy_upt_boss',rest_pt.pt2010_upt_boss);
app.post('/xadmin/proxy_qs_myboss',rest_pt.pt2010_query_myboss);
app.post('/xadmin/proxy_info_add',rest_pt.pt2011);



//防伪管理
        app.get('/r/2001/:prdname', rest_r.r2001);
        app.get('/r/2002/:prdname', rest_r.r2002);
        app.get('/r/2003/:bid', rest_r.r2003);
        app.get('/r/2004/:qr', rest_r.r2004);
        app.get('/r/2005/:qr', rest_r.r2005);
        app.get('/r/2006/:shopname', rest_r.r2006);
        app.get('/r/2007/:prdname', rest_r.r2007);
        app.get('/r/2008/:qrcode', rest_r.r2008);
        app.get('/r/2009/:rdcode',rest_r.r2009);
        app.get('/r/2010/:nfcid/:qtime',rest_r.r2010);
        app.get('/r/2011',rest_r.r2011);    //获取所有商品的信息

        app.get('/w/2001/:shopname/:prdname/:place/:price', rest_w.w2001);
        app.get('/w/2002/:prdname/:place/:bcount/:nfccount/:vrftime', rest_w.w2002);
        app.get('/w/2003/:bid/:nfcid', rest_w.w2003);
        app.get('/w/2004/:bid/:qrcount/:qravtimes', rest_w.w2004);
        app.get('/wqr/2005/:qrhref', rest_w.w2005);  //面向用户的二维码验证
        app.get('/contactus',function(req,res){res.render('contactus',{});});
        app.get('/w/2006/:qrhref', rest_w.w2006);
        app.get('/w/2007/:qrhref/:cip/:cua', rest_w.w2007);
        app.get('/w/2008/:nfcid', rest_w.w2008);  //面向商户 盒子的NFC验证，盒子存不存在

//代理商管理
        app.post('/py_w/2001', rest_pw.w2001); //登陆验证
        app.post('/py_w/2002', rest_pw.w2002); //密码重置
        app.post('/py_w/2003', rest_pw.w2003); //首次登陆时的密码修改
        app.post('/py_w/2004', rest_pw.w2004); //录入新资料


        app.get('/py_r/2001/:cmd', rest_pr.r2001);
        app.get('/py_r/2002/:sid', rest_pr.r2002);  //根据系列取商品列表
        app.post('/py_r/2003', rest_pr.r2003);  //校验装箱商品是否准确
        app.post('/py_r/2004', rest_pr.r2004);  //查询装箱历史
        app.post('/py_r/2005', rest_pr.r2005);  //查询哪些下家，返回的下家的ID
        app.post('/py_r/2006', rest_pr.r2006);  //查询哪些上家
        app.post('/py_r/2007', rest_pr.r2007);  //查询这批货是否属于我，验货
        app.post('/py_r/2008', rest_pr.r2008);  //发货，当然之前还要验货
        app.post('/py_r/2009', rest_pr.r2009);  //查询发货历史，查询条件是开始时间、结束时间、发货人账号
        app.post('/py_r/2010', rest_pr.r2010);  //查询ADMIN之前查过的历史
        app.post('/py_r/2011', rest_pr.r2011);  //查询发货员下面的省级代理
        app.post('/py_r/2012', rest_pr.r2012);  //查询发货员下面的一级代理
        app.post('/py_r/2013', rest_pr.r2013);  //查询根据LEVELID和UPNAME查下家
        app.post('/py_r/2014', rest_pr.r2014);  //查询发货历史，某箱货物最近一次收发记录
        app.post('/py_r/2015', rest_pr.r2015);  //查询一个账号下所有子账号
        app.post('/py_r/2016', rest_pr.r2016);  //查询发货历史，根据起止时间
        app.post('/py_r/2017', rest_pr.r2017);  //查询装箱历史，根据箱子ID
        app.post('/py_r/2018', rest_pr.r2018);  //查询发货历史，根据起止时间+NFCID+所有记录
        app.get('/py_r/2019', rest_pr.r2019);  //查询APP最新版本号码






        logger.debug('Load Initial BaseData 1/5sec');

        conf.Get_IDByType('CHANNEL',function(confall){ global.u_CHID=acc.G_JSON({},confall)});
        conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL=acc.G_JSON({},confall)});
        conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL_R=acc.G_JSON_R({},confall)});
        conf.Get_IDByType('BRAND',function(confall){ global.u_BRAND=acc.G_JSON({},confall);});
        conf.Get_IDByType('BRAND',function(confall){ global.u_BRAND_R=acc.G_JSON_R({},confall);});
        conf.Get_IDByType('LAY',function(confall){ global.u_LAY=acc.G_JSON({},confall);});
        conf.Get_IDByType('LAY',function(confall){ global.u_LAY_R=acc.G_JSON_R({},confall);});
        conf.Get_IDByType('PACKLIMIT',function(confall){ global.u_PACKLIMIT=acc.G_JSON({},confall);});
        conf.Get_IDByType('SITE',function(confall){ global.u_SITE=acc.G_JSON({},confall);});
        conf.Get_ALLAccts(function(confall){ global.u_ACCTS=acc.G_JSON({},confall);});

//


//var x='一三一素,米亚妮亚';
//console.log(x.split('-'));


setTimeout(function(){
            app.listen(3000,function(){        //console.log(global.u_SITE);

                console.log('Zidane Web Service is started at 3000,ID:'+process.pid);
                logger.debug('--------------------------------------------------------')
                logger.debug('Zidane Web Service is started at 3000,ID:'+process.pid);
                logger.debug('--------------------------------------------------------')
           //     console.log(global.u_SERIAL_R);
               // console.log(global.u_BRAND_R);
               // console.log(global.u_SITE);
                //console.log(global.u_LAY_R);
            });
},1500);


setInterval(function(){
    logger.debug('Load Initial BaseData 1/5sec');
    conf.Get_IDByType('CHANNEL',function(confall){ global.u_CHID=acc.G_JSON({},confall)});
    conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL=acc.G_JSON({},confall)});
    conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL_R=acc.G_JSON_R({},confall)});
    conf.Get_IDByType('BRAND',function(confall){ global.u_BRAND=acc.G_JSON({},confall);});
    conf.Get_IDByType('LAY',function(confall){ global.u_LAY=acc.G_JSON({},confall);});
    conf.Get_IDByType('LAY',function(confall){ global.u_LAY_R=acc.G_JSON_R({},confall);});
    conf.Get_IDByType('PACKLIMIT',function(confall){ global.u_PACKLIMIT=acc.G_JSON({},confall);});
    conf.Get_IDByType('SITE',function(confall){ global.u_SITE=acc.G_JSON({},confall);});
    conf.Get_ALLAccts(function(confall){ global.u_ACCTS=acc.G_JSON({},confall);});
},240000);
}