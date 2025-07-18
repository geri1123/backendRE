import { Request, Response } from "express";
import pool from "../../config/db.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { getUserPasswordById } from "../../services/AuthServices/passwordService.js";
import { validateChangePassword } from "../../services/AuthServices/validations/changePassValidation.js";
interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function changePassword(
  req: Request<{}, {}, ChangePasswordBody>,
  res: Response
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized. User ID is missing." });
    return;
  }

  // Trim all inputs to remove accidental spaces
  const currentPassword = req.body.currentPassword?.trim() || "";
  const newPassword = req.body.newPassword?.trim() || "";
  const confirmPassword = req.body.confirmPassword?.trim() || "";

  // Validate inputs
 const validation = validateChangePassword(currentPassword, newPassword, confirmPassword);

if (!validation.valid) {
  res.status(400).json({ message: validation.message });
  return;
}
  const conn = await pool.getConnection(); 

  try {
    const password = await getUserPasswordById(conn, userId);

    if (!password) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isCurrentPasswordMatch = await comparePassword(currentPassword, password);
    if (!isCurrentPasswordMatch) {
      res.status(401).json({ message: "Current password is incorrect." });
      return;
    }

    const isSameAsOld = await comparePassword(newPassword, password);
    if (isSameAsOld) {
      res.status(400).json({ message: "New password must be different from current password." });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await conn.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    conn.release();
  }
}
