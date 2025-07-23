import { BaseRegistration } from '../../../types/auth.js';
import { UserInserts } from '../../../repositories/user/index.js';
import { AgencyInserts    } from '../../../repositories/agency/index.js';
import { EmailService } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import { AgencyOwnerRegistration as AgencyOwnerRegistrationType } from '../../../types/auth.js';
export class AgencyOwnerRegistration {
  static async register(body: AgencyOwnerRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
      agency_name, license_number,
      address,
        terms_accepted,
    } = body;

    const baseData: BaseRegistration = {
      username,
      email,
      password,
      first_name,
      last_name,
        terms_accepted,
    };

    const verification_token = generateToken();
    const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const agencyId = await AgencyInserts.create({
      agency_name,
      license_number,
      address
    });

    const userId = await UserInserts.create({
      ...baseData,
      role: 'agency_owner',
      agency_id: agencyId,
      status: 'inactive',
      verification_token,
      verification_token_expires
    });

    await EmailService.sendVerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    return userId;
  }
}
