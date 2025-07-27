import {
  mysqlTable,
  int,
  varchar,
  index,
  mysqlEnum,
  timestamp,
  decimal,
  date,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm/sql';
import { agencies } from './agencies.js';
import { users } from './users.js';

export const agents = mysqlTable('agency_agents', {
  id: int('id').primaryKey().autoincrement(),
  agency_id: int('agency_id')
    .notNull()
    .references(() => agencies.id, { onDelete: 'cascade' }),
  agent_id: int('agent_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  added_by: int('added_by')
    .references(() => users.id, { onDelete: 'set null' })
    .default(sql`NULL`),
  id_card_number: varchar('id_card_number', { length: 100 }),
  role_in_agency: mysqlEnum('role_in_agency', ['agent', 'senior_agent', 'team_lead']).default('agent'),
  commission_rate: decimal('commission_rate', { precision: 5, scale: 2 }),
  start_date: date('start_date'),
  end_date: date('end_date'),
  status: mysqlEnum('status', ['active', 'inactive', 'terminated']).default('active'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => [
  // ADDED: Prevent same agent from being added to same agency multiple times
  uniqueIndex('unique_agency_agent').on(table.agency_id, table.agent_id),
  index('idx_agency_id').on(table.agency_id),
  index('idx_agent_id').on(table.agent_id),
  index('idx_added_by').on(table.added_by),
]);
