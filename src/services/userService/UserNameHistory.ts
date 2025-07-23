import { UserQueries, UserUpdates } from "../../repositories/user/index.js";
import { UsernameHistoryRepository } from "../../repositories/usernameHistory/UsernameHistoryRepository.js";
import { ValidationError, NotFoundError } from "../../errors/BaseError.js";

export class UsernameService {
  async canUpdateUsername(userId: number): Promise<boolean> {
    const lastChange = await UsernameHistoryRepository.getLastUsernameChange(userId);
    if (!lastChange) return true;
    return new Date() >= new Date(lastChange.next_username_update);
  }

  async changeUsername(userId: number, newUsername: string): Promise<void> {
    const usernameTaken = await UserQueries.usernameExists(newUsername);
    if (usernameTaken) {
      throw new ValidationError({ username: "Username already taken" });
    }

    const currentUsername = await UserQueries.getUsernameById(userId);
    if (!currentUsername) {
      throw new NotFoundError("User not found");
    }

    const nextUpdate = new Date();
    nextUpdate.setDate(nextUpdate.getDate() + 10);

    // Use generic update method here:
    await UserUpdates.updateFieldsById(userId, { username: newUsername });

    await UsernameHistoryRepository.saveUsernameChange(
      userId,
      currentUsername,
      newUsername,
      nextUpdate
    );
  }
}
