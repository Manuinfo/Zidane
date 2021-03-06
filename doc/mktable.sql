

功能点：
1，查看/新建/删除/修改  厂商
2，查看/新建/删除/修改 商品
3，查看/新建，删除/修改 批次
4，报表查询 （数据库明细查询）

5，创建批次号
6，短链接生成和批量生成

7，二维码验证（LAY -1 ），验证是否存在和次数
8，二维码验证（LAY-2）随机码，生成和认证
9，NFC验证
10，代理商二维码验证

11，日志和记录


112.124.117.97  root / paibei
cd /root/paibei/
sqlite3 ./development.sqlite3
.schema

CREATE TABLE "batches" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "product_id" integer, "dist_place" integer, "count" integer, "verify_time" integer, "bid" varchar(255), "created_at" datetime, "updated_at" datetime);
CREATE TABLE "histories" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "product_id" integer, "batch_id" integer, "dist_place" integer, "client_ip" varchar(255), "type" varchar(255), "qrcode_record_id" integer, "nfc_record_id" integer, "created_at" datetime, "updated_at" datetime, "result" varchar(255));
CREATE TABLE "nfc_records" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "nfc_id" varchar(255), "batch_id" integer, "created_at" datetime, "updated_at" datetime);
CREATE TABLE "products" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255), "place" varchar(255), "elements" text, "price" integer, "created_at" datetime, "updated_at" datetime, "image_file_name" varchar(255), "image_content_type" varchar(255), "image_file_size" integer, "image_updated_at" datetime);
CREATE TABLE "qrcode_records" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "batch_id" integer, "sn" varchar(255), "left_time" integer, "created_at" datetime, "updated_at" datetime, "index" integer);
CREATE TABLE "schema_migrations" ("version" varchar(255) NOT NULL);
CREATE INDEX "index_batches_on_product_id" ON "batches" ("product_id");
CREATE INDEX "index_histories_on_batch_id" ON "histories" ("batch_id");
CREATE INDEX "index_histories_on_nfc_record_id" ON "histories" ("nfc_record_id");
CREATE INDEX "index_histories_on_product_id" ON "histories" ("product_id");
CREATE INDEX "index_histories_on_qrcode_record_id" ON "histories" ("qrcode_record_id");
CREATE INDEX "index_nfc_records_on_batch_id" ON "nfc_records" ("batch_id");
CREATE INDEX "index_qrcode_records_on_batch_id" ON "qrcode_records" ("batch_id");
CREATE UNIQUE INDEX "index_qrcode_records_on_sn" ON "qrcode_records" ("sn");
CREATE UNIQUE INDEX "unique_schema_migrations" ON "schema_migrations" ("version");

select * from products limit 10;

sqlite> select * from batches limit 10;
0|2|0|1142|1|140620-02-01|2014-06-20 11:43:12.107000|2014-06-20 11:43:12.107000
1|3|0|4000|1|140620-03-01|2014-06-20 13:05:07.554000|2014-06-20 13:05:07.554000
2|1|0|15000|1|140620-01-01|2014-06-20 15:22:21.393000|2014-06-20 15:22:21.393000
3|2|2|3|30|140626-02-03|2014-06-26 15:20:45.515000|2014-06-26 15:20:45.515000
4|3|0|1000|1|140711-03-01|2014-07-11 12:54:33.117000|2014-07-11 12:54:33.117000
5|1|0|10000|1|140714-01-01|2014-07-14 19:30:10.804000|2014-07-14 19:30:10.804000
6|3|0|5000|1|140714-03-01|2014-07-14 20:06:27.982000|2014-07-14 20:06:27.982000
7|3|0|2|1|140718-03-01|2014-07-18 11:43:25.290000|2014-07-18 11:43:25.290000
8|3|0|10000|1|140728-03-01|2014-07-28 15:05:31.739000|2014-07-28 15:05:31.739000
9|1|0|10000|1|140728-01-01|2014-07-28 15:44:30.073000|2014-07-28 15:44:30.073000


