import { UserUpdates } from "../../repositories/user/index.js";

export class ProfileInfoService {
  async updateAboutMe(userId: number, aboutMe: string): Promise<void> {
    await UserUpdates.updateFieldsById(userId, { about_me: aboutMe });
  }

  async updateUserPhone(userId: number, phone: string): Promise<void> {
    await UserUpdates.updateFieldsById(userId, { phone });
  }

  async updateFirstNlastN(userId: number, firstName: string, lastName: string): Promise<void> {
    await UserUpdates.updateFieldsById(userId, {
      first_name: firstName,
      last_name: lastName,
    });
  }
}
