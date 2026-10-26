allow cor origin access all
get data form post or json payload request
include conn.php
check users.uuid=user_uuid and users.token=token
if exists
   return status true, message text,  data => [
       "uuid" => users.uuid,
       "name" => users.name,
       "email" => users.email,
       "phonenumber" => users.phonenumber,
       "fullname" => users.fullname,
       "token" => users.token,
       "created_at" => users.created_at,
       "updated_at" => users.updated_at
    ];


