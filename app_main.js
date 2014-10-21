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


app.get('/w/2001/:shopname/:prdname/:place/:price', rest_w.w2001);




//app.get('/users', users.list);



app.listen(3000,function(){
    console.log('Zidane Web Service is started at 3000');
});
