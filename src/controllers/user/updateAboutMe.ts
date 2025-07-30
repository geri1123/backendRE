// backend/src/controllers/user/updateAboutMe.ts
import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ValidationError } from '../../errors/BaseError.js';
import { ProfileInfoService } from '../../services/userService/profileInfoService.js';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';

interface UpdateAboutMeBody {
  aboutMe: string;
}

const userRepo = new UserRepositoryPrisma();
const profileInfoService = new ProfileInfoService(userRepo);

export async function updateAboutMe(
  req: Request<{}, {}, UpdateAboutMeBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User not authenticated');

  const { aboutMe } = req.body;
  if (typeof aboutMe !== 'string' || aboutMe.trim().length === 0) {
    throw new ValidationError({ aboutMe: 'About me cannot be empty' });
  }

  try {
    await profileInfoService.updateAboutMe(userId, aboutMe.trim());
    res.json({ success: true, message: 'About me updated successfully' });
  } catch (err) {
    next(err);
  }
}