sqlite> select * from histories limit 10;
4|2|11|10|119.188.16.39|QrcodeHistory|66169||2014-09-11 23:38:11.124911|2014-09-11 23:38:11.124911|ok
5|2|11|10|183.193.18.230|QrcodeHistory|66169||2014-09-11 23:38:11.415514|2014-09-11 23:38:11.415514|ok
6|2|11|10|123.151.37.144|QrcodeHistory|66224||2014-09-11 23:38:28.268935|2014-09-11 23:38:28.268935|ok
7|2|11|10|183.193.18.230|QrcodeHistory|66224||2014-09-11 23:38:28.373812|2014-09-11 23:38:28.373812|ok
8|2|11|10|101.226.66.176|QrcodeHistory|66242||2014-09-11 23:38:39.441798|2014-09-11 23:38:39.441798|ok
9|2|11|10|183.193.18.230|QrcodeHistory|66242||2014-09-11 23:38:39.729446|2014-09-11 23:38:39.729446|ok
10|2|11|10|183.193.18.230|QrcodeHistory|66188||2014-09-11 23:38:50.621760|2014-09-11 23:38:50.621760|ok
11|2|11|10|183.61.160.211|QrcodeHistory|66188||2014-09-11 23:38:51.984723|2014-09-11 23:38:51.984723|ok
12|2|11|10|183.193.18.230|QrcodeHistory|66159||2014-09-11 23:38:55.743314|2014-09-11 23:38:55.743314|ok
13|2|11|10|180.153.213.141|QrcodeHistory|66159||2014-09-11 23:38:57.272216|2014-09-11 23:38:57.272216|ok


sqlite> select * from nfc_records limit 10;
0|04a9b342723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
1|04a9ba42723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
2|04a9c142723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
3|04a9c842723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
4|04a9cf42723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
5|04a9d642723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
6|04a9dd42723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
7|04a9e442723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
8|04a9eb42723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000
9|04a9f242723680|0|2014-06-24 13:22:56.000000|2014-06-24 13:22:56.000000

sqlite> select * from qrcode_records limit 10;
0|0|c1lEe2|1|2014-06-20 03:43:12.000000|2014-09-26 15:20:20.804768|1
1|0|IwYRJ3|1|2014-06-20 03:43:12.000000|2014-06-20 03:43:12.000000|2
2|0|lCKpHQ|1|2014-06-20 03:43:12.000000|2014-06-20 03:43:12.000000|3
3|0|PjPHrb|1|2014-06-20 03:43:12.000000|2014-06-20 03:43:12.000000|4
4|0|NNp8WG|1|2014-06-20 03:43:12.000000|2014-06-20 03:43:12.000000|5
5|0|kBie8S|1|2014-06-20 03:43:13.000000|2014-06-20 03:43:13.000000|6
6|0|uSVDwW|1|2014-06-20 03:43:13.000000|2014-06-20 03:43:13.000000|7
7|0|tGIraa|1|2014-06-20 03:43:13.000000|2014-06-20 03:43:13.000000|8
8|0|ENLiwb|1|2014-06-20 03:43:13.000000|2014-06-20 03:43:13.000000|9
9|0|Ho2dWJ|1|2014-06-20 03:43:13.000000|2014-06-20 03:43:13.000000|10


 sqlite> select * from products limit 10;
1|酵素|台湾|麦芽糊精、葡萄糖、柳橙果汁、糙米、发酵菠萝粉、发酵木瓜粉、植脂末、苹果香精、盐藻、柠檬酸、库拉索芦荟粉、大麦粉。|580|2014-09-11 22:03:38.701908|2014-09-11 22:14:32.232398|1.png|image/png|374503|2014-09-11 22:14:25.652241
2|牛樟菇|台湾|牛樟菇萃取物95%，明胶|6800|2014-09-11 22:03:42.308260|2014-09-26 17:47:49.174111|red-Lied.png|image/png|7473481|2014-09-26 17:47:46.617673
3|乳酸菌|台湾|玉米淀粉，果葡糖浆，乳糖，脱脂奶粉，葡萄糖酸钙，柠檬酸，麦芽糊精，葡萄糖，ABE-乳酸菌，二氧化硅，LN-300乳酸菌，食用香精，叶绿素铜钠盐。|380|2014-09-11 22:03:45.162686|2014-09-26 17:48:51.969923|Green-Lied.png|image/png|19352350|2014-09-26 17:48:48.461634
4|测试商品|测试产地|测试成分|999|2014-09-17 11:01:57.460715|2014-09-17 11:01:57.460715|webwxgetmsgimg.png|image/png|42764|2014-09-17 11:01:56.883717
5|白金橙花匀亮修护隐形面膜|厦门||288|2014-09-29 16:15:34.772765|2014-10-11 16:27:26.195203||||



