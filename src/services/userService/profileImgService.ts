import path from 'path';
import fs from 'fs/promises';
import type { IUserRepository } from '../../repositories/user/IUserRepository.js';
import { FileSystemError, NotFoundError } from '../../errors/BaseError.js';
import { BaseUserService } from './BaseUserService.js';
export class ProfileImageService extends BaseUserService {
 constructor(userRepo: IUserRepository) {
    super(userRepo);
  }


  async updateProfileImage(
    userId: number,
    file: Express.Multer.File,
    baseDir: string
  ): Promise<string> {
    const user = await this.userRepo.findByIdForProfileImage(userId);
    if (!user) throw new NotFoundError('User not found');

    // Remove old image if it exists
    if (user.profile_img && user.profile_img.trim() !== '') {
      const oldImagePath = path.resolve(baseDir, user.profile_img);
      try {
        await fs.unlink(oldImagePath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          throw new FileSystemError('Failed to delete old profile image');
        }
     
      }
    }

    const newImagePath = `uploads/images/${file.filename}`;
    await this.userRepo.updateFieldsById(userId, { profile_img: newImagePath });

    return newImagePath;
  }
}
