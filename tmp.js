/**
 * Created by z30 on 14-10-17.
 */

var http=require('http');
var t=require('./libs/t.js');
var options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/py_w/2001',
    method: 'POST'
};

var xdata={
    'username':'W101LS01',
    'passwd':'0192023a7bbd73250516f069df18b500'
};

var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(JSON.stringify(xdata));
req.end();