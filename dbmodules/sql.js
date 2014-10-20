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

module.exports.query_shop={
    'selectSQL': function(b){
        return 'select * from busishop where name=\''+b+"'";
    }
};

module.exports.insest_prd={
    'selectSQL': function(p_name){return 'select count(*) as cc from products where name=\''+p_name+"'";},
    'insertSQL': function(p_name,p_pid,p_place,p_price,p_crdate){
        return 'insert into products values (\''+p_name+"',"+
                                            '\''+p_pid+"',"+
                                            '\''+p_place+"',"+
                                            p_price+","+
                                            '\''+p_crdate+"',NULL,NULL,NULL,NULL,NULL)";
    }
//insert into products values ('乳酸菌','827f5c0778d48996b9ee750511c33b09','台湾',79.5,
// '2014-11-23 00:00:00',NULL,NULL,NULL,NULL,NULL);
};