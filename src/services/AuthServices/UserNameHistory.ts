interface UsernameHistoryRecord {
  id?: number;
  user_id: number;
  old_username: string;
  new_username: string;
  next_username_update: Date;
}

export class UsernameService {
  private conn: any;

  constructor(conn: any) {
    this.conn = conn;
  }

  async getLastUsernameChange(userId: number): Promise<UsernameHistoryRecord | null> {
    const [rows] = await this.conn.query(
      `SELECT * FROM username_history WHERE user_id = ? ORDER BY next_username_update DESC LIMIT 1`,
      [userId]
    );
    return (rows as UsernameHistoryRecord[])[0] || null;
  }

  async canUpdateUsername(userId: number): Promise<boolean> {
    const lastChange = await this.getLastUsernameChange(userId);
    if (!lastChange) return true;

    const now = new Date();
    return now >= new Date(lastChange.next_username_update);
  }

  async saveUsernameChange(userId: number, oldUsername: string, newUsername: string): Promise<void> {
    const nextUpdateDate = new Date();
    nextUpdateDate.setDate(nextUpdateDate.getDate() + 10); // 10 days later

    await this.conn.query(
      `INSERT INTO username_history 
         (user_id, old_username, new_username, next_username_update) 
         VALUES (?, ?, ?, ?)`,
      [userId, oldUsername, newUsername, nextUpdateDate]
    );
  }
}