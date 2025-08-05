import { BaseRegistration } from '../../../types/auth.js';

import { VerificationEmail } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import type { AgentRegistration as AgentRegistrationType } from '../../../types/auth.js';
import type { IUserRepository } from '../../../repositories/user/IUserRepository.js';
import { IRegistrationRequestRepository } from '../../../repositories/registrationRequest/IRegistrationRequestRepository.js';
import { IAgencyRepository } from '../../../repositories/agency/IAgencyRepository.js';
import { NotificationService } from '../../Notifications/Notifications.js';
import { getSocketInstance } from '../../../socket/socket.js'; 
export class AgentRegistration {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly agencyRepo: IAgencyRepository,
    private readonly requestRepo: IRegistrationRequestRepository,
     private readonly notificationService: NotificationService
  ) {}

  async register(body: AgentRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
      public_code, id_card_number, requested_role
    } = body;

    const baseData: BaseRegistration = {
      username,
      email,
      password,
      first_name,
      last_name,
    };

    const verification_token = generateToken();
    const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const agency = await this.agencyRepo.findByPublicCode(public_code);
    if (!agency) throw new Error('Invalid agency code.');

    const userId = await this.userRepo.create({
      ...baseData,
      role: 'agent',
      status: 'inactive',
      verification_token,
      verification_token_expires,
    });

    await this.requestRepo.create({
      user_id: userId,
      id_card_number,
      status: 'pending',
      agency_name: agency.agency_name,
      agency_id: agency.id,
      requested_role,
      request_type: 'agent_license_verification',
    });
  try {
      const io = getSocketInstance();
      await this.notificationService.sendNotification({
        userId: agency.owner_user_id, 
        type: 'agent_registration_request',
        io,
        translations: [
          {
            languageCode: 'sq',
            message: `${first_name} ${last_name} kërkon të futet në agjencinë tuaj`
          },
          {
            languageCode: 'en', 
            message: `${first_name} ${last_name} has requested to join your agency`
          }
        ],
        extraData: {
          agentName: `${first_name} ${last_name}`,
          agentUsername: username,
          agentEmail: email,
          agencyName: agency.agency_name,
          requestId: userId 
        }
      });

      console.log(`✅ Notification sent to agency owner (ID: ${agency.owner_user_id}) for agent registration request`);
    } catch (notificationError) {
      console.error('❌ Failed to send notification to agency owner:', notificationError);
     
    }
    const verificationEmail = new VerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    const emailSent = await verificationEmail.send();
    if (!emailSent) {
      throw new Error('Failed to send verification email');
    }

    return userId;
  }
}
