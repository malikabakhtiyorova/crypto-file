create table files(
    file_id serial not null primary key,
    file_path varchar(64) not null,
    file_uploaded_at timestamptz default current_timestamp
);