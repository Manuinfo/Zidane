/**
 * Created by linly on 14-10-29.
 */

module.exports={
    'get_id_by_name':
        function(b,c){return 'select * from b_id_mgnt where name=\''+b+'\' and type=\''+c+'\';'},
    'get_id_by_type':
        function(c){return 'select * from b_id_mgnt where type=\''+c+'\';'},
    'get_all_base':
        function(){return 'select * from b_id_mgnt;'},
    'get_goods_bySerial':
        function(b){return 'select name from g_products where serias=\''+b+'\';'},
    'get_goods_byNFCID':
        function(b){return 'select name from g_products a where a.product_id in ('+
            'select b.product_id from batches b where b.batch_id in ('+
            'select c.batch_id from g_nfc_batch_map c where c.nfc_id=\''+b+'\'))'}
};
