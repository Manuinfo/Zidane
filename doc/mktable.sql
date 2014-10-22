







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


http://$IP/r/good/
http://$IP/r/qr
http://$IP/r/nfc
http://$IP/d/good
http://$IP/d/qr
http://$IP/d/nfc
http://$IP/w/good
http://$IP/w/qr
http://$IP/w/nfc

#++++++++++++ 经销地表
create table sale_zone (
province varchar(128),
city varchar(128),
city_code varchar(24),
PRIMARY KEY(city)
)
engine=INNODB
DEFAULT CHARSET=gbk ;
#++++++++++++++++++++++ 商品表
create table products (
shop_name varchar(255),
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
batch_id varchar(255),
created_at datetime,
updated_at datetime,
PRIMARY KEY(batch_id)
) engine=INNODB
DEFAULT CHARSET=gbk;
#+++++++++++++++++ 操作记录历史表
CREATE TABLE ops_history (
 client_ip varchar(64),
 client_ua varchar(255),
 type varchar(128),
 qrcode varchar(255),
 nfc varchar(255),
 verify_at datetime,
 result varchar(255)
 ) engine=INNODB
DEFAULT CHARSET=gbk;
#+++++++++ nfc与批次的对应关系
create table nfc_batch_map (
batch_id varchar(255),
nfc_id varchar(255)
) engine=INNODB
DEFAULT CHARSET=gbk;
#++++++++++++++ qr与批次的对应关系
create table qr_batch_map (
batch_id varchar(255),
qr_href varchar(255),
verify_av_times double
) engine=INNODB
DEFAULT CHARSET=gbk;
#++++++++++++++ 随机码验证表
create table veri_randcode (
qrcode varchar(255),
rdcode varchar(255),
gen_time datetime
) engine=INNODB
DEFAULT CHARSET=gbk;
#-----------
#创建索引
create index city_code_1 on sale_zone(city_code);
create unique index product_id_1 on products(product_id);
create index shop_name on products(shop_name);
create unique index product_id_2 on products_ele(product_id);
create index product_id_3 on batches(product_id);
create unique index nfc_id_1 on nfc_batch_map(nfc_id);
create unique index qr_href_1 on qr_batch_map (qr_href);
create index qr_href_2 on ops_history(qrcode);
create index verify_at_1 on ops_history(verify_at);
create index client_ip_1 on ops_history(client_ip);
create index qr_code_1 on veri_randcode(qrcode);
create index rdcode_1 on veri_randcode(rdcode);


#测试数据
1|酵素|台湾|麦芽糊精、葡萄糖、柳橙果汁、糙米、发酵菠萝粉、发酵木瓜粉、植脂末、苹果香精、盐藻、柠檬酸、库拉索芦荟粉、大麦粉。|580|2014-09-11 22:03:38.701908|2014-09-11 22:14:32.232398|1.png|image/png|374503|2014-09-11 22:14:25.652241
2|牛樟菇|台湾|牛樟菇萃取物95%，明胶|6800|2014-09-11 22:03:42.308260|2014-09-26 17:47:49.174111|red-Lied.png|image/png|7473481|2014-09-26 17:47:46.617673

insert into products values ('一生一素公司','乳酸菌','827f5c0778d48996b9ee750511c33b09','台湾',79.5,'2014-11-23 00:00:00',NULL,NULL,NULL,NULL,NULL);
insert into products values ('一生一素公司','牛樟菇','12c8656e2a5d34aba5a23f666ab1d0e4','台湾',32.53,'2014-10-14 10:22:00',NULL,NULL,NULL,NULL,NULL);

insert into products_ele values ('827f5c0778d48996b9ee750511c33b09','麦芽糊精、葡萄糖、柳橙果汁、糙米、发酵菠萝粉、发酵木瓜粉、植脂末');
insert into products_ele values ('12c8656e2a5d34aba5a23f666ab1d0e4','牛樟菇萃取物95%，明胶');

insert into batches values ('827f5c0778d48996b9ee750511c33b09','9','66',20000,30000,3,'20141014-827f5c0778d48996b9ee750511c33b09-66-1','2014-10-14 11:35:00',NULL);
insert into batches values ('12c8656e2a5d34aba5a23f666ab1d0e4','9','77',30000,30000,5,'20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-1','2014-10-14 11:45:00',NULL);
insert into batches values ('12c8656e2a5d34aba5a23f666ab1d0e4','9','77',30000,30000,5,'20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-2','2014-10-14 11:55:00',NULL);

insert into qr_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-1','abc23434',2);
insert into qr_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-1','42xsdkh34',2);
insert into qr_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-2','loidfasdf',2);
insert into qr_batch_map values ('20141014-827f5c0778d48996b9ee750511c33b09-66-1','xcvzxcvzs',1);

insert into nfc_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-1','23424safd');
insert into nfc_batch_map values ('20141014-12c8656e2a5d34aba5a23f666ab1d0e4-77-2','xcvcvcvx');
insert into nfc_batch_map values ('20141014-827f5c0778d48996b9ee750511c33b09-66-1','zxcvzxcvzcvzcv');















