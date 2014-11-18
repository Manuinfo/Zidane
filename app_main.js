var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var conf=require('./dbmodules/m_goods.js');
var acc=require('./libs/acc.js');
var logger = require('./libs/log').logger;

//var morgan = require('morgan');
//var accessLogStream = fs.createWriteStream(__dirname + '/logs/run.log', {flags: 'a'});
//112.124.117.97

var log = require('./libs/log');


var rest_r = require('./routes/r.js');
var rest_w = require('./routes/w.js');
var rest_pw = require('./routes/py_w.js');
var rest_pr = require('./routes/py_r.js');

var app = express();

/* https://github.com/nomiddlename/log4js-node */
log.use(app);  //放在其他APP前面
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



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

app.get('/w/2001/:shopname/:prdname/:place/:price', rest_w.w2001);
app.get('/w/2002/:prdname/:place/:bcount/:nfccount/:vrftime', rest_w.w2002);
app.get('/w/2003/:bid/:nfcid', rest_w.w2003);
app.get('/w/2004/:bid/:qrcount/:qravtimes', rest_w.w2004);
app.get('/w/2005/:qrhref/:cip/:cua', rest_w.w2005);
app.get('/w/2006/:qrhref', rest_w.w2006);
app.get('/w/2007/:qrhref/:cip/:cua', rest_w.w2007);
app.get('/w/2008/:nfcid/:cip/:cua', rest_w.w2008);

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



//app.post('/py_w/2004',rest_pr.w2004);  //校验装箱商品是否重复
//(?:\.\.(\w+))?$
//(?:\.\.(\w+))
app.get('/:aaaa',function(req, res){
    console.log(req.url);
    var from = req.param('aaaa');
    res.send('commit url : ' + from);
});



logger.debug('Load Initial BaseData 1/5sec');

conf.Get_IDByType('CHANNEL',function(confall){ global.u_CHID=acc.G_JSON({},confall)});
conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL=acc.G_JSON({},confall)});
conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL_R=acc.G_JSON_R({},confall)});
conf.Get_IDByType('BRAND',function(confall){ global.u_BRAND=acc.G_JSON({},confall);});
conf.Get_IDByType('LAY',function(confall){ global.u_LAY=acc.G_JSON({},confall);});
conf.Get_IDByType('LAY',function(confall){ global.u_LAY_R=acc.G_JSON_R({},confall);});
conf.Get_IDByType('PACKLIMIT',function(confall){ global.u_PACKLIMIT=acc.G_JSON({},confall);});
conf.Get_ALLAccts(function(confall){ global.u_ACCTS=acc.G_JSON({},confall);});

//


//var x='一三一素,米亚妮亚';
//console.log(x.split('-'));


setTimeout(function(){
    app.listen(3000,function(){
        console.log('Zidane Web Service is started at 3000,ID:'+process.pid);
        logger.debug('--------------------------------------------------------')
        logger.debug('Zidane Web Service is started at 3000,ID:'+process.pid);
        logger.debug('--------------------------------------------------------')
        //console.log(global.u_SERIAL_R);
        //console.log(global.u_ACCTS);
        //console.log(global.u_SERIAL);
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
    conf.Get_ALLAccts(function(confall){ global.u_ACCTS=acc.G_JSON({},confall);});
},240000);


