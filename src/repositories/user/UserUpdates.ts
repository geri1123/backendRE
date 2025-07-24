

import { db } from '../../config/db.js';
import { users } from '../../db/schema/users.js';
import { eq } from 'drizzle-orm';
import type { UserStatus } from '../../types/auth.js';
import { UpdatableUserFields } from '../../types/database.js';
export class UserUpdates {
 
   static async updateFieldsById(
    userId: number,
    fields: Partial<UpdatableUserFields>  
  ): Promise<void> {
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([_, val]) => val !== undefined)
    ) as Partial<UpdatableUserFields>;

    if (Object.keys(filtered).length === 0) return;

   (filtered as any).updated_at = new Date();

    await db.update(users).set(filtered).where(eq(users.id, userId));
  }

  static async verifyEmail(
    userId: number,
    emailVerified: number,
    statusToUpdate: UserStatus
  ): Promise<void> {
    await db.update(users).set({
      email_verified: emailVerified,
      status: statusToUpdate,
      verification_token: null,
      verification_token_expires: null,
      updated_at: new Date(),
    }).where(eq(users.id, userId));
  }
   
  static async regenerateVerificationToken(
    userId: number,
    token: string,
    expires: Date
  ): Promise<void> {
    await db.update(users).set({
      verification_token: token,
      verification_token_expires: expires,
      updated_at: new Date(),
    }).where(eq(users.id, userId));
  }
  static async setLastLogin(userId:number):Promise<void>{
    await db.update(users).set({
      last_login: new Date()
    }).where(eq(users.id, userId));

  }
   static async setLastActive(userId:number):Promise<void>{
    await db.update(users).set({
      last_active: new Date()
    }).where(eq(users.id, userId));

  }
}