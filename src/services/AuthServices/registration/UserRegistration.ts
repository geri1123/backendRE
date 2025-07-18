import { BaseRegistration } from '../../../types/auth.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import { EmailService } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import { UserRegistration as UserRegistrationType  } from '../../../types/auth.js';
export class UserRegistration {
  static async register(body: UserRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
        terms_accepted,
    } = body;

    const baseData: BaseRegistration = {
      username,
      email,
      password,
      first_name,
      last_name,
        terms_accepted
    };

    const verification_token = generateToken();
    const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const userId = await UserRepository.create({
      ...baseData,
      role: 'user',
      status: "inactive",
      verification_token,
      verification_token_expires
    });

    await EmailService.sendVerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    return userId;
  }
}
