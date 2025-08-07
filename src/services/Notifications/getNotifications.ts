import { INotificationRepository } from "../../repositories/notification/INotificationRepository";

export class GetNotificationService {
  constructor(private notificationRepo: INotificationRepository) {}

  async getNotifications(userId: number, limit = 10, offset = 0, languageCode = 'en') {
    const [notifications, unreadCount] = await Promise.all([
      this.notificationRepo.getNotifications({
        userId,
        limit,
        offset,
        languageCode,
      }),
      this.notificationRepo.countUnread(userId),
    ]);

    
    if (languageCode !== 'en') {
      const missingTranslationIds = notifications
        .filter((n) => n.translations.length === 0)
        .map((n) => n.id);

      if (missingTranslationIds.length > 0) {
        const fallbackNotifications = await this.notificationRepo.getNotifications({
          userId,
          limit,
          offset,
          languageCode: 'en',
        });

        const fallbackMap = new Map(fallbackNotifications.map(n => [n.id, n.translations]));

        for (const notification of notifications) {
          if (notification.translations.length === 0 && fallbackMap.has(notification.id)) {
            notification.translations = fallbackMap.get(notification.id)!;
          }
        }
      }
    }

    return { notifications, unreadCount };
  }
  async markAsRead(notificationId: number): Promise<void> {
    this.notificationRepo.changeNotificationStatus(notificationId , 'read');
  }
}
