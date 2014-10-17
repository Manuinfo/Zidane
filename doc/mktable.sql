create table products (
name varchar(128),
product_id varchar(64),
place varchar(255),
elements text,
price double,
create_at datetime,
updated_at datetime,
image_file_name varchar(255),
image_content_type varchar(255),
image_file_size double,
image_updated_at datetime)
engine=INNODB
DEFAULT CHARSET=gbk ;
#-----
create table products_ele (
product_id varchar(64),
elements text)
engine=INNODB
DEFAULT CHARSET=gbk ;
#--
CREATE TABLE batches (
product_id varchar(64),
prod_part_id double,
dist_place double,
count double,
verify_time double,
batch_id varchar(255),
created_at datetime,
updated_at datetime
) engine=INNODB
DEFAULT CHARSET=gbk;
#-------
CREATE TABLE ops_history (
 batch_id varchar(255),
 dist_place double,
 client_ip varchar(64),
 client_ua varchar(255),
 type varchar(128),
  qrcode_record_id double,
  nfc_record_id double,
  verify_at datetime,
  result varchar(255)
) engine=INNODB
DEFAULT CHARSET=gbk;
#-----------
create table nfc_batch_map (
batch_id varchar(255),
nfc_id varchar(255)
) engine=INNODB
DEFAULT CHARSET=gbk;
#----------------
create table qr_batch_map (
batch_id varchar(255),
qr_href varchar(255),
verify_av_times double
) engine=INNODB
DEFAULT CHARSET=gbk;