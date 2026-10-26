create table if not exists users (
    id serial primary key,
    uuid default gen_random_uuid() unique not null,
    token varchar(255) unique not null,
    fullname varchar(50)  not null,
    email varchar(100) unique not null,
    phone varchar(20) unique not null,
    password_hash varchar(255) not null,
    is_admin boolean default false,
    is_active boolean default true,
    created_at timestamp default current_timestamp
);

create table if not exists wallet (
    id serial primary key,
    user_uuid int references users(uuid) on delete cascade,
    balance decimal(10, 2) default 0.00,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists transactions (
    id serial primary key,
    user_uuid int references users(uuid) on delete cascade,
    amount decimal(10, 2) not null,
    type varchar(10) not null, -- 'credit' or 'debit'
    status varchar(20) default 'pending', -- 'pending', 'completed', 'failed'
    payload json default null,
    created_at timestamp default current_timestamp
);


