import { Request, Response, NextFunction } from "express";
import { PasswordService } from "../../services/userService/passwordService.js";
import { ValidationError, UnauthorizedError } from "../../errors/BaseError.js";
import { validateChangePassword } from "../../validators/changePassValidation.js";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const passwordService = new PasswordService();

export async function changePassword(
  req: Request<{}, {}, ChangePasswordBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    return next(new UnauthorizedError("User ID not found in request."));
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const validation = validateChangePassword(currentPassword, newPassword, confirmPassword);
    if (!validation.valid) {
      return next(new ValidationError({ password: validation.message! }));
    }

    await passwordService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    return next(err);
  }
}
