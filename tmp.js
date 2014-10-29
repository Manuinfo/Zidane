

var m=require('./dbmodules/m_goods.js');

x='一三一素,米亚妮亚';

m.Get_NameByNFCID('04a9bc42723680',function(xx){
    console.log(xx);
});