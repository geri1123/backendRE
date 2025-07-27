import {
  mysqlTable,
  int,
  varchar,
  text,
  mysqlEnum,
  tinyint,
  timestamp,
  datetime,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: int('id').primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    first_name: varchar('first_name', { length: 100 }),
    last_name: varchar('last_name', { length: 100 }),
    about_me: text('about_me'),
    profile_img: varchar('profile_img', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    website: varchar('website', { length: 255 }),
    role: mysqlEnum('role', ['user', 'agency_owner', 'agent']).notNull(),
    status: mysqlEnum('status', ['active', 'inactive', 'pending', 'suspended']).default('active'),
    email_verified: tinyint('email_verified').default(0),
    last_login: timestamp('last_login'),
    last_active: timestamp('last_active'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    verification_token: varchar('verification_token', { length: 255 }),
    verification_token_expires: datetime('verification_token_expires'),
  },
  (table) => [
    uniqueIndex('users_username_unique').on(table.username),
    uniqueIndex('users_email_unique').on(table.email),
  ]
);
