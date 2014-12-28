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
            ') a,b_id_mgnt b where a.alname=b.id  and b.type=\'BRAND\' group by alname '
        },
    'qs_if_box_has_pack':  //user design
        function(p_nfcid){
            return 'select a.pack_time,a.par_id,a.uname,b.name from py_package_his a,b_id_mgnt b where a.alname=b.id and  ' +
                '(son_id=upper(\''+p_nfcid+'\') or  par_id=upper(\''+p_nfcid+'\')) LIMIT 1';
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
        function(p_ddtime){
            return 'select uname,b.name,sum(cc) as n_box,sum(n_pack) as n_package from ( '+
            'select uname,alname,par_id,count(*) as cc,1 as n_pack '+
            'from py_package_his a where a.pack_time > \''+p_ddtime+'\' '+
            'group by uname,alname,par_id ' +
            ') a ,b_id_mgnt b where a.alname=b.id  and b.type=\'BRAND\' group by uname,alname '
            },
    'qs_batch_task':
        function(){
            return 'select task_id,task_name,batch_id,task_des,' +
                'DATE_FORMAT(task_start,\'%Y%m%d %H:%i:%s\') as ddtime, '+
                'round((task_snap/task_des)*100,1) as task_pct from ops_task a ' +
                'where a.task_state=\'RUNNING\'';
        },
    'qs_batch_task_done':
        function(){
            return 'select task_id,task_name,batch_id,task_des,' +
                'DATE_FORMAT(task_start,\'%Y%m%d %H:%i:%s\') as ddtime, '+
                'round((task_snap/task_des)*100,1) as task_pct from ops_task a ' +
                'where a.task_state=\'END\' and task_start > adddate(now(),interval -3 day) ' +
                'order by ddtime desc'
        }
}