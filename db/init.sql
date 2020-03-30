create table auth_users (
   user_id serial primary key,
   username varchar(300) unique not null,
   password varchar(300)
);