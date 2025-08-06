import { Request, Response, NextFunction } from "express";
import { NotificationRepository } from "../../repositories/notification/notificationRepository";
import { prisma } from "../../config/prisma";
import { UnauthorizedError } from "../../errors/BaseError";
import { GetNotificationService } from "../../services/Notifications/getNotifications";

const notificationRepo = new NotificationRepository(prisma);
const getNotificationService = new GetNotificationService(notificationRepo);

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const languageCode = (req.params.lang || 'en').toLowerCase();

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { notifications, unreadCount } = await getNotificationService.getNotifications(
      userId,
      limit,
      offset,
      languageCode
    );
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    return next(error);
  }
}
