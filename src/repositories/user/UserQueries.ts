// repositories/user/UserQueries.ts
import { db } from '../../config/db.js';
import { users } from '../../db/schema/users.js';
import type { PartialUserForLogin, PartialUserByToken } from '../../types/database.js';
import { eq, or, and, gt } from 'drizzle-orm';

export class UserQueries {
    static async findById(userId: number) {
    const result = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      
    }).from(users).where(eq(users.id, userId)).limit(1);

    return result[0] || null;
  }
  static async findByIdentifier(identifier: string): Promise<PartialUserForLogin | null> {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        status: users.status,
        role:users.role
      })
      .from(users)
      .where(or(eq(users.username, identifier), eq(users.email, identifier)));

    return result[0] || null;
  }

  static async findByVerificationToken(token: string): Promise<PartialUserByToken | null> {
    const result = await db
      .select({
        id: users.id,
        role: users.role,
        email: users.email,
        first_name: users.first_name,
        agency_id: users.agency_id,
      })
      .from(users)
      .where(
        and(
          eq(users.verification_token, token),
          gt(users.verification_token_expires, new Date())
        )
      )
      .limit(1);

    return result[0] || null;
  }

  static async findByIdForProfileImage(userId: number): Promise<{ id: number; profile_img: string | null } | null> {
    const result = await db
      .select({ id: users.id, profile_img: users.profile_img })
      .from(users)
      .where(eq(users.id, userId));

    return result[0] || null;
  }

  static async getUsernameById(userId: number): Promise<string | null> {
    const result = await db.select({ username: users.username }).from(users).where(eq(users.id, userId));
    return result.length > 0 ? result[0].username : null;
  }

  static async getUserPasswordById(userId: number): Promise<string | null> {
    const result = await db.select({ password: users.password }).from(users).where(eq(users.id, userId)).limit(1);
    if (result.length === 0) return null;
    return result[0].password;
  }

  static async emailExists(email: string): Promise<boolean> {
    const result = await db.select({ exists: users.email }).from(users).where(eq(users.email, email)).limit(1);
    return result.length > 0;
  }

  static async usernameExists(username: string): Promise<boolean> {
    const result = await db.select({ exists: users.username }).from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0;
  }
  static async findByEmail(email: string): Promise<{
  id: number;
  email: string;
  first_name: string | null;
  email_verified: boolean;
} | null> {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      first_name: users.first_name,
      email_verified: users.email_verified,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!result[0]) return null;

  // Convert email_verified (0|1) to boolean
  return {
    id: result[0].id,
    email: result[0].email,
    first_name: result[0].first_name,
    email_verified: Boolean(result[0].email_verified),
  };
}
}
