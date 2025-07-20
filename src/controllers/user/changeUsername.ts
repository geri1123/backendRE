import { NextFunction, Request, Response } from "express";
import { validateUsernameInput } from "../../validators/changeUsernameValidation";
import { UsernameService } from "../../services/userService/UserNameHistory";
import { ValidationError } from "../../errors/BaseError";
import { UnauthorizedError } from "../../errors/BaseError";
interface ChangeUsernameBody {
  username: string;
}
export async function changeUsername(
  req: Request<{}, {}, ChangeUsernameBody>,
  res: Response,
  next:NextFunction
): Promise<void> {
  const userId = req.userId;
  const { username } = req.body;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  const validation = validateUsernameInput(username);
 
if (!validation.valid) {
  throw new ValidationError(validation.errors || {});
}
  const service = new UsernameService();

  try {
    const canUpdate = await service.canUpdateUsername(userId);
    if (!canUpdate) {
      res.status(429).json({ error: "You can only update your username once every 10 days." });
      return;
    }

    await service.changeUsername(userId, username);
    res.json({ success: true, message: "Username updated successfully." });
  } catch (err) {
    next(err)
  }
}