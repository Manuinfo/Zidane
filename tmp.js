
var t=require('./libs/t.js');
var m=require('./dbmodules/m_goods.js');

aa={'aaa':'ssss'};

console.log(aa);
console.log(JSON.stringify(aa));

console.log(t.md5hash('admin1234'));
//admin123   0192023a7bbd73250516f069df18b500
//admin1234  c93ccd78b2076528346216b3b2f701e6
/*
x='一三一素,米亚妮亚';
xh=[
    '04a9be42723601',
    '04a9be42723602',
    '04a9be42723603',
    '04a9be42723604',
    '04a9be42723605',
    '04a9be42723606',
    '04a9be42723607',
    '04a9be42723608',
    '04a9be42723609',
    '04a9be42723610',
    '04a9be42723611',
    '04a9be42723612',
    '04a9be42723613',
    '04a9be42723614',
    '04a9be42723615',
    '04a9be42723616',
    '04a9be42723617',
    '04a9be42723618',
    '04a9be42723619'];

y='04a9be42723644';
z=xh.push(y);
//console.log(xh);
console.log(xh);

var a = ['04a9be42723619'];// 创建数组
y='04a9be42723619';
a.push(1);
a.push(y);
console.log(a);

var moment=require('moment');
var now=moment();

console.log(now);
console.log(now.format('YYYY-MM-DD HH:mm:ss'));


  //   04a9be42723619
//   04a9be42723619
 //    04a9ba42723619
/*
m.Get_NameByNFCID('04a9be42723619',function(xx){
   // console.log(xx);
});
*/

sss='\u4e2d\u56fd'
sss='\u4e0a\u6d77\u5e02'
//console.log(unescape(sss.replace(/\\u/gi, '%u')));