#++++++++++++ 经销地表
create table g_sale_zone (
province varchar(128),
city varchar(128),
city_code varchar(24),
PRIMARY KEY(city)
)
engine=INNODB
DEFAULT CHARSET=gbk ;

create index city_code_1 on g_sale_zone(city_code);

#++++++++++++ 经销地表
create table g_sale_zone (
province varchar(128),
city varchar(128),
city_code varchar(24),
PRIMARY KEY(city)
)
engine=INNODB
DEFAULT CHARSET=gbk ;

create index city_code_1 on g_sale_zone(city_code);

#++++++++++++ ID管理表
create table b_id_mgnt (
id varchar(128),
name varchar(128),
type varchar(10)
)
engine=INNODB
DEFAULT CHARSET=gbk ;

create index id_ind_1 on b_id_mgnt(name);

insert into b_id_mgnt values ('8','消费者零售','LAY');
insert into b_id_mgnt values ('0','呈煌','LAY');
insert into b_id_mgnt values ('1','生产商装箱员','LAY');
insert into b_id_mgnt values ('2','生产商发货员','LAY');
insert into b_id_mgnt values ('3','省级代理','LAY');
insert into b_id_mgnt values ('4','一级代理商','LAY');
insert into b_id_mgnt values ('5','二级代理商','LAY');
insert into b_id_mgnt values ('6','正品销售商','LAY');
insert into b_id_mgnt values ('7','正品销售商3','LAY');
insert into b_id_mgnt values ('C1','米亚妮亚','CHANNEL');
insert into b_id_mgnt values ('C2','一三一素','CHANNEL');
insert into b_id_mgnt values ('A2','米亚妮亚','SERIAL');
insert into b_id_mgnt values ('A1','一三一素','SERIAL');
insert into b_id_mgnt values ('01','酵素','BRAND');
insert into b_id_mgnt values ('02','乳酸菌','BRAND');
insert into b_id_mgnt values ('03','牛樟菇','BRAND');
insert into b_id_mgnt values ('04','白金橙花匀亮修护隐形面膜','BRAND');
insert into b_id_mgnt values ('01','20','PACKLIMIT');
insert into b_id_mgnt values ('02','20','PACKLIMIT');
insert into b_id_mgnt values ('03','20','PACKLIMIT');
insert into b_id_mgnt values ('04','54','PACKLIMIT');

update b_id_mgnt set name="5" where id="02" and type="PACKLIMIT";

#++++++++++++++++++++++ 商品表
create table g_products (
shop_name varchar(255),
serias varchar(255),
name varchar(128),
product_id varchar(64) not null,
place varchar(255) not null,
price double not null,
create_at datetime not null,
updated_at datetime,
image_file_name varchar(255),
image_content_type varchar(255),
image_file_size double,
image_updated_at datetime,
PRIMARY KEY(name)
)
engine=INNODB
DEFAULT CHARSET=gbk ;

create unique index products_1 on g_products(product_id);
create index products_2 on g_products(shop_name);
create index products_3 on g_products(serias);
create index products_4 on g_products(name);


