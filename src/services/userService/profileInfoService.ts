import type { IUserRepository } from '../../repositories/user/IUserRepository.js';

export class ProfileInfoService {
  constructor(private userRepo: IUserRepository) {}

  async updateAboutMe(userId: number, aboutMe: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { about_me: aboutMe });
  }

  async updateUserPhone(userId: number, phone: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { phone });
  }

  async updateFirstNlastN(userId: number, first_name: string, last_name: string): Promise<void> {
    await this.userRepo.updateFieldsById(userId, { first_name, last_name });
  }
}
