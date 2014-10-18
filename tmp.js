/**
 * Created by z30 on 14-10-17.
 */

var t=require('./libs/t.js');


console.log(t.md5hash('牛樟菇'));

console.log(t.get_pid_f_bid('20141014-827f5c0778d48996b9ee750511c33b09-66-1'));



function as(a){
    return 'select * from products where pid=\''+a+"'";
}

function ab(a){
    return 'select * from products where price='+a;
}

console.log(as('abc'));
console.log(ab(999));

var pool=require('./conf/db.js');
var async=require('async');
var moment=require('moment');
var aaa=require('./dbmodules/sql.js');

console.log(aaa.r2001.selectSQL('我是谁'));

//console.log(pool);

//console.log(pool);

var sqls = {
    'insertSQL': 'select 1 + 1 AS solution',
    'selectSQL': 'select * from products where name=\'牛樟菇\''
};

var sqlsb = {
    'insertSQL': function(a){return 'select 1 + '+a+' AS solution';},
    'selectSQL': function(b){return 'select * from products where name=\''+b+"'";}
};

var sqlsc = {
    'insertSQL': 88,
    'selectSQL': '牛樟1菇'
};
//console.log(sqlsc.insertSQL);

var tasks = ['insertSQL','selectSQL'];

pool.getConnection(function(err, conn) {
    async.mapSeries(tasks, function (item, callback) {
        conn.query(sqlsb[item](sqlsc[item]), function (err, sqlres) {
            callback(null, sqlres);
        });
    }, function (err,results) {
        console.log(results);
        conn.release();
    });
});


/*
setTimeout(function(){
    pool.end();
},5000);
 //SELECT 1 + 1 AS solution

 connection.query('select * from products where name=\'牛樟菇\'', function(err, rows) {
 console.log('The solution is: ', rows[0]);
 connection.release();
 });
*/