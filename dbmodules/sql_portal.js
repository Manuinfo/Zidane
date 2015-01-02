/**
 * Created by z30 on 14-12-19.
 * 门户相关的SQL
 */


module.exports = {
    'qs_num_send_ud':  //user design
        function (p_ddtime) {
            return 'select a.send_name,a.recv_name,b.name,count(*) as n_package from ( ' +
                'select send_name,recv_name,par_id,alname,count(*) ' +
                'from py_send_his where dist_time > \'' + p_ddtime + '\'' +
                'and send_name like \'F%\'' +
                'group by send_name,recv_name,par_id,alname ' +
                ') a,b_id_mgnt b where a.alname=b.id  and b.type=\'BRAND\' group by alname '
        },
    'qs_if_box_has_pack':  //user design
        function (p_nfcid) {
            return 'select a.pack_time,a.par_id,a.uname,b.name from py_package_his a,b_id_mgnt b where a.alname=b.id and  ' +
                '(son_id=upper(\'' + p_nfcid + '\') or  par_id=upper(\'' + p_nfcid + '\')) LIMIT 1';
        },
    'qs_if_nfc_exist_inbox':  //user design
        function (p_nfcid) {
            return 'select batch_id from g_nfc_batch_map where nfc_id=upper(\'' + p_nfcid + '\')';
        },
    'qs_if_nfc_exist_inpackage':  //user design
        function (p_nfcid) {
            return 'select * from g_nfc_box_map where  nfc_id=upper(\'' + p_nfcid + '\')';
        },
    'qs_num_pack': function (p_ddtime) {
        return 'select uname,b.name,sum(cc) as n_box,sum(n_pack) as n_package from ( ' +
            'select uname,alname,par_id,count(*) as cc,1 as n_pack ' +
            'from py_package_his a where a.pack_time > \'' + p_ddtime + '\' ' +
            'group by uname,alname,par_id ' +
            ') a ,b_id_mgnt b where a.alname=b.id  and b.type=\'BRAND\' group by uname,alname '
    },
    'qs_batch_task': function () {
        return 'select task_id,task_name,batch_id,task_des,' +
            'DATE_FORMAT(task_start,\'%Y%m%d %H:%i:%s\') as ddtime, ' +
            'round((task_snap/task_des)*100,1) as task_pct from ops_task a ' +
            'where a.task_state=\'RUNNING\'';
    },
    'qs_batch_task_done': function () {
        return 'select task_id,task_name,batch_id,task_des,' +
            'DATE_FORMAT(task_start,\'%Y%m%d %H:%i:%s\') as ddtime, ' +
            'round((task_snap/task_des)*100,1) as task_pct from ops_task a ' +
            'where a.task_state=\'END\' and task_start > adddate(now(),interval -3 day) ' +
            'order by ddtime desc'
    },
    'qs_batch_task_fail': function (p_tid, p_tname) {
        return 'select * from ops_task_fail a where a.task_id=\'' + p_tid + '\' ' +
            'and task_name=\'' + p_tname + '\' ';
    },
    'qs_proxy_info': function () {
        return 'select person_name,name,alname,tbname,ulevel,uzone,state,frstate,s_id, ' +
            'person_id,person_cell,b.up_name,b.up_id from ' +
            'py_user_accounts a  left join py_relatation b on a.name=b.down_name ' +
            'order by person_name LIMIT 20';
    },
    'qs_my_upname': function (p_ulevel, p_name) {
        return 'SELECT ulevel,group_concat(name) as text FROM py_user_accounts ' +
            'where ulevel <= ' + p_ulevel + ' and ulevel >=2 and name!=\'' + p_name + '\' ' +
            'group by ulevel'
    },
    'up_proxy_info_normal': function (p_obj_fd,p_obj_val,p_pk) {
        return 'update py_user_accounts set '+p_obj_fd+'=\''+p_obj_val+'\' where name=\''+p_pk+'\';';
    },
    'up_proxy_info_level_1': function (p_id,p_name) {
        return 'update py_relatation set down_id='+p_id+',utime=now() where down_name=\''+p_name+'\';';
    },
    'up_proxy_info_level_2': function (p_id,p_name) {
        return 'update py_relatation set up_id='+p_id+',utime=now() where up_name=\''+p_name+'\';';
    },
    'up_proxy_info_myboss_1': function (p_downame,p_upname,p_upid) {
        return 'update py_relatation set up_id='+p_upid+',' +
            'up_name=\''+p_upname+'\' ,' +
            'utime=now() ' +
            'where down_name=\''+p_downame+'\';';
    }
};