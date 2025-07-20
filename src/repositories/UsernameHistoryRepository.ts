import pool from "../config/db.js";
import { UsernameHistoryRecord } from "../types/user.js";

export class UsernameHistoryRepository {
  static async getLastUsernameChange(userId: number): Promise<UsernameHistoryRecord | null> {
    const [rows] = await pool.execute(
      `SELECT * FROM username_history WHERE user_id = ? ORDER BY next_username_update DESC LIMIT 1`,
      [userId]
    );
    return (rows as UsernameHistoryRecord[])[0] || null;
  }

  static async saveUsernameChange(userId: number, oldUsername: string, newUsername: string, nextUpdateDate: Date): Promise<void> {
    await pool.execute(
      `INSERT INTO username_history 
         (user_id, old_username, new_username, next_username_update) 
         VALUES (?, ?, ?, ?)`,
      [userId, oldUsername, newUsername, nextUpdateDate]
    );
  }
}