import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';
import { users } from './users.js';

export const username_history = mysqlTable(
  'username_history',
  {
    id: int('id').primaryKey().autoincrement(),
    user_id: int('user_id').references(() => users.id).notNull(),
    old_username: varchar('old_username', { length: 255 }).notNull(),
    new_username: varchar('new_username', { length: 255 }).notNull(),
    next_username_update: timestamp('next_username_update')
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    index('username_history_user_id_index').on(table.user_id),
  ]
);
