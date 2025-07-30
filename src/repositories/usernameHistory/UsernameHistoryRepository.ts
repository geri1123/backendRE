import { prisma } from '../../config/prisma.js';
import type { UsernameHistoryRecord } from '../../types/database.js';
import { IUsernameHistoryRepository } from './IUsernameHistoryRepository.js';

export class UsernameHistoryRepository implements IUsernameHistoryRepository {
  async getLastUsernameChange(userId: number): Promise<UsernameHistoryRecord | null> {
    const record = await prisma.usernameHistory.findFirst({
      where: { user_id: userId },
      orderBy: { next_username_update: 'desc' },
    });
    return record;
  }

  async saveUsernameChange(
    userId: number,
    oldUsername: string,
    newUsername: string,
    nextUpdateDate: Date
  ): Promise<void> {
    await prisma.usernameHistory.create({
      data: {
        user_id: userId,
        old_username: oldUsername,
        new_username: newUsername,
        next_username_update: nextUpdateDate,
      },
    });
  }
}

