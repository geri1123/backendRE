import {
  mysqlTable,
  int,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

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
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex('license_number_unique').on(table.license_number),
    uniqueIndex('public_code_unique').on(table.public_code),
  ]
);
