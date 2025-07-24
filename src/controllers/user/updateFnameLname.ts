import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ValidationError } from "../../errors/BaseError";
import { updateNameSchema } from "../../validators/users/updateNameSchema.js";

import { ProfileInfoService } from "../../services/userService/profileInfoService";
import { handleZodError } from "../../validators/zodErrorFormated";

export async function updateFnameLname(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { firstName, lastName } = updateNameSchema.parse(req.body);

    const profileinfoService = new ProfileInfoService();
    await profileinfoService.updateFirstNlastN(
       userId,
     firstName,
      lastName,
    );

    res.status(200).json({ message: "Name updated successfully" });
  } catch (err) {
    
return handleZodError(err, next);
   
    
  }
}
