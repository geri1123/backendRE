import { Request, Response, NextFunction } from 'express';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../../repositories/agency/AgencyRepository.js';
import { EmailVerificationService } from '../../services/AuthServices/verifyEmailService.js';
import  {prisma} from '../../config/prisma.js';
const userRepo = new UserRepositoryPrisma(prisma);
const agencyRepo = new AgencyRepository(prisma);
const emailVerificationService = new EmailVerificationService(userRepo, agencyRepo);

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.query.token as string;
    await emailVerificationService.verify(token);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export async function resendVerificationEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    await emailVerificationService.resend(email);

    res.status(200).json({
      success: true,
      message: 'Verification email resent.',
    });
  } catch (error) {
    next(error);
  }
}


// // src/controllers/authController.ts
// import { Request, Response, NextFunction } from 'express';
// import { VerificationEmail, WelcomeEmail, PendingApprovalEmail } from '../../services/emailServices/verificationEmailservice.js';
// import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
// import { AgencyRepository } from '../../repositories/agency/AgencyRepository.js';
// import { ValidationError, NotFoundError } from '../../errors/BaseError.js';
// import { generateToken } from '../../utils/hash.js';


// const AgencyQueries = new AgencyRepository();
// const UserQueries = new UserRepositoryPrisma();
// export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
//   try {
//     const token = req.query.token;

//     if (typeof token !== 'string') {
//       throw new ValidationError({ token: 'Verification token is required.' });
//     }

//     const user = await UserQueries.findByVerificationToken(token);

//     if (!user) {
//       throw new NotFoundError('Invalid or expired verification token.');
//     }

//     const emailVerified = true;
//     const statusToUpdate = user.role === 'agent' ? 'pending' : 'active';

//     await UserQueries.verifyEmail(user.id, emailVerified, statusToUpdate);

//     if (user.role === 'agency_owner') {
//       const agency = await AgencyQueries.findByOwnerUserId(user.id);
//       if (agency) {
//         await AgencyQueries.activateAgency(agency.id);
//       }
//     }

//     const safeFirstName = user.first_name ?? 'User';

//     if (user.role === 'agent') {
//       const pendingEmail = new PendingApprovalEmail(user.email, safeFirstName);
//       const sent = await pendingEmail.send();
//       if (!sent) {
//         console.error(`Failed to send pending approval email to ${user.email}`);
//       }
//     } else {
//       const welcomeEmail = new WelcomeEmail(user.email, safeFirstName);
//       const sent = await welcomeEmail.send();
//       if (!sent) {
//         console.error(`Failed to send welcome email to ${user.email}`);
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Email verified successfully.',
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       throw new ValidationError({ email: 'Email is required.' });
//     }

//     const user = await UserQueries.findByEmail(email);

//     if (!user) {
//       throw new NotFoundError('User not found.');
//     }

//     if (user.email_verified) {
//       throw new ValidationError({ email: 'Email is already verified.' });
//     }

//     // Generate a new token and expiry
//     const token = generateToken();
//     const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     await UserQueries.regenerateVerificationToken(user.id, token, expires);

//     const name = user.first_name ?? 'User';

//     const verificationEmail = new VerificationEmail(user.email, name, token);
//     const emailSent = await verificationEmail.send();
//     if (!emailSent) {
//       throw new Error('Failed to send verification email');
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Verification email resent.',
//     });
//   } catch (err) {
//     next(err);
//   }
// }
