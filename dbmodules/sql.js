/**
 * Created by z30 on 14-10-18.
 */


module.exports={
    'query_prd_byprdname':    function(b){return 'select * from products where name=\''+b+"'";},
    'query_bth_byprdname': function(b){
        return 'select * from batches where product_id in ('+
            'select product_id from products where name=\''+b+"')";
    },
    'query_bth_bybid': function(b){return 'select * from batches where batch_id=\''+b+"'";},
    'query_prd_byqrhref':function(b){
        return 'select * from  products where product_id in ('+
            'select mid(batch_id,10,32) from qr_batch_map where qr_href=\''+b+"')";
    },
    'query_bth_byqrhref':function(b){
        return 'select * from batches where batch_id in ('+
            'select batch_id from qr_batch_map where qr_href=\''+b+"')";
    },
    'query_shop_byshopname':function(b){
        return 'select * from products where shop_name=\''+b+"'";
    },
    'insert_prd_basic': function(p_shopname,p_name,p_pid,p_place,p_price,p_crdate){
        return 'insert into products values (\''+p_shopname+"',"+
            '\''+p_name+"',"+
            '\''+p_pid+"',"+
            '\''+p_place+"',"+
            p_price+","+
            '\''+p_crdate+"',NULL,NULL,NULL,NULL,NULL)";
    }
};
