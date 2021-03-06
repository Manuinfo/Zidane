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
        function(){return 'SELECT name,alname,ulevel,uzone,person_id,person_name,s_id FROM py_user_accounts  ;'},
    'get_goods_bySerialID':
        function(b){return 'select name from g_products where serias=\''+b+'\';'},
    'get_serials_byName':
        function(b){return 'select serias from g_products where name=\''+b+'\';'},
    'get_goods_byNFCID':
        function(b){return 'select name from g_products a where a.product_id in ('+
            'select b.product_id from batches b where b.batch_id in ('+
            'select c.batch_id from g_nfc_batch_map c where c.nfc_id=upper(\''+b+'\')))'},
    'check_repeat':
        function(b){return 'SELECT upper(son_id) FROM py_package_his where son_id=\''+b+'\';'},
    'insert_boxhis':
        function(p_sonid,p_farid,p_packtime,p_uname,p_alname,p_cid)
        {return 'insert into py_package_his values ('+
            'upper(\''+p_sonid+'\'),'+
            'upper(\''+p_farid+'\'),'+
            '\''+p_packtime+'\','+
            'upper(\''+p_uname+'\'),'+
            '\''+p_alname+'\','+
            '\''+p_cid+'\');'
        },
    'query_packexist':
        function(p_nfcid)
        {return 'select * from g_nfc_box_map where nfc_id=upper(\''+p_nfcid+'\')';
        },
    'query_ifboxpack':
        function(p_nfcid)
        {return 'select * from py_package_his where par_id=upper(\''+p_nfcid+'\')';
        },
    'query_packexistByFactSend':
        function(p_nfcid,p_alname)
        {return 'select * from py_package_his where par_id=upper(\''+p_nfcid+'\') and alname=\''+p_alname+'\'';
        },
    'update_packboxhis':
        function(p_nfcid,p_gname,p_time)
        {return 'update g_nfc_box_map set g_name=\''+p_gname+'\',bind_date=\''+p_time+'\' where nfc_id=upper(\''+p_nfcid+'\')'
        },
    'query_packhis':
        //ADDDATE(pack_time,INTERVAL +0 HOUR) as pack_time
        function(p_uname,p_stime,p_etime)
        {return 'select  distinct date_format(ADDDATE(pack_time,INTERVAL +0 HOUR),\'%Y-%m-%d %H:%i:%S\') as pack_time, par_id,uname,alname as prdname from py_package_his where  pack_time > \''+p_stime+'\''+
                ' and pack_time <\''+p_etime+'\' and uname=\''+p_uname+'\' ;'
        },
    'query_packhis_by_pack_id':
    //ADDDATE(bind_date,INTERVAL +0 HOUR) as bind_date
        function(p_nfcid)
        {return 'select nfc_id,g_name,date_format(ADDDATE(bind_date,INTERVAL +0 HOUR),\'%Y-%m-%d %H:%i:%S\') as bind_date from g_nfc_box_map where nfc_id=\''+p_nfcid+'\'';
        },
    'query_belongme':
        function(p_cvname,p_nfcid,p_dtime)
        {return 'select recv_name from py_send_his where recv_name=\''+p_cvname+'\' and par_id=upper(\''+p_nfcid+'\')'+                  //2333333
                ' and dist_time > \''+p_dtime+'\' order by dist_time desc;'
        },
    'query_belongme2':
        function(p_cvname,p_nfcid,p_dtime)
        {return 'select recv_name from py_send_his where send_name=\''+p_cvname+'\' and par_id=upper(\''+p_nfcid+'\')'+                  //2333333
            ' and dist_time > \''+p_dtime+'\' order by dist_time desc;'
        },
    'insert_sendhis':
        function(p_farid,p_sendtime,p_sendname,p_recvname,p_alname,p_snid,p_cvid)
        {return 'insert into py_send_his values ('+
            'upper(\''+p_farid+'\'),'+
            '\''+p_sendtime+'\','+
            'upper(\''+p_sendname+'\'),'+
            'upper(\''+p_recvname+'\'),'+
            '\''+p_alname+'\','+
            '\''+p_snid+'\','+
            '\''+p_cvid+'\');'
        },
    'bak_sendhis_before_trunc':
        function(p_nfcid)
        { return 'insert into py_send_his_copy select * from py_send_his where  par_id=upper(\''+p_nfcid+'\');'
        },
    'trunc_sendhis':
        function(p_nfcid)
        { return 'delete from py_send_his where  par_id=upper(\''+p_nfcid+'\');'   },


    'query_sendhis':
        function(p_stime,p_etime,p_uname)
        {return 'select  par_id,date_format(ADDDATE(dist_time,INTERVAL +0 HOUR),\'%Y-%m-%d %H:%i:%S\') as dist_time,send_name,recv_name,alname,send_lid,recv_lid from py_send_his where '+
            ' dist_time >\''+p_stime+'\''+
            ' and dist_time <\''+p_etime+'\' and send_name=\''+p_uname+'\';'
        },
    'query_sendhis_nfcid':
        function(p_stime,p_etime,p_nfcid)
        {return 'select par_id,date_format(ADDDATE(dist_time,INTERVAL +0 HOUR),\'%Y-%m-%d %H:%i:%S\') as dist_time,send_name,recv_name,alname,send_lid,recv_lid from py_send_his where '+
            ' dist_time >\''+p_stime+'\''+
            ' and dist_time <\''+p_etime+'\' and par_id=\''+p_nfcid+'\';'
        },
    'query_sendhis_common':
        function(p_uname,p_stime,p_etime)
        {return 'select  par_id,date_format(ADDDATE(dist_time,INTERVAL +0 HOUR),\'%Y-%m-%d %H:%i:%S\') as dist_time,send_name,recv_name,alname,send_lid,recv_lid from py_send_his where '+
            ' send_name=\''+p_uname+'\''+
            ' and dist_time >\''+p_stime+'\''+
            ' and dist_time <\''+p_etime+'\' ;'
        },
    'query_sendhisLastOne':
        function(p_etime,p_nfcid)
        {return 'select  par_id,date_format(ADDDATE(dist_time,INTERVAL +0 HOUR),\'%Y-%m-%d %H:%i:%S\') as dist_time,send_name,recv_name,alname,send_lid,recv_lid from py_send_his where '+
            ' dist_time > ADDDATE(now(),INTERVAL -90 DAY) '+
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
        function(p_stime,p_etime)
        {return 'SELECT * FROM  ops_history where type=\'ADMINCHECK\' ' +
                ' and  verify_at >\''+p_stime+'\''+
                ' and verify_at < \''+p_etime+'\';'
        }

//SELECT * FROM  ops_history where client_ip='root' and type='ADMINCHECK' and client_ua='' and  verify_at > '' and verify_at < ''
    //insert into py_send_his values('04a9be427236GF','2014-10-01 11:51:00','FACT','1314TP11','A0','1','2');

};
