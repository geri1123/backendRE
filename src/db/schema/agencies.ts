import {
  mysqlTable,
  int,
  varchar,
  text,
  index,
  mysqlEnum,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { users } from './users.js';

export const agencies = mysqlTable(
  'agencies',
  {
    id: int('id').primaryKey().autoincrement(),
    agency_name: varchar('agency_name', { length: 255 }).notNull(),
    public_code: varchar('public_code', { length: 20 }),
    logo: varchar('logo', { length: 255 }),
    license_number: varchar('license_number', { length: 100 }).notNull(),
    agency_email: varchar('agency_email', { length: 100 }),
    phone: varchar('phone', { length: 20 }),
    address: text('address'),
    website: varchar('website', { length: 255 }),
    status: mysqlEnum('status', ['active', 'inactive', 'suspended']).default('active'),
    owner_user_id: int('owner_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex('license_number_unique').on(table.license_number),
    uniqueIndex('public_code_unique').on(table.public_code),
    uniqueIndex('owner_user_id_unique').on(table.owner_user_id), // ADDED: Ensure one user can only own one agency
    index('owner_user_id_idx').on(table.owner_user_id),
  ]
);
// import {
//   mysqlTable,
//   int,
//   varchar,
//   text,
//   mysqlEnum,
//   timestamp,
//   uniqueIndex,
//   index,
// } from 'drizzle-orm/mysql-core';
// import { users } from './users.js';

// export const agencies = mysqlTable(
//   'agencies',
//   {
//     id: int('id').primaryKey().autoincrement(),
//     agency_name: varchar('agency_name', { length: 255 }).notNull(),
//     public_code: varchar('public_code', { length: 20 }),
//     logo: varchar('logo', { length: 255 }),
//     license_number: varchar('license_number', { length: 100 }).notNull(),
//     agency_email: varchar('agency_email', { length: 100 }),
//     phone: varchar('phone', { length: 20 }),
//     address: text('address'),
//     website: varchar('website', { length: 255 }),
//     status: mysqlEnum('status', ['active', 'inactive', 'suspended']).default('active'),
  
//     created_at: timestamp('created_at').defaultNow().notNull(),
//     updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
//   },
//   (table) => [
//     uniqueIndex('license_number_unique').on(table.license_number),
//     uniqueIndex('public_code_unique').on(table.public_code),
  
//   ]
// );



  // owner_user_id: int('owner_user_id')
    //   .notNull()
    //   .references(() => users.id, { onDelete: 'cascade' }),
  // index('owner_user_id_idx').on(table.owner_user_id), // 👈 Added index here