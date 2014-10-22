var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var rest_r = require('./routes/r.js');
var rest_w = require('./routes/w.js');

var app = express();

//app.use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/r/2001/:prdname', rest_r.r2001);
app.get('/r/2002/:prdname', rest_r.r2002);
app.get('/r/2003/:bid', rest_r.r2003);
app.get('/r/2004/:qr', rest_r.r2004);
app.get('/r/2005/:qr', rest_r.r2005);
app.get('/r/2006/:shopname', rest_r.r2006);
app.get('/r/2007/:prdname', rest_r.r2007);
app.get('/r/2008/:qrcode', rest_r.r2008);
app.get('/r/2009/:rdcode',rest_r.r2009);


app.get('/w/2001/:shopname/:prdname/:place/:price', rest_w.w2001);
app.get('/w/2002/:prdname/:place/:bcount/:nfccount/:vrftime', rest_w.w2002);
app.get('/w/2003/:bid/:nfcid', rest_w.w2003);
app.get('/w/2004/:bid/:qrcount/:qravtimes', rest_w.w2004);
app.get('/w/2005/:qrhref/:cip/:cua', rest_w.w2005);
app.get('/w/2006/:qrhref', rest_w.w2006);
app.get('/w/2007/:qrhref/:cip/:cua', rest_w.w2007);







//app.get('/users', users.list);



app.listen(3000,function(){
    console.log('Zidane Web Service is started at 3000');
});
