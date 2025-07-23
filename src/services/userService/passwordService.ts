import { comparePassword, hashPassword } from "../../utils/hash.js";
import { UserQueries, UserUpdates } from "../../repositories/user/index.js";
import { NotFoundError, ValidationError } from "../../errors/BaseError.js";
import { sendPassemail } from "../../services/emailServices/passwordEmailService.js";

export class PasswordService {
  private async getStoredPassword(userId: number): Promise<string> {
    const storedPassword = await UserQueries.getUserPasswordById(userId);
    if (!storedPassword) {
      throw new NotFoundError("User not found.");
    }
    return storedPassword;
  }

  private async isCurrentPasswordValid(currentPassword: string, storedPassword: string): Promise<boolean> {
    return comparePassword(currentPassword, storedPassword);
  }

  private async isNewPasswordSameAsCurrent(newPassword: string, storedPassword: string): Promise<boolean> {
    return comparePassword(newPassword, storedPassword);
  }

  private async hashNewPassword(newPassword: string): Promise<string> {
    return hashPassword(newPassword);
  }

  public async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const storedPassword = await this.getStoredPassword(userId);

    const validCurrent = await this.isCurrentPasswordValid(currentPassword, storedPassword);
    if (!validCurrent) {
      throw new ValidationError({ password: "Current password is incorrect." });
    }

    const samePassword = await this.isNewPasswordSameAsCurrent(newPassword, storedPassword);
    if (samePassword) {
      throw new ValidationError({ password: "New password must be different from the current password." });
    }

    const hashedNewPassword = await this.hashNewPassword(newPassword);
    await UserUpdates.updateFieldsById(userId, { password: hashedNewPassword });

    // Fetch full user to send email
    const user = await UserQueries.findById(userId);
    if (user?.email && user?.username) {
      try {
        await sendPassemail(user.email, user.username);
      } catch (err) {
        
        console.error("Failed to send password change email:", err);
      }
    }
  }
}
