import path from 'path';
import fs from 'fs/promises';
import { UserQueries  , UserUpdates} from "../../repositories/user/index.js";
import { FileSystemError, NotFoundError } from '../../errors/BaseError.js';

export class ProfileImageService {
  static async updateProfileImage(userId: number, file: Express.Multer.File, baseDir: string): Promise<string> {
    const user = await UserQueries.findByIdForProfileImage(userId);
    if (!user) throw new NotFoundError('User not found');

   
    if (user.profile_img && user.profile_img.trim() !== '') {
      const oldImagePath = path.resolve(baseDir, user.profile_img);
      try {
        await fs.unlink(oldImagePath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          throw new FileSystemError('Failed to delete old profile image');
        }
        // If ENOENT, ignore (file doesn’t exist)
      }
    }

    
    const newImagePath = `uploads/images/${file.filename}`;
    await UserUpdates.updateProfileImg(userId, newImagePath);

    return newImagePath;
  }
}
