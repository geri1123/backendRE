import { BaseRegistration } from '../../../types/auth.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import { AgencyRepository } from '../../../repositories/AgencyRepository.js';
import { RegistrationRequestRepository } from '../../../repositories/RegistrationRequestRepository.js';
import { EmailService } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import { AgentRegistration as AgentRegistrationType } from '../../../types/auth.js';
export class AgentRegistration {
  static async register(body: AgentRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
      public_code, id_card_number,  terms_accepted,
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

    const agency = await AgencyRepository.findByPublicCode(public_code);
    if (!agency) throw new Error('Invalid agency code.');

    const userId = await UserRepository.create({
      ...baseData,
      role: 'agent',
      agency_id: agency.id,
      status: 'inactive',
      verification_token,
      verification_token_expires
    });

    await RegistrationRequestRepository.create({
      user_id: userId,
      id_card_number,
      status: "pending",
      agency_name: agency.agency_name,
      agency_id: agency.id,
    });

    await EmailService.sendVerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    return userId;
  }
}
