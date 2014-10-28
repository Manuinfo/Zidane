/**
 * Created by linly on 14-10-28.
 */

/**
 * Created by z30 on 14-10-18.
 */


module.exports={
    'check_acc_exist':
        function(b){return 'select * from py_user_accounts where name=\''+b+'\'';},
    'update_acclogintime':
        function(b){ return 'update py_user_accounts set logintime=\''+b+'\' where name=\''+b+'\'' ;},
    'insert_accloginhis':
        function(p_name,p_logintime,p_loginip,p_loginres){
            return 'insert into py_user_login_his values ('+
                    '\''+p_name+'\','+
                    '\''+p_logintime+'\','+
                    '\''+p_loginip+'\','+
                    '\''+p_loginres+'\''+
                    ');'}
};

