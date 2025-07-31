// src/services/auth/EmailVerificationService.ts

import { IUserRepository } from '../../repositories/user/IUserRepository.js';
import { IAgencyRepository } from '../../repositories/agency/IAgencyRepository.js';
import { ValidationError, NotFoundError } from '../../errors/BaseError.js';
import { generateToken } from '../../utils/hash.js';
import {
  VerificationEmail,
  WelcomeEmail,
  PendingApprovalEmail,
} from '../emailServices/verificationEmailservice.js';

export class EmailVerificationService {
  constructor(
    private userRepo: IUserRepository,
    private agencyRepo: IAgencyRepository
  ) {}

  async verify(token: string): Promise<void> {
    if (!token) {
      throw new ValidationError({ token: 'Verification token is required.' });
    }

    const user = await this.userRepo.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundError('Invalid or expired verification token.');
    }

    const emailVerified = true;
    const statusToUpdate = user.role === 'agent' ? 'pending' : 'active';

    await this.userRepo.verifyEmail(user.id, emailVerified, statusToUpdate);

    if (user.role === 'agency_owner') {
      const agency = await this.agencyRepo.findByOwnerUserId(user.id);
      if (agency) {
        await this.agencyRepo.activateAgency(agency.id);
      }
    }

    const safeFirstName = user.first_name ?? 'User';

    if (user.role === 'agent') {
      const pendingEmail = new PendingApprovalEmail(user.email, safeFirstName);
      await pendingEmail.send();
    } else {
      const welcomeEmail = new WelcomeEmail(user.email, safeFirstName);
      await welcomeEmail.send();
    }
  }

  async resend(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError({ email: 'Email is required.' });
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    if (user.email_verified) {
      throw new ValidationError({ email: 'Email is already verified.' });
    }

    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userRepo.regenerateVerificationToken(user.id, token, expires);

    const name = user.first_name ?? 'User';
    const verificationEmail = new VerificationEmail(user.email, name, token);
    await verificationEmail.send();
  }
}
