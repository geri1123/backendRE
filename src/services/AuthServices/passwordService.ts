export async function getUserPasswordById(conn: any, userId: number): Promise<string | null> {
  const [rows] = await conn.query("SELECT password FROM users WHERE id = ?", [userId]);
  if ((rows as any[]).length === 0) {
    return null;
  }
  return (rows as any)[0].password;
}