
import { UserRegistration } from './registration/UserRegistration.js';
import { AgencyOwnerRegistration } from './registration/AgencyOwnerRegistration.js';
import { AgentRegistration } from './registration/AgentRegistration.js';
import { RegistrationData } from '../../types/auth.js';
import { UnauthorizedError } from '../../errors/BaseError.js';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../../utils/hash.js';
import { config } from '../../config/config.js';
import { UserQueries } from '../../repositories/user/index.js';



export class AuthService {
  static async registerUserByRole(body:RegistrationData): Promise<number> {
    const role = body.role;

    switch(role) {
      case 'user':
        return UserRegistration.register(body);
      case 'agency_owner':
        return AgencyOwnerRegistration.register(body);
      case 'agent':
        return AgentRegistration.register(body);
      default:
        throw new Error('Invalid role.');
    }
  }


async login(identifier: string, password: string) {
  const user = await UserQueries.findByIdentifier(identifier);

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new UnauthorizedError('Account not active. Verify email or contact support.');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid password.');
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, email: user.email , role:user.role,agencyId: user.agency_id ?? null },
    config.secret.jwtSecret as string,
    { expiresIn: '1d' }
  );

  return { user, token };
}
  
}
