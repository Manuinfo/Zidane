/**
 * Created by linly on 14-10-29.
 */

module.exports={
    'check_acc_exist':
        function(b){return 'select * from py_user_accounts where name=\''+b+'\'';},
    'update_passwd_fr':
        function(p_name,p_passwd){
            return 'update py_user_accounts set passwd=\''+p_passwd+'\',loginerr=0,state=\'A\',frstate=1 where name=\''+p_name+'\' and frstate=0' ;
        }
};
