import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { agencies } from '../db/schema/agencies';
import { registration_requests } from '../db/schema/registration_requests';
import { users } from '../db/schema/users.js';
import { username_history } from '../db/schema/username_history.js';

// Generated types from schema
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Agency = InferSelectModel<typeof agencies>;
export type NewAgency = InferInsertModel<typeof agencies>;

export type RegistrationRequest = InferSelectModel<typeof registration_requests>;
export type NewRegistrationRequest = InferInsertModel<typeof registration_requests>;

export type UsernameHistoryRecord = InferSelectModel<typeof username_history>;
export type NewUsernameHistoryRecord = InferInsertModel<typeof username_history>;

// Partial views
export type PartialUserForLogin = Pick<User, 'id' | 'username' | 'email' | 'password' | 'status'| 'role'>;
export type PartialUserByToken = Pick<User, 'id' | 'role' | 'email' | 'first_name' | 'agency_id'>;

// Frontend-friendly types (convert tinyint to boolean)
export interface UserWithBooleans extends Omit<User, 'email_verified'> {
  email_verified: boolean;
}

// Helper functions for type conversion
export const convertTinyintToBoolean = (value: number): boolean => value === 1;
export const convertBooleanToTinyint = (value: boolean): number => value ? 1 : 0;
