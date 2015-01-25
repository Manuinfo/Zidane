Zidane
======

A Amusing BI Switch


How to Use
======

git clone git@github.com:Manuinfo/Zidane.git<br />
npm install<br />
node appmain.js<br />


P.S
======
日志在$Zidane/logs/run.log<br />
接口定义在$Zidane/doc


开发规范</br>
======
· 函数命名规则</br>
1，单词首字母大写，不含下划线
2，内联函数，以下划线__打头

· 参数命名规则
1，单词字母全部小写，间隔用下划线
2, 入参带上p，例如p_name

· DB规则
1，字段名单词字母全部小写，间隔用下划线
2，表名单词字母全部小写，间隔用下划线
3, 建表语句统一录入到mktable.sql中

· 日志
1，全部进express 自定义中间件
2，X-Forward-For获取源IP
