/**
 * Created by z30 on 14-10-18.
 */


module.exports={
    'query_prd_all': function(){return 'select date_format(create_at,\'%Y-%m-%d %H:%i\') as create_at ,shop_name,serias,name,product_id,place,price,updated_at from g_products ';},
    'query_prd_byprdname': function(b){return 'select * from g_products where name=\''+b+"'";},
    'query_bth_byprdname': function(b){
        return 'select * from batches where product_id in ('+
               'select product_id from g_products where name=\''+b+"')";
    },
    'query_bth_bybid': function(b){
        //return 'select * from batches where batch_id=\''+b+"'";
        return 'select b.name,a.* from batches a join g_products b '+
               'where a.batch_id=\''+b+"'"+
               'and a.product_id=b.product_id'
    },
    'query_prd_byqrhref':function(b){
        return 'select * from  g_products where product_id in ('+
               'select mid(batch_id,10,32) from qr_batch_map where qr_href=\''+b+"')";
    },
    'query_bth_byqrhref':function(b){
        return 'select * from batches where batch_id in ('+
               'select batch_id from qr_batch_map where qr_href=\''+b+"')";
    },
    'query_shop_byshopname':function(b){
        return 'select * from g_products where shop_name=\''+b+"'";
    },
    'insert_prd_basic': function(p_shopname,p_name,p_pid,p_place,p_price,p_crdate){
        return 'insert into g_products values (\''+p_shopname+"',"+
                                            '\''+p_name+"',"+
                                            '\''+p_pid+"',"+
                                            '\''+p_place+"',"+
                                            p_price+","+
                                            '\''+p_crdate+"',NULL,NULL,NULL,NULL,NULL);";
    },
    'Query_Pid_ByPrdName':function(b){return 'select product_id from g_products where name=\''+b+"'";},
    'Query_Zid_ByZoneName':function(b){return 'select city_code from g_sale_zone where city=\''+b+"'";},
    'Insert_Bth_Basic':function(p_pid,p_pid_part,p_place,p_bth_count,p_nfc_count,p_vrftime,p_bthid,p_crdate,p_rfile,p_nfile,p_raw_count){
        return 'insert into batches values (\''+p_pid+"',"+
                                            '\''+p_pid_part+"',"+
                                            '\''+p_place+"',"+
                                            p_bth_count+","+
                                            p_nfc_count+","+
                                            p_vrftime+","+
                                            '\''+p_bthid+"',"+
                                            '\''+p_crdate+'\',NULL,' +
                                            '\''+p_rfile+'\','+
                                            '\''+p_nfile+'\','+p_raw_count+');'
    },
    'Insert_NFCID':function(p_bid,nfcid){
        return 'insert into g_nfc_batch_map values (\''+p_bid+'\',upper(\''+nfcid+'\'),NULL);'
    },
    'Insert_NFCID_PACKAGE':function(p_nfcid,p_bid,p_flag){
        return 'insert into g_nfc_box_map values (upper(\''+p_nfcid+'\'),'+
            '\''+p_bid+'\','+
            '\'0000-00-00 00:00:00\',\''+p_flag+'\');'
    },
    'Insert_QRHrefID':function(p_bid,p_url,p_cc,p_av_times){
        return 'call proc_gen_qr_href(\''+p_bid+'\',\''+p_url+'\','+p_cc+','+p_av_times+');' ;
    },
    'Query_ByQRhref':function(p_qrcode){
        return 'select * from qr_batch_map where qr_href=\''+p_qrcode+"'";
    },
    'Update_QRAVtimes':function(p_qrcode){
        return 'update qr_batch_map set verify_av_times=verify_av_times-1 where qr_href=\''+p_qrcode+"'";
    },
    'Insert_Log_Basic':function(p_cip,p_cua,p_qtype,p_qcode,p_nfc,p_vtime,p_result){
        return 'insert into ops_history values ('+
                            '\''+p_cip+"',"+
                            '\''+p_cua+"',"+
                            '\''+p_qtype+"',"+
                            '\''+p_qcode+"',"+
                            '\''+p_nfc+"',"+
                            '\''+p_vtime+"',"+
                            '\''+p_result+"')";
    },
    'Insert_Random_Code':function(p_qrcode,p_rdcode,p_gtime){
        return 'insert into veri_randcode values ('+
            '\''+p_qrcode+"',"+
            '\''+p_rdcode+"',"+
            '\''+p_gtime+"')";
    },
    'Query_Random_Code':function(p_rdcode,p_vrtime){
        return 'select qrcode,rdcode,date_format(gen_time,\'%Y%m%d%H%i%S\') as gen_time  from veri_randcode where rdcode=\''+p_rdcode+"'";
    },
    'Query_VeriHis':function(p_rdcode){
        return 'select * from ops_history where qrcode in (select qrcode from veri_randcode'+
               ' where rdcode=\''+p_rdcode+'\')  order by verify_at desc LIMIT 1';
    },
    'Query_NFCid_byNFCid':function(p_nfcid){
        return 'select * from ( '+
        'select place as prod_place,name,image_file_name as image from g_products where product_id in ( '+
            'select product_id from batches  where batch_id in ( '+
            'select batch_id from g_nfc_batch_map where nfc_id=\''+p_nfcid+'\''+
            ')) ) a, ' +
            '( ' +
            'select dist_place,batch_id as serial from batches  where batch_id in ( '+
            'select batch_id from g_nfc_batch_map where nfc_id=\''+p_nfcid+'\''+
            ') ) b; '
    },
    'Query_Rpt_ByNFCID':function(p_nfcid,p_qtime){
        return 'select * from ( '+
               'select shop_name,name from g_products where product_id in (select substr(batch_id,10,32) '+
               'from g_nfc_batch_map where nfc_id=\''+p_nfcid+'\')'+
               ') a,' +
               '(select * from ops_history where nfc in ( '+
               'select nfc_id from g_nfc_batch_map where nfc_id=\''+p_nfcid+'\' ) ' +
               ' and verify_at > str_to_date(\''+p_qtime+'\',\'%Y%m%d%H%i%S\') ) b, ' +
               '(select batch_id from g_nfc_batch_map where nfc_id=\''+p_nfcid+'\' )  c';
    },
    'get_infoaf_qrcode_succ':function(p_qrhref){
        return 'select * from ( '+
        'select name,place,price,SUBSTRING_INDEX(image_file_name,\'/\',-1) as png from g_products where product_id in ( '+
          '  select product_id from batches  where batch_id in ( '+
           ' select batch_id from qr_batch_map where qr_href=\''+p_qrhref+'\' ' +
           ')) ) a, '+
           ' ( '+
           'select batch_id from batches  where batch_id in ( '+
           ' select batch_id from qr_batch_map where qr_href=\''+p_qrhref+'\'' +
            ') ) b '
    },
    'query_prd_bybid':function(p_bid){
        return 'select shop_name,serias,name from g_products where product_id in ( '+
                'select product_id from batches  where batch_id =\''+p_bid+'\' );';
    }
};

//insert into batches values ('12c8656e2a5d34aba5a23f666ab1d0e4','9','77',30000,30000,5,
// '20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-2','2014-10-14 11:55:00',NULL);
