import { notification_status } from "@prisma/client";

export interface NotificationTranslationInput {
  languageCode: string;
  message: string;
}

export interface NotificationData {
  userId: number;
  type: string;
  translations: NotificationTranslationInput[];
}

export interface INotificationRepository {
  createNotification(data: NotificationData): Promise<any>;
  countUnread(userId: number): Promise<number>;
}