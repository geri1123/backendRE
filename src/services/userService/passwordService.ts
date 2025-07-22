import { comparePassword, hashPassword } from "../../utils/hash.js";
import { UserQueries  , UserUpdates} from "../../repositories/user/index.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/BaseError.js";

export class PasswordService {
  async getStoredPassword(userId: number): Promise<string> {
    const storedPassword = await UserQueries.getUserPasswordById(userId);
    if (!storedPassword) {
      throw new NotFoundError("User not found.");
    }
    return storedPassword;
  }
  async isCurrentPasswordValid(currentPassword: string, storedPassword: string): Promise<boolean> {
    return comparePassword(currentPassword, storedPassword);
  }

  async isNewPasswordSameAsCurrent(newPassword: string, storedPassword: string): Promise<boolean> {
    return comparePassword(newPassword, storedPassword);
  }

  
  async hashNewPassword(newPassword: string): Promise<string> {
    return hashPassword(newPassword);
  }

  
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await UserUpdates.updatePassword(userId, hashedPassword);
  }

  
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const storedPassword = await this.getStoredPassword(userId);

    const validCurrent = await this.isCurrentPasswordValid(currentPassword, storedPassword);
    if (!validCurrent) {
     if (!validCurrent) {
  throw new ValidationError({ password: "Current password is incorrect." });
}
    }

    const samePassword = await this.isNewPasswordSameAsCurrent(newPassword, storedPassword);
    if (samePassword) {
      throw new ValidationError({ password: "New password must be different from the current password." });
    }

    const hashedNewPassword = await this.hashNewPassword(newPassword);
    await this.updatePassword(userId, hashedNewPassword);
  }
}