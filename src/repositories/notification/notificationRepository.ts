// repositories/notification/NotificationRepository.ts

import { PrismaClient, notification_status } from "@prisma/client";
import {
  INotificationRepository,
  NotificationData,
} from "./INotificationRepository.js";

export class NotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async createNotification({ userId, type, translations }: NotificationData) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        status: notification_status.unread,
        translations: {
          create: translations.map((t) => ({
            languageCode: t.languageCode,
            message: t.message,
          })),
        },
      },
      include: {
        translations: true,
      },
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        status: notification_status.unread,
      },
    });
  }
}
