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
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

export const registration_requests = mysqlTable(
  'registration_requests',
  {
    id: int('id').primaryKey().autoincrement(),
    user_id: int('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    
   
    request_type: mysqlEnum('request_type', [
      'agent_license_verification',
      'agency_registration', 
      'role_change_request' 
    ]).notNull(),
    
    // Agent verification fields
    id_card_number: varchar('id_card_number', { length: 100 }),
    
    // Agency-related fields
    agency_name: varchar('agency_name', { length: 255 }),
    agency_id: int('agency_id').references(() => agencies.id, { onDelete: 'set null' }), 
    
    
    supporting_documents: text('supporting_documents'), 
    
    // Status and review
    status: mysqlEnum('status', ['pending', 'approved', 'rejected', 'under_review']).default('pending'),
    reviewed_by: int('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    review_notes: text('review_notes'),
    reviewed_at: timestamp('reviewed_at'), 
    
    // Additional useful fields
    requested_role: mysqlEnum('requested_role', ['agent', 'agency_owner']),
    license_number: varchar('license_number', { length: 100 }), 
    
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    // Indexes for performance
    index('registration_requests_user_id_index').on(table.user_id),
    index('registration_requests_reviewed_by_index').on(table.reviewed_by),
    index('registration_requests_agency_id_index').on(table.agency_id),
    index('registration_requests_status_index').on(table.status),
    index('registration_requests_request_type_index').on(table.request_type), // For filtering by type
    
    // Prevent duplicate pending requests from same user
    uniqueIndex('unique_pending_user_request').on(table.user_id, table.request_type, table.status),
  ]
);