// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { EmailService } from '../../services/emailServices/verificationEmailservice.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import { AgencyRepository } from '../../repositories/AgencyRepository.js';
import { ValidationError, NotFoundError } from '../../errors/BaseError.js';
import { generateToken } from '../../utils/hash.js';
export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.query.token;

    if (typeof token !== 'string') {
      throw new ValidationError({ token: 'Verification token is required.' });
    }

    const user = await UserRepository.findByVerificationToken(token);

    if (!user) {
      throw new NotFoundError('Invalid or expired verification token.');
    }

    const emailVerified = 1;
    const statusToUpdate = user.role === 'agent' ? 'pending' : 'active';

    await UserRepository.verifyEmail(user.id, emailVerified, statusToUpdate);

    if (user.role === 'agency_owner' && user.agency_id) {
      await AgencyRepository.activateAgency(user.agency_id);
    }

    if (user.role === 'agent') {
      await EmailService.sendPendingApprovalEmail(user.email, user.first_name);
    } else {
      await EmailService.sendWelcomeEmail(user.email, user.first_name);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    next(error); 
  }
}
export async function resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError({ email: 'Email is required.' });
    }

    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    if (user.email_verified) {
      throw new ValidationError({ email: 'Email is already verified.' });
    }
  const token = generateToken();

    // Set token expiration time, e.g. 24 hours from now
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const newToken = await UserRepository.regenerateVerificationToken(user.id, token, expires);

    await EmailService.sendVerificationEmail(user.email, newToken, user.first_name);

    res.status(200).json({
      success: true,
      message: 'Verification email resent.',
    });
  } catch (err) {
    next(err); ;
  }
}
