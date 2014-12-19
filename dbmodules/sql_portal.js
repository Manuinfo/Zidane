/**
 * Created by z30 on 14-12-19.
 * 门户相关的SQL
 */


module.exports={
    'qs_num_send_ud':  //user design
        function(p_ddtime){
            return 'select a.send_name,a.recv_name,b.name,count(*) as n_package from ( '+
                'select send_name,recv_name,par_id,alname,count(*) '+
            'from py_send_his where dist_time > \''+p_ddtime+'\''+
            'and send_name like \'F%\''+
            'group by send_name,recv_name,par_id,alname '+
            ') a,b_id_mgnt b where a.alname=b.id group by alname '
        },
    'qs_if_box_has_pack':  //user design
        function(p_nfcid){
            return 'select * from py_package_his where son_id=upper(\''+p_nfcid+'\')';
        },
    'qs_if_nfc_exist_inbox':  //user design
        function(p_nfcid){
            return 'select batch_id from g_nfc_batch_map where nfc_id=upper(\''+p_nfcid+'\')';
        },
    'qs_if_nfc_exist_inpackage':  //user design
        function(p_nfcid){
            return 'select * from g_nfc_box_map where  nfc_id=upper(\''+p_nfcid+'\')';
        },
    'qs_num_pack':
        function(p_ddtime){return 'select uname,b.name,count(*) as n_box,count(DISTINCT par_id) as n_package' +
            ' from py_package_his a,b_id_mgnt b '+
            'where a.pack_time > \''+p_ddtime+'\''+
            'and a.alname=b.id '+
            'group by uname,alname '
            }
}