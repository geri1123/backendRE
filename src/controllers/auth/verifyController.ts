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
