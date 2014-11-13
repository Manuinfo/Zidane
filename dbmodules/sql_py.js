/**
 * Created by z30 on 14-10-18.
 * ===========
 * 处理代理商登陆
 */


module.exports={
    'check_acc_exist':
        function(b){return 'select * from py_user_accounts where name=\''+b+'\'';},
    'check_acc_pass':
        function(p_name,p_pass){
            return 'select * from py_user_accounts where name=\''+p_name+'\' and passwd=\''+p_pass+'\'';
        },
    'update_acclogintime':
        function(p_time,p_name){ return 'update py_user_accounts set logintime=\''+p_time+'\',loginerr=0 where name=\''+p_name+'\'' ;},                                                                    //11111
    'update_acclogintime_err':
        function(p_time,p_name){ return 'update py_user_accounts set logintime=\''+p_time+'\',loginerr=loginerr+1 where name=\''+p_name+'\'' ;},
    'insert_accloginhis':
        function(p_name,p_logintime,p_loginip,p_loginres,p_reason){
            return 'insert into py_user_login_his values ('+
                    '\''+p_name+'\','+
                    '\''+p_logintime+'\','+
                    '\''+p_loginip+'\','+
                    '\''+p_loginres+'\','+
                    '\''+p_reason+'\''+
                    ');'},
    'reset_passwd':
        function(p_name,p_passwd){
            return 'update py_user_accounts set passwd=\''+p_passwd+'\',loginerr=0,state=\'A\',frstate=0 where name=\''+p_name+'\'' ;
        },
    'update_passwd_fr':
        function(p_name,p_passwd){
            return 'update py_user_accounts set passwd=\''+p_passwd+'\',loginerr=0,state=\'A\',frstate=1 where name=\''+p_name+'\' and frstate=0' ;
        },
    'query_upname':
        function(p_name){
            return 'select up_name,up_id from py_relatation where down_name=\''+p_name+'\'' ;
        },
    'query_downname':
        function(p_name){
            return 'select a.*,b.alname as shopname from '+
                '(select down_name,down_id from py_relatation where up_name=\''+p_name+'\' ) a,'+
                '(select name,alname from py_user_accounts ) b '+
                'where a.down_name=b.name ; ';
        },
    'query_senddownname':
        function(p_name){
            return 'select a.*,b.alname as shopname from '+
                '(select down_name,down_id from py_relatation where  down_id=3 and up_name=\''+p_name+'\' ) a,'+
                '(select name,alname from py_user_accounts ) b '+
                'where a.down_name=b.name ; ';
        },
    'query_shengdownname':
        function(p_name){
            return 'select a.*,b.alname as shopname from '+
                '(select down_name,down_id from py_relatation where  down_id=4 and up_name=\''+p_name+'\' ) a,'+
                '(select name,alname from py_user_accounts ) b '+
                'where a.down_name=b.name ; ';
        },
    'query_downnameandlevel':
        function(p_name,p_down_id){
            return 'select a.*,b.alname as shopname from '+
                '(select down_name,down_id from py_relatation where  down_id=\''+p_down_id+'\' and up_name=\''+p_name+'\' ) a,'+
                '(select name,alname from py_user_accounts ) b '+
                'where a.down_name=b.name ; ';
        },
    'query_allchild_recuris':
        function(p_name){
            return 'select getChildName(\''+p_name+'\')';
        },
    'insert_new_id':
        function(p_name,p_alname,p_passwd,p_ulevel,p_uzone,p_state,p_frstate,p_sid,p_person_id,p_per_name,p_per_cell){
            return 'insert into py_user_accounts values ('+
                '\''+p_name+'\','+
                '\''+p_alname+'\','+
                '\''+p_passwd+'\','+
                '\''+p_ulevel+'\','+
                '\''+p_uzone+'\',null,'+
                '\''+p_state+'\','+
                '\''+p_frstate+'\','+
                '\''+p_sid+'\',null,'+
                '\''+p_person_id+'\','+
                '\''+p_per_name+'\','+
                '\''+p_per_cell+'\');';
        },
    'update_new_id':
        function(p_name,p_alname,p_passwd,p_ulevel,p_uzone,p_state,p_frstate,p_sid,p_person_id,p_per_name,p_per_cell){
            return 'update py_user_accounts set '+
                'alname=\''+p_alname+'\','+
                'passwd=\''+p_passwd+'\','+
                'ulevel=\''+p_ulevel+'\','+
                'uzone=\''+p_uzone+'\','+
                'state=\''+p_state+'\','+
                'frstate=\''+p_frstate+'\','+
                's_id=\''+p_sid+'\','+
                'person_id=\''+p_person_id+'\','+
                'person_name=\''+p_per_name+'\','+
                'person_cell=\''+p_per_cell+'\' where name=\''+p_name+'\' ;';
        }

};

