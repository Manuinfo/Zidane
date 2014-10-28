/**
 * Created by z30 on 14-10-17.
 */

var http=require('http');
var t=require('./libs/t.js');
var options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/py_w/2002',
    method: 'POST'
};


var xdata={
    "username":"W101LS01333",
    "passwd":"0192023a7bbd73250516f069df18b500111",
    "ip":"2.3.4.5",
    "os":"IOS8.0.1"
};
/*
var xdata={
    'username':'W101LS01222',
    'passwd':'0192023a7bbd73250516f069df18b500111',
    'ip':'2.3.4.5',
    'os':'IOS8.0.1'
};
*/

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
console.log(JSON.stringify(xdata));
req.write(JSON.stringify(xdata));
req.end();