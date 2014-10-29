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
        function(b){return 'select name from g_products where serias=\''+b+'\';'}
};
