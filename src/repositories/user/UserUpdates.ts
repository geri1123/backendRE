// repositories/user/UserUpdates.ts
import { db } from '../../config/db.js';
import { users } from '../../db/schema/users.js';
import { eq } from 'drizzle-orm';
import type { UserStatus } from '../../types/auth.js';

export class UserUpdates {
  static async verifyEmail(userId: number, emailVerified: number, statusToUpdate: UserStatus): Promise<void> {
    await db
      .update(users)
      .set({
        email_verified: emailVerified,
        status: statusToUpdate,
        verification_token: null,
        verification_token_expires: null,
      })
      .where(eq(users.id, userId));
  }

  static async regenerateVerificationToken(userId: number, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({
        verification_token: token,
        verification_token_expires: expires,
      })
      .where(eq(users.id, userId));
  }

  static async updateUsername(userId: number, newUsername: string): Promise<void> {
    await db
      .update(users)
      .set({ username: newUsername, updated_at: new Date() })
      .where(eq(users.id, userId));
  }

  static async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));
  }

  static async updateProfileImg(userId: number, profileImg: string): Promise<void> {
    await db
      .update(users)
      .set({
        profile_img: profileImg,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));
  }

  static async updateAboutMe(userId: number, aboutMe: string): Promise<void> {
    await db
      .update(users)
      .set({
        about_me: aboutMe,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));
  }

  static async updatePhone(userId: number, phone: string): Promise<void> {
    await db
      .update(users)
      .set({
        phone: phone,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));
  }

  static async updateFnmLnm(userId: number, firstName: string, lastName: string): Promise<void> {
    await db
      .update(users)
      .set({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));
  }
}
