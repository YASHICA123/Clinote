import type { Notification } from '../../../types';
import { mockNotifications } from '../../../mock/notifications';

let notificationsList = [...mockNotifications];

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return notificationsList;
  },

  markAsRead: async (id: string): Promise<void> => {
    notificationsList = notificationsList.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
  },

  markAllAsRead: async (): Promise<void> => {
    notificationsList = notificationsList.map(n => ({ ...n, isRead: true }));
  }
};
