import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ValidationError } from "../../errors/BaseError";
import { updateNameSchema } from "../../validators/users/updateNameSchema.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma";
import { ProfileInfoService } from "../../services/userService/profileInfoService";
import { handleZodError } from "../../validators/zodErrorFormated";



const userRepo = new UserRepositoryPrisma();
const profileInfoService = new ProfileInfoService(userRepo);
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

   
    await profileInfoService.updateFirstNlastN(
       userId,
     firstName,
      lastName,
    );

    res.status(200).json({ message: "Name updated successfully" });
  } catch (err) {
    
return handleZodError(err, next);
   
    
  }
}