insert into g_products values ('承煌','一三一素','乳酸菌','9e89e9c76e7e768e0f032b4edb4e0b92','台湾',79.5,'2014-11-23 00:00:00',NULL,NULL,NULL,NULL,NULL);
insert into g_products values ('承煌','一三一素','牛樟菇','3f1c22052884a3ad7b24d6d6ce9c40be','台湾',32.53,'2014-10-14 10:22:00',NULL,NULL,NULL,NULL,NULL);
insert into g_products values ('承煌','一三一素','酵素','0fc145308d031e7b4623cc6c22c8ea3f','台湾',32.53,'2014-10-14 10:22:00',NULL,NULL,NULL,NULL,NULL);
insert into g_products values ('承煌','米亚妮亚','白金橙花匀亮修护隐形面膜','fb9df591767a35bbfffd2af564fbac99','海南',32.53,'2014-10-14 10:22:00',NULL,NULL,NULL,NULL,NULL);

#++++++++++++ 商品成分表
create table products_ele (
product_id varchar(64),
elements text)
engine=INNODB
DEFAULT CHARSET=gbk ;

#+++++++++++  批次表
CREATE TABLE batches (
product_id varchar(64),
prod_part_id varchar(12),
dist_place varchar(12),
bth_count double,
nfc_count double,
verify_time double,
batch_id varchar(255) comment '日期-ProdID-分表-1',
created_at datetime,
updated_at datetime,
PRIMARY KEY(batch_id)
) engine=INNODB
DEFAULT CHARSET=gbk;

create index product_id_3 on batches(product_id);

#乳酸菌
insert into batches values ('9e89e9c76e7e768e0f032b4edb4e0b92','9','66',20000,30000,3,'20141014-02-66-1','2014-10-14 11:35:00',NULL);
insert into batches values ('9e89e9c76e7e768e0f032b4edb4e0b92','9','66',20000,30000,3,'20141014-02-66-2','2014-10-14 11:35:00',NULL);
#牛樟菇
insert into batches values ('3f1c22052884a3ad7b24d6d6ce9c40be','9','55',20000,30000,3,'20141014-03-55-1','2014-10-14 11:35:00',NULL);
insert into batches values ('3f1c22052884a3ad7b24d6d6ce9c40be','9','55',20000,30000,3,'20141014-03-55-2','2014-10-14 11:35:00',NULL);
#酵素
insert into batches values ('0fc145308d031e7b4623cc6c22c8ea3f','9','44',20000,30000,3,'20141014-01-44-1','2014-10-14 11:35:00',NULL);
insert into batches values ('0fc145308d031e7b4623cc6c22c8ea3f','9','44',20000,30000,3,'20141014-01-44-2','2014-10-14 11:35:00',NULL);
#面膜
insert into batches values ('fb9df591767a35bbfffd2af564fbac99','9','77',30000,30000,5,'20141014-04-77-1','2014-10-14 11:45:00',NULL);
insert into batches values ('fb9df591767a35bbfffd2af564fbac99','9','77',30000,30000,5,'20141014-04-77-2','2014-10-14 11:55:00',NULL);

#+++++++++++++++++ 操作记录历史表
CREATE TABLE ops_history (
 client_ip varchar(64) comment '客户端IP',
 client_ua varchar(255) comment '客户端AGENT',
 type varchar(128) comment '类型',
 qrcode varchar(255),
 nfc varchar(255),
 verify_at datetime,
 result varchar(255)
 ) engine=INNODB
DEFAULT CHARSET=gbk;

#+++++++++++++++++ 后台任务管理表
CREATE TABLE ops_task (
 task_name varchar(64) comment '任务名称',
 batch_id varchar(255) comment '批次号',
 task_des double comment '任务目标数量',
 task_start varchar(128) comment '任务开始时间',
 task_end varchar(255) comment '任务结束时间',
 task_state varchar(255),
 PRIMARY KEY(batch_id)
 ) engine=INNODB
DEFAULT CHARSET=gbk;

create unique index ops_task_ind_1 on ops_task(task_start);
create index ops_task_ind_2 on ops_task(task_state);
create index ops_task_ind_3 on ops_task(batch_id);

alter table ops_task add primary key(task_id,task_name);

