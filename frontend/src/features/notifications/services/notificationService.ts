import type { Notification } from '../../../types';
import { mockNotifications } from '../../../mock/notifications';

let notificationsList: Notification[] = [...mockNotifications];

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    return notificationsList;
  },

  markAsRead: async (id: string): Promise<void> => {
    notificationsList = notificationsList.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
  },

  markAllAsRead: async (): Promise<void> => {
    notificationsList = notificationsList.map(n => ({ ...n, isRead: true }));
  },

  addNotification: (notification: Notification): void => {
    notificationsList = [notification, ...notificationsList];
  }
};
