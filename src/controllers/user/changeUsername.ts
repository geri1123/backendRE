import { Request, Response } from "express";
import pool from "../../config/db";
// import { usernameExists } from "../../services/AuthServices/userService";
import { UsernameService } from "../../services/AuthServices/UserNameHistory";
import { validateUsernameInput } from "../../services/AuthServices/validations/changeUsernmValidation";
interface ChangeUsernameBody {
  username: string;
}
export async function changeUsername(
  req: Request<{}, {}, ChangeUsernameBody>,
  res: Response
): Promise<void> {
  let { username } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

   const validation = validateUsernameInput(username);
  if (!validation.valid) {
    res.status(400).json({ error: validation.errors });
    return;
  }


  const conn = await pool.getConnection();
  try {
    // const usernameTaken = await usernameExists(conn, username);
    // if (usernameTaken) {
    //   res.status(422).json({ error: { username: "Username already exists" } });
    //   return;
    // }

    const usernameService = new UsernameService(conn);
    const canUpdate = await usernameService.canUpdateUsername(userId);
    if (!canUpdate) {
      res.status(429).json({ error: "You can only update username once every 10 days" });
      return;
    }

    const [userRows] = await conn.query("SELECT username FROM users WHERE id = ?", [userId]);
    const currentUsername = (userRows as any[])[0]?.username;

    if (!currentUsername) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await conn.query("UPDATE users SET username = ?, updated_at = NOW() WHERE id = ?", [username, userId]);
    await usernameService.saveUsernameChange(userId, currentUsername, username);

    res.json({ success: true, message: "Username updated" });
  } catch (error: any) {
    console.error("Username update error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}