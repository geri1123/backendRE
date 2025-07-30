import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/BaseError.js';
import { updatePhoneSchema } from '../../validators/users/updatePhoneSchema.js'; 
import { ProfileInfoService } from '../../services/userService/profileInfoService.js';
import { handleZodError } from "../../validators/zodErrorFormated";
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
interface UpdatePhoneBody {
  phone: string;
}
const userRepo = new UserRepositoryPrisma();
const profileInfoService = new ProfileInfoService(userRepo);
export async function updatePhone(
  req: Request<{}, {}, UpdatePhoneBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) return next(new UnauthorizedError('User not authenticated'));

  try {
    // Validate input
    const { phone } = updatePhoneSchema.parse(req.body);

    
    await profileInfoService.updateUserPhone(userId, phone.trim());

    res.json({ success: true, message: 'Phone updated successfully' });
  } catch (err) {
  
return handleZodError(err, next);
   
    
  }
}
