create TABLE products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
	description text,
	price integer
)

create extension if not	exists "uuid-ossp";

create table if not exists stocks (
  count integer,
  product_id uuid,
  foreign key ("product_id") references "products" ("id")
)
