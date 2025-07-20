import { UserRepository } from "../../repositories/UserRepository";
import { UsernameHistoryRepository } from "../../repositories/UsernameHistoryRepository";

import { ValidationError , NotFoundError} from "../../errors/BaseError";
export class UsernameService {
  

  async canUpdateUsername(userId: number): Promise<boolean> {
    const lastChange = await UsernameHistoryRepository.getLastUsernameChange(userId); 
    if (!lastChange) return true;
    return new Date() >= new Date(lastChange.next_username_update);
  }

  async changeUsername(userId: number, newUsername: string): Promise<void> {
   const usernameTaken = await UserRepository.usernameExists(newUsername);
    if (usernameTaken) {
      throw new ValidationError({ username: "Username already taken" });
    }
   
 const currentUsername = await UserRepository.getUsernameById(userId);
    if (!currentUsername) {
      throw new NotFoundError("User not found");
    }

    const nextUpdate = new Date();
    nextUpdate.setDate(nextUpdate.getDate() + 10);

    await UserRepository.updateUsername(userId, newUsername);
    await UsernameHistoryRepository.saveUsernameChange(userId, currentUsername, newUsername, nextUpdate); 
  }
}