delete from g_qr_batch_map where batch_id='20141228224535-07-110000';
delete from g_nfc_batch_map where batch_id='20141228224535-07-110000';
delete from g_qr_batch_map where batch_id='20141228154520-01-310000';
delete from g_nfc_batch_map where batch_id='20141228154520-01-310000';
delete from g_qr_batch_map where batch_id='20141228224535-07-110000';
delete from g_nfc_batch_map where batch_id='20141228224535-07-110000';
delete from g_qr_batch_map where batch_id='20141228223852-07-440100';
delete from g_nfc_batch_map where batch_id='20141228223852-07-440100';
delete from ops_task_fail

--20141228223852-07-440100
--20141228154520-01-310000
--20141228224535-07-110000

#+++++++++++++++++ 后台失败详情表
CREATE TABLE ops_task_fail (
 task_id varchar(255) comment '任务ID',
 batch_id varchar(255) comment '批次ID',
 task_dtl varchar(255)
 ) engine=INNODB
DEFAULT CHARSET=gbk;

create index ops_task_f_ind_1 on ops_task_fail(task_id,batch_id);
create index ops_task_f_ind_2 on ops_task_fail(task_id);



#+++++++++ nfc与批次的对应关系
create table g_nfc_batch_map (
batch_id varchar(255),
nfc_id varchar(32),
nfc_flag varchar(64)
) engine=INNODB
DEFAULT CHARSET=gbk;

create unique index nfc_id_1 on g_nfc_batch_map(nfc_id);
create index qr_batch_id_1 on g_nfc_batch_map(batch_id);

#酵素
#酵素
#insert into batches values ('0fc145308d031e7b4623cc6c22c8ea3f','9','44',20000,30000,3,'20141014-0fc145308d031e7b4623cc6c22c8ea3f-44-1','2014-10-14 11:35:00',NULL);
#insert into batches values ('0fc145308d031e7b4623cc6c22c8ea3f','9','44',20000,30000,3,'20141014-0fc145308d031e7b4623cc6c22c8ea3f-44-2','2014-10-14 11:35:00',NULL);
#三素藻
insert into batches values (md5('三素藻'),'9','44',20000,30000,3,'20141208-05-44-1','2014-12-08 11:35:00',NULL);



#827f5c0778d48996b9ee750511c33b09
insert into g_nfc_batch_map values ('20141014-01-44-1','0428F30A9B3280',NULL);
insert into g_nfc_batch_map values ('20141014-01-44-1','0428EC0A9B3280',NULL);
insert into g_nfc_batch_map values ('20141014-01-44-1','0428E50A9B3280',NULL);

#白金橙花匀亮修护隐形面膜
insert into g_nfc_batch_map values ('20141014-04-77-1','0428A60A9B3280',NULL);
insert into g_nfc_batch_map values ('20141014-04-77-1','0428AD0A9B3280',NULL);
insert into g_nfc_batch_map values ('20141014-04-77-1','0428B40A9B3280',NULL);
insert into g_nfc_batch_map values ('20141014-04-77-1','0428BB0A9B3280',NULL);
insert into g_nfc_batch_map values ('20141014-04-77-1','0428C20A9B3280',NULL);

#箱子ID
#0428D70A9B3280
#0428DE0A9B3280
insert into g_nfc_batch_map values ('20141014-fb9df591767a35bbfffd2af564fbac99-77-1','0428D70A9B3280','CH6542010202AA');
insert into g_nfc_batch_map values ('20141014-827f5c0778d48996b9ee750511c33b09-44-1','0428DE0A9B3280','CH6542010203BB');
insert into g_nfc_batch_map values ('20141014-827f5c0778d48996b9ee750511c33b09-44-1','04737B42723680','CH6542010203BB');

#++++++++++++++ qr与批次的对应关系
create table qr_batch_map (
batch_id varchar(255),
qr_href varchar(255),
verify_av_times double
) engine=INNODB
DEFAULT CHARSET=gbk;

create unique index nfc_id_1 on nfc_batch_map(nfc_id);

#++++++++++++++ 随机码验证表
create table veri_randcode (
qrcode varchar(255),
rdcode varchar(255),
gen_time datetime
) engine=INNODB
DEFAULT CHARSET=gbk;

