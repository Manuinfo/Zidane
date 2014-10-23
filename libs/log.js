/**
 * Created by linly on 14-10-23.
 */

/**
 * Created by linly on 14-10-23.
 */

var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: './logs/run.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'ZidaneBI Switch'
        }//日期文件格式
    ],
    //replaceConsole: true,   //替换console.log
    levels:{
        dateFileLog: 'DEBUG'
    }
});

var dateFileLog = log4js.getLogger('ZidaneBI Switch');

exports.logger = dateFileLog;

exports.use = function(app) {
    //页面请求日志,用auto的话,默认级别是WARN
    //app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
    app.use(log4js.connectLogger(dateFileLog, {level:'debug', format:':remote-addr :method :url :status :response-time'+'ms'}));
};