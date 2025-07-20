import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ValidationError } from '../../errors/BaseError.js';

import { ProfileInfoService } from '../../services/userService/profileInfoService.js';

interface UpdatePhoneBody {
  phone: string;
}

export async function updatePhone(
  req: Request<{}, {}, UpdatePhoneBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User not authenticated');

  const { phone } = req.body;
  
  // Basic validation example: non-empty, you can extend it to phone format
  if (typeof phone !== 'string' || phone.trim().length === 0) {
    throw new ValidationError({ phone: 'Phone cannot be empty' });
  }

  try {
    const prfInfoService = new ProfileInfoService();
    await prfInfoService.updateUserPhone(userId, phone.trim());
    res.json({ success: true, message: 'Phone updated successfully' });
  } catch (err) {
    next(err);
  }
}