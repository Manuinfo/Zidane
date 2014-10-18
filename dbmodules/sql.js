/**
 * Created by z30 on 14-10-18.
 */


module.exports.query_prd={
    'selectSQL': function(b){return 'select * from products where name=\''+b+"'";}
};