/**
 * Created by z30 on 14-10-18.
 */


module.exports={
    'query_prd_byprdname': function(b){return 'select * from products where name=\''+b+"'";},
    'query_bth_byprdname': function(b){
        return 'select * from batches where product_id in ('+
               'select product_id from products where name=\''+b+"')";
    },
    'query_bth_bybid': function(b){
        //return 'select * from batches where batch_id=\''+b+"'";
        return 'select b.name,a.* from batches a join products b '+
               'where a.batch_id=\''+b+"'"+
               'and a.product_id=b.product_id'
    },
    'query_prd_byqrhref':function(b){
        return 'select * from  products where product_id in ('+
               'select mid(batch_id,10,32) from qr_batch_map where qr_href=\''+b+"')";
    },
    'query_bth_byqrhref':function(b){
        return 'select * from batches where batch_id in ('+
               'select batch_id from qr_batch_map where qr_href=\''+b+"')";
    },
    'query_shop_byshopname':function(b){
        return 'select * from products where shop_name=\''+b+"'";
    },
    'insert_prd_basic': function(p_shopname,p_name,p_pid,p_place,p_price,p_crdate){
        return 'insert into products values (\''+p_shopname+"',"+
                                            '\''+p_name+"',"+
                                            '\''+p_pid+"',"+
                                            '\''+p_place+"',"+
                                            p_price+","+
                                            '\''+p_crdate+"',NULL,NULL,NULL,NULL,NULL);";
    },
    'Query_Pid_ByPrdName':function(b){return 'select product_id from products where name=\''+b+"'";},
    'Query_Zid_ByZoneName':function(b){return 'select city_code from sale_zone where city=\''+b+"'";},
    'Insert_Bth_Basic':function(p_pid,p_pid_part,p_place,p_bth_count,p_nfc_count,p_vrftime,p_bthid,p_crdate){
        return 'insert into batches values (\''+p_pid+"',"+
                                            '\''+p_pid_part+"',"+
                                            '\''+p_place+"',"+
                                            p_bth_count+","+
                                            p_nfc_count+","+
                                            p_vrftime+","+
                                            '\''+p_bthid+"',"+
                                            '\''+p_crdate+"',NULL);";
    },
    'Insert_NFCID':function(p_bid,nfcid){
        return 'insert into nfc_batch_map values (\''+p_bid+"','"+nfcid+"');";
    },
    'Insert_QRHrefID':function(p_bid,p_qrhfefid,q_av_times){
        return 'insert into qr_batch_map values (\''+p_bid+"','"+p_qrhfefid+"',"+q_av_times+");";
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
    }
};

//insert into batches values ('12c8656e2a5d34aba5a23f666ab1d0e4','9','77',30000,30000,5,
// '20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-2','2014-10-14 11:55:00',NULL);
