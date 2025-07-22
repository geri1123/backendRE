import { db } from "../../config/db.js";
import { username_history } from "../../db/schema/username_history.js";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { UsernameHistoryRecord } from "../../types/database.js";

export class UsernameHistoryRepository {
  static async getLastUsernameChange(userId: number): Promise<UsernameHistoryRecord  | null> {
    const result = await db
      .select()
      .from(username_history)
      .where(eq(username_history.user_id, userId))
      .orderBy(desc(username_history.next_username_update))
      .limit(1);

    return result[0] || null;
  }

  static async saveUsernameChange(
    userId: number,
    oldUsername: string,
    newUsername: string,
    nextUpdateDate: Date
  ): Promise<void> {
    await db.insert(username_history).values({
      user_id: userId,
      old_username: oldUsername,
      new_username: newUsername,
      next_username_update: nextUpdateDate,
    });
  }
}
