insert into auth_users (
   username,
   password
) values (
   ${username},
   ${password}
)
returning username, user_id;