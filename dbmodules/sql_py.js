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
        }
};

