// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { EmailService } from '../../services/emailServices/verificationEmailservice.js';
import { UserQueries, UserUpdates} from '../../repositories/user/index.js';
import { AgencyUpdates } from '../../repositories/agency/index.js';
import { ValidationError, NotFoundError } from '../../errors/BaseError.js';
import { generateToken } from '../../utils/hash.js';
import { AgencyQueries } from '../../repositories/agency/index.js';
export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.query.token;

    if (typeof token !== 'string') {
      throw new ValidationError({ token: 'Verification token is required.' });
    }

    const user = await UserQueries.findByVerificationToken(token);

    if (!user) {
      throw new NotFoundError('Invalid or expired verification token.');
    }

    const emailVerified = true;
    const statusToUpdate = user.role === 'agent' ? 'pending' : 'active';

    await UserUpdates.verifyEmail(user.id, emailVerified, statusToUpdate);

 


    if (user.role === 'agency_owner') {
      const agency = await AgencyQueries.findByOwnerUserId(user.id);
      if (agency) {
        await AgencyUpdates.activateAgency(agency.id);
      }
    }
 const safeFirstName = user.first_name ?? 'User';
    if (user.role === 'agent') {
      await EmailService.sendPendingApprovalEmail(user.email, safeFirstName);
    } else {
      await EmailService.sendWelcomeEmail(user.email,safeFirstName);
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

    const user = await UserQueries.findByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    if (user.email_verified) {
      throw new ValidationError({ email: 'Email is already verified.' });
    }

    // Generate a new token and expiry
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

   
    await UserUpdates.regenerateVerificationToken(user.id, token, expires);
const name = user.first_name ?? 'User';  
    // Send email with the token
    await EmailService.sendVerificationEmail(user.email, token, name);

    
    res.status(200).json({
      success: true,
      message: 'Verification email resent.',
      token, 
    });
  } catch (err) {
    next(err);
  }
}