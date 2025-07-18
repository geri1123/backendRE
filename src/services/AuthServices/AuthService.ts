
import { UserRegistration } from './registration/UserRegistration.js';
import { AgencyOwnerRegistration } from './registration/AgencyOwnerRegistration.js';
import { AgentRegistration } from './registration/AgentRegistration.js';
import { RegistrationData } from '../../types/auth.js';

import jwt from 'jsonwebtoken';
import { comparePassword } from '../../utils/hash.js';
import { config } from '../../utils/config.js';
import { UserRepository } from '../../repositories/UserRepository.js';



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
      const user = await UserRepository.findByIdentifier(identifier);
  
      if (!user) {
        throw new Error('Invalid credentials');
      }
  
      if (user.status !== 'active') {
        throw new Error('Account is not active. Please contact support or verify your email.');
      }
  
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid password.');
      }
  
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        config.secret.jwtSecret as string,
        { expiresIn: '1d' }
      );
  
      return { user, token };
    }
}