#++++++++++++++ 用户管理表
create table py_user_accounts (
name varchar(255) comment '账户名',
alname varchar(255),
passwd varchar(255),
ulevel varchar(24),
uzone varchar(128),
logintime datetime,
state  varchar(10),
frstate int(1),
s_id varchar(10) comment '系列ID',
loginerr int(4),
person_id varchar(64) comment '身份证',
person_name varchar(64) comment '姓名',
PRIMARY KEY(name)
) engine=INNODB
DEFAULT CHARSET=gbk;

create index py_accounts_1 on py_user_accounts(ulevel);
create index py_accounts_2 on py_user_accounts(state);
create index py_accounts_5 on py_user_accounts(uzone);
create index py_accounts_6 on py_user_accounts(alname);
create index py_accounts_9 on py_user_accounts(frstate);
create index py_accounts_10 on py_user_accounts(s_id);


insert into py_user_accounts values ('W101LS01','yezi5993189**','c4ca4238a0b923820dcc509a6f75849b','6','浙江杭州西湖区',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('W201','3503883**','c4ca4238a0b923820dcc509a6f75849b','4','江苏',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('W2YT205','3916**','c4ca4238a0b923820dcc509a6f75849b','5','江苏无锡',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('1314TP11','MMMMiran**','c4ca4238a0b923820dcc509a6f75849b','3','江苏',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('FACT','苹果','c4ca4238a0b923820dcc509a6f75849b','1','山东',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('PKAA','瑞星','c4ca4238a0b923820dcc509a6f75849b','2','山东',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('ABDCD','温州市前进街正品销售','c4ca4238a0b923820dcc509a6f75849b','7','浙江',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('XYZ','苏州金鸡湖酒店街','c4ca4238a0b923820dcc509a6f75849b','7','江苏',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('root','呈煌','c4ca4238a0b923820dcc509a6f75849b','0','上海',NULL,'A',1,'A2',0,NULL,NULL);
insert into py_user_accounts values ('asdf','360杀毒软件**','c4ca4238a0b923820dcc509a6f75849b','6','浙江杭州西溪湿地',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('setbus','鄂尔多斯**','c4ca4238a0b923820dcc509a6f75849b','7','常州武进区',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('1','加利福尼亚**','c4ca4238a0b923820dcc509a6f75849b','5','河南郑州',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('2','天猫商城**','c4ca4238a0b923820dcc509a6f75849b','5','河南郑州',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('88','块钱支付**','c4ca4238a0b923820dcc509a6f75849b','1','河南郑州',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('99','中山公园**','c4ca4238a0b923820dcc509a6f75849b','2','河南郑州',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('87','百事通**','c4ca4238a0b923820dcc509a6f75849b','1','河南郑州',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('97','国美电器**','c4ca4238a0b923820dcc509a6f75849b','2','河南郑州',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('301','天天快递**','c4ca4238a0b923820dcc509a6f75849b','3','河南郑州',NULL,'A',0,'A1',0,NULL,NULL);
insert into py_user_accounts values ('302','四川火锅**','c4ca4238a0b923820dcc509a6f75849b','3','河南郑州',NULL,'A',0,'A2',0,NULL,NULL);
insert into py_user_accounts values ('W202','老锅底**','c4ca4238a0b923820dcc509a6f75849b','4','云南',NULL,'A',0,'A1',0,NULL,NULL);



#++++++++++++++ 用户登陆历史表
create table py_user_login_his (
name varchar(255),
logintime datetime,
loginip varchar(64),
loginres varchar(64),
reason varchar(128)
) engine=INNODB
DEFAULT CHARSET=gbk;
create index py_accounts_3 on py_user_login_his(logintime);
create index py_accounts_4 on py_user_login_his(name);
create index py_accounts_7 on py_user_login_his(reason);
create index py_accounts_8 on py_user_login_his(loginres);

#++++++++++++++ 装箱历史表/大小箱关系绑定
create table py_package_his (
son_id varchar(128),
par_id varchar(128),
pack_time datetime,
uname varchar(255),
alname varchar(255),
channel_id varchar(10),
PRIMARY KEY(son_id)
) engine=INNODB
DEFAULT CHARSET=gbk;

create index py_package_his_1 on py_package_his(par_id);
create index py_package_his_2 on py_package_his(uname);
create index py_package_his_3 on py_package_his(pack_time);
create index py_package_his_4 on py_package_his(alname);

insert into py_package_his values ('04a9ba52723680','04a9ba52723680','22222',)
insert into py_package_his values ('333','045D5C5A513C81','2014-11-04 21:32:59','87','01','C1');
insert into py_package_his values ('444','045D5C5A513C81','2014-11-04 21:32:59','87','01','C1');
insert into py_package_his values ('555','045D5C5A513C81','2014-11-04 21:32:59','87','01','C1');
insert into py_package_his values ('666','045D5C5A513C82','2014-11-04 21:32:59','87','01','C1');

#++++++++++++++ 发货历史表
create table py_send_his (
par_id varchar(128),
dist_time datetime,
send_name varchar(255),    #发货人ID
recv_name varchar(255),    #收货人ID
alname varchar(255),    #商品名称
send_lid varchar(10),  #发货人层级ID
recv_lid varchar(10)   #收货人层级ID
) engine=INNODB
DEFAULT CHARSET=gbk;

#15800750648
create index py_send_his_1 on py_send_his(par_id);
create index py_send_his_2 on py_send_his(dist_time);
create index py_send_his_3 on py_send_his(send_name);
create index py_send_his_4 on py_send_his(recv_name);
create index py_send_his_5 on py_send_his(alname);

insert into py_send_his values('04a9be427236GF','2014-10-01 11:51:00','FACT','1314TP11','A0','1','2');
insert into py_send_his values('04a9be427236ZF','2014-10-01 11:51:00','FACT','1314TP11','A0','1','2');
insert into py_send_his values('04a9be427236FF','2014-10-31 11:50:00','FACT','1314TP11','A0','1','2');
insert into py_send_his values('04a9be427236CF','2014-10-31 11:51:00','FACT','1314TP11','A0','1','2');
insert into py_send_his values('04a9be427236GF','2014-10-31 11:51:00','FACT','1314TP11','A0','1','2');

#++++++++  代理层级关系
create table py_relatation(
up_name varchar(255),    #发货人ID
down_name varchar(255),    #收货人ID
up_id varchar(10),      #发货人层级ID
down_id varchar(10),     #收货人层级ID
utime datetime            #更新时间
) engine=INNODB
DEFAULT CHARSET=gbk;

create index py_relatation_1  on py_relatation(up_name);
create index py_relatation_2  on py_relatation(down_name);
create index py_relatation_3  on py_relatation(up_id);
create index py_relatation_4  on py_relatation(down_id);


insert into py_relatation values ('root','FACT','0','1','2014-10-31 09:00:00');
insert into py_relatation values ('root','88','0','1','2014-10-31 09:00:00');
insert into py_relatation values ('root','87','0','1','2014-10-31 09:00:00');
insert into py_relatation values ('root','PKAA','0','2','2014-10-31 09:00:00');
insert into py_relatation values ('root','97','0','2','2014-10-31 09:00:00');
insert into py_relatation values ('root','99','0','2','2014-10-31 09:00:00');
insert into py_relatation values ('97','1314TP11','2','3','2014-10-31 09:00:00');
insert into py_relatation values ('97','1314TP12','2','3','2014-10-31 09:00:00');
insert into py_relatation values ('PKAA','1314TP12','2','3','2014-10-31 09:00:00');
insert into py_relatation values ('97','W201','2','4','2014-10-31 09:00:00');
insert into py_relatation values ('1314TP11','W201','3','4','2014-10-31 09:00:00');
insert into py_relatation values ('1314TP11','asdf','3','6','2014-10-31 09:00:00');
insert into py_relatation values ('W201','W2YT205','4','5','2014-10-31 09:00:00');
insert into py_relatation values ('W2YT205','W101LS01','5','6','2014-10-31 09:00:00');
insert into py_relatation values ('W101LS01','setbus','6','7','2014-10-31 09:00:00');
insert into py_relatation values ('W201','ABDCD','4','7','2014-10-31 09:00:00');
insert into py_relatation values ('1314TP12','W201','3','4','2014-10-31 09:00:00');
insert into py_relatation values ('1314TP12','W202','3','4','2014-10-31 09:00:00');
insert into py_relatation values ('W202','W2YT205','4','5','2014-10-31 09:00:00');
insert into py_relatation values ('W2YT205','setbus','5','7','2014-10-31 09:00:00');

#----------------箱子NFC ID 表格 -------------------
create table g_nfc_box_map
(
    nfc_id varchar(128),
    g_name varchar(128),
    bind_date datetime,
    nfc_flag varchar(64),
    PRIMARY KEY(nfc_id)
) engine=INNODB
DEFAULT CHARSET=gbk;

#酵素
insert into g_nfc_box_map values ('0442D37ABE3480',NULL,NULL,'CH310000A101AA')
insert into g_nfc_box_map values ('049B02FA463D84',NULL,NULL,'CH310000A101AA')
insert into g_nfc_box_map values ('049B52FA463D80',NULL,NULL,'CH310000A101AA')
#三素藻   CH310000A105AA


#-----------
#创建索引

create unique index product_id_2 on products_ele(product_id);
create unique index qr_href_1 on qr_batch_map (qr_href);
create index qr_href_2 on ops_history(qrcode);
create index verify_at_1 on ops_history(verify_at);
create index client_ip_1 on ops_history(client_ip);
create index qr_code_1 on veri_randcode(qrcode);
create index rdcode_1 on veri_randcode(rdcode);
create index ops_task_1002 on ops_task(task_start);
create index ops_task_1003 on ops_task(task_name);


#测试数据
1|酵素|台湾|麦芽糊精、葡萄糖、柳橙果汁、糙米、发酵菠萝粉、发酵木瓜粉、植脂末、苹果香精、盐藻、柠檬酸、库拉索芦荟粉、大麦粉。|580|2014-09-11 22:03:38.701908|2014-09-11 22:14:32.232398|1.png|image/png|374503|2014-09-11 22:14:25.652241
2|牛樟菇|台湾|牛樟菇萃取物95%，明胶|6800|2014-09-11 22:03:42.308260|2014-09-26 17:47:49.174111|red-Lied.png|image/png|7473481|2014-09-26 17:47:46.617673


insert into products_ele values ('827f5c0778d48996b9ee750511c33b09','麦芽糊精、葡萄糖、柳橙果汁、糙米、发酵菠萝粉、发酵木瓜粉、植脂末');
insert into products_ele values ('12c8656e2a5d34aba5a23f666ab1d0e4','牛樟菇萃取物95%，明胶');

insert into qr_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-1','abc23434',2);
insert into qr_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-1','42xsdkh34',2);
insert into qr_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-2','loidfasdf',2);
insert into qr_batch_map values ('20141014-827f5c0778d48996b9ee750511c33b09-66-1','xcvzxcvzs',1);

insert into qr_batch_map values ('20141014-01-44-2','/wqr/2005/xcvzxcvzsm',10);
insert into qr_batch_map values ('20141014-01-44-2','http://192.168.0.119:4000/wqr/2005/xv342mnsd3',10);


#---------------- 版本号管理 -------------------
create table py_app_version
(
    v_id varchar(128),
    up_time varchar(128),
    PRIMARY KEY(v_id)
) engine=INNODB
DEFAULT CHARSET=gbk;

insert into py_app_version values ('1.0.1',now());

#---------------- 系统参数管理 -------------------
create table sys_config
(
    sys_key varchar(128),
    sys_val varchar(128),
    PRIMARY KEY(sys_key)
) engine=INNODB
DEFAULT CHARSET=gbk;


#---------------- 账户生命周期表 -------------------
create table py_user_life_log
(
    obj_name varchar(255),
    st_time datetime,
    en_time datetime
) engine=INNODB
DEFAULT CHARSET=gbk;


CREATE INDEX ind_bak_table_1 ON py_user_accounts_bak (baktime);
CREATE INDEX ind_bak_table_2 ON py_relatation_bak (baktime);

















