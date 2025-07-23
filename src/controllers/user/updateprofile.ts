import type { Request, Response  , NextFunction} from 'express';
import path from 'path';

import { fileURLToPath } from 'url';
import { UnauthorizedError } from '../../errors/BaseError.js';
import { getFullImageUrl } from '../../utils/imageUrl.js';
import { ProfileImageService } from '../../services/userService/profileImgService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function updateProfileImage(req: Request, res: Response , next:NextFunction): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
if (!req.userId) {
      
      throw new UnauthorizedError('User not authenticated');
    }

  try {
    const baseDir = path.resolve(__dirname, '..', '..', '..');
    const newImagePath = await ProfileImageService.updateProfileImage(req.userId, req.file, baseDir);
    const fullUrl = getFullImageUrl(newImagePath, req);

    res.json({ success: true, profilePicture: fullUrl });
  } catch (error) {
      next(error)
  }
}