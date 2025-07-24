import { UserUpdates } from "../../repositories/user/index.js";


export class ProfileInfoService {
  async updateAboutMe(userId: number, aboutMe: string): Promise<void> {
    await UserUpdates.updateFieldsById(userId, { about_me: aboutMe });
  }

  async updateUserPhone(userId: number, phone: string): Promise<void> {
    await UserUpdates.updateFieldsById(userId, { phone });
  }

   async updateFirstNlastN(id: number, first_name: string, last_name: string): Promise<void> {
    await UserUpdates.updateFieldsById(id, { first_name, last_name });
  }
}
