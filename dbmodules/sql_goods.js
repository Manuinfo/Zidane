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
    'get_all_accts':
        function(){return 'SELECT name as id ,ulevel as name FROM py_user_accounts  ;'},
    'get_all_acctsname':
        function(){return 'SELECT name as id ,alname FROM py_user_accounts  ;'},
    'get_all_realname':
        function(){return 'SELECT name as id,alname as name FROM py_user_accounts  ;'},
    'get_goods_bySerialID':
        function(b){return 'select name from g_products where serias=\''+b+'\';'},
    'get_goods_byNFCID':
        function(b){return 'select name from g_products a where a.product_id in ('+
            'select b.product_id from batches b where b.batch_id in ('+
            'select c.batch_id from g_nfc_batch_map c where c.nfc_id=upper(\''+b+'\')))'},
    'check_repeat':
        function(b){return 'SELECT son_id FROM py_package_his where son_id=\''+b+'\';'},
    'insert_boxhis':
        function(p_sonid,p_farid,p_packtime,p_uname,p_alname,p_cid)
        {return 'insert into py_package_his values ('+
            '\''+p_sonid+'\','+
            '\''+p_farid+'\','+
            '\''+p_packtime+'\','+
            '\''+p_uname+'\','+
            '\''+p_alname+'\','+
            '\''+p_cid+'\');'
        },
    'query_packexist':
        function(p_nfcid)
        {return 'select * from g_nfc_box_map where nfc_id=upper(\''+p_nfcid+'\')';
        },
    'query_packexistByFactSend':
        function(p_nfcid,p_alname)
        {return 'select * from py_package_his where par_id=upper(\''+p_nfcid+'\') and alname=\''+p_alname+'\'';
        },
    'update_packboxhis':
        function(p_nfcid,p_gname,p_time)
        {return 'update g_nfc_box_map set g_name=\''+p_gname+'\',bind_date=\''+p_time+'\' where nfc_id=\''+p_nfcid+'\''
        },
    'query_packhis':
        function(p_uname,p_stime,p_etime)
        {return 'select pack_time,son_id,alname from py_package_his where uname=\''+p_uname+'\''+
                ' and pack_time >\''+p_stime+'\''+
                ' and pack_time <\''+p_etime+'\';'
        },
    'query_belongme':
        function(p_cvname,p_nfcid,p_dtime)
        {return 'select recv_name from py_send_his where recv_name=\''+p_cvname+'\' and par_id=\''+p_nfcid+'\''+
                ' and dist_time > \''+p_dtime+'\' order by dist_time desc;'
        },
    'insert_sendhis':
        function(p_farid,p_sendtime,p_sendname,p_recvname,p_alname,p_snid,p_cvid)
        {return 'insert into py_send_his values ('+
            '\''+p_farid+'\','+
            '\''+p_sendtime+'\','+
            '\''+p_sendname+'\','+
            '\''+p_recvname+'\','+
            '\''+p_alname+'\','+
            '\''+p_snid+'\','+
            '\''+p_cvid+'\');'
        },
    'query_sendhis':
        function(p_stime,p_etime,p_nfcid)
        {return 'select * from py_send_his where '+
            ' dist_time >\''+p_stime+'\''+
            ' and dist_time <\''+p_etime+'\' and par_id=\''+p_nfcid+'\';'
        },
    'query_sendhisLastOne':
        function(p_stime,p_etime,p_nfcid)
        {return 'select * from py_send_his where '+
            ' dist_time >\''+p_stime+'\''+
            ' and dist_time <\''+p_etime+'\' and par_id=\''+p_nfcid+'\' order by dist_time desc;'
        },
    'check_bigorsmall':
        function(p_nfcid)
        {return 'select nfc_flag from g_nfc_batch_map where nfc_id =\''+p_nfcid+'\';'
        },
        /*
        {return 'select * from py_send_his where send_name=\''+p_uname+'\''+
            ' and dist_time >\''+p_stime+'\''+
            ' and dist_time <\''+p_etime+'\' and par_id=\''+p_nfcid+'\';'
        },
        */
    'query_adminhis':
        function(p_stime,p_etime,p_prdid)
        {return 'SELECT * FROM  ops_history where client_ip=\'root\' and type=\'ADMINCHECK\' and' +
                ' client_ua=\''+p_prdid+'\''+
                ' and  verify_at >\''+p_stime+'\''+
                ' and verify_at < \''+p_etime+'\';'
        }

//SELECT * FROM  ops_history where client_ip='root' and type='ADMINCHECK' and client_ua='' and  verify_at > '' and verify_at < ''
    //insert into py_send_his values('04a9be427236GF','2014-10-01 11:51:00','FACT','1314TP11','A0','1','2');

};
