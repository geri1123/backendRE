import { NextFunction, Request, Response } from "express";
import { UsernameService } from "../../services/userService/UserNameHistory.js";
import { TooManyRequestsError, UnauthorizedError } from "../../errors/BaseError.js";
import { changeUsernameSchema } from "../../validators/users/updateUsernameSchema.js";
import { ZodError } from "zod";
import { handleZodError } from "../../validators/zodErrorFormated.js";
import { ChangeUsernameBody } from "../../validators/users/updateUsernameSchema.js";
export async function changeUsername(
  req: Request<{}, {}, ChangeUsernameBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    return next(new UnauthorizedError('User not authenticated'));
  }

  try {
    const { username } = changeUsernameSchema.parse(req.body);

    const service = new UsernameService();

    const canUpdate = await service.canUpdateUsername(userId);
    if (!canUpdate) {
  throw new TooManyRequestsError("You can only update your username once every 10 days.");
}
    await service.changeUsername(userId, username);
    res.json({ success: true, message: "Username updated successfully." });
  } catch (err) {
    
      return handleZodError(err, next);
   
  }
}
