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
  index,
} from 'drizzle-orm/mysql-core';
import { agencies } from './agencies.js';

export const users = mysqlTable(
  'users',
  {
    id: int('id').primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    first_name: varchar('first_name', { length: 100 }), // NULL allowed in DB
    last_name: varchar('last_name', { length: 100 }), // NULL allowed in DB
    about_me: text('about_me'),
    profile_img: varchar('profile_img', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    website: varchar('website', { length: 255 }),
    role: mysqlEnum('role', ['user', 'agency_owner', 'agent']).notNull(),
    agency_id: int('agency_id').references(() => agencies.id),
    status: mysqlEnum('status', ['active', 'inactive', 'pending', 'suspended']).default('active'),
    email_verified: tinyint('email_verified').default(0), // tinyint(1) as in your DB
    last_login: timestamp('last_login'), // NULL allowed
    last_active: timestamp('last_active'), // NULL allowed
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    verification_token: varchar('verification_token', { length: 255 }),
    verification_token_expires: datetime('verification_token_expires'), // datetime as in your DB
  },
  (table) => [
    uniqueIndex('users_username_unique').on(table.username),
    uniqueIndex('users_email_unique').on(table.email),
    index('users_agency_id_index').on(table.agency_id),
  ]
);