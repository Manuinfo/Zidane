/**
 * Created by z30 on 14-10-18.
 */


module.exports.query_prd={
    'selectSQL': function(b){return 'select * from products where name=\''+b+"'";}
};

module.exports.query_bth_byprdname={
    'selectSQL': function(b){
        return 'select * from batches where product_id in ('+
               'select product_id from products where name=\''+b+"')";
    }
};

module.exports.query_bth_bybid={
    'selectSQL': function(b){return 'select * from batches where batch_id=\''+b+"'";}
};

module.exports.query_prd_byqrhref={
    'selectSQL': function(b){
        return 'select * from  products where product_id in ('+
               'select mid(batch_id,10,32) from qr_batch_map where qr_href=\''+b+"')";
    }
};

module.exports.query_bth_byqrhref={
    'selectSQL': function(b){
        return 'select * from batches where batch_id in ('+
               'select batch_id from qr_batch_map where qr_href=\''+b+"')";
    }
};
