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
app.post('/py_w/2001', rest_pw.w2001);
app.post('/py_w/2002', rest_pw.w2002);
app.post('/py_w/2003', rest_pw.w2003);


app.get('/py_r/2001/:cmd', rest_pr.r2001);
app.get('/py_r/2002/:sid', rest_pr.r2002);
app.post('/py_r/2003', rest_pr.r2003);  //校验装箱商品是否准确以及重复




//

logger.debug('Load Initial BaseData');
conf.Get_IDByType('CHANNEL',function(confall){ global.u_CHID=acc.G_JSON({},confall)});
conf.Get_IDByType('SERIAL',function(confall){ global.u_SERIAL=acc.G_JSON({},confall)});
conf.Get_IDByType('BRAND',function(confall){ global.u_BRAND=acc.G_JSON({},confall);});
conf.Get_IDByType('LAY',function(confall){ global.u_LAY=acc.G_JSON({},confall);});

var x='一三一素,米亚妮亚';
console.log(x.split('-'));


setTimeout(function(){
    app.listen(3000,function(){
        console.log('Zidane Web Service is started at 3000');
        logger.debug('Zidane Web Service is started at 3000');
        //console.log(global.u_CHID);
    });
},500);


