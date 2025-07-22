import { users } from './users.js';
import { agencies } from './agencies.js';
import {
  mysqlTable,
  int,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';

export const registration_requests = mysqlTable(
  'registration_requests',
  {
    id: int('id').primaryKey().autoincrement(),
    user_id: int('user_id').references(() => users.id).notNull(),
    request_type: mysqlEnum('request_type', ['agent_license_verification']).notNull(),
    id_card_number: varchar('id_card_number', { length: 100 }),
    agency_name: varchar('agency_name', { length: 255 }),
    supporting_documents: text('supporting_documents'),
    status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
    reviewed_by: int('reviewed_by').references(() => users.id),
    review_notes: text('review_notes'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    agency_id: int('agency_id').references(() => agencies.id),
  },
  (table) => [
    index('registration_requests_user_id_index').on(table.user_id),
    index('registration_requests_reviewed_by_index').on(table.reviewed_by),
    index('registration_requests_agency_id_index').on(table.agency_id),
  ]
);
