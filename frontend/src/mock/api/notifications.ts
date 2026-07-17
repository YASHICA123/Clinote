import type { Notification } from '../../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Critical Result: ABG pH Alert',
    message: 'ABG pH for Bed 11 Roshan Lal Thakur is 7.24 (Critical Acidosis). Clinical review recommended.',
    time: '5m ago',
    type: 'warning',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'HRCT Chest Report Uploaded',
    message: 'High-Resolution Chest CT Scan report and imaging files are now available for Bed 45 Rajinder N. Sharma.',
    time: '10m ago',
    type: 'success',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'New Patient Admitted',
    message: 'Rajinder N. Sharma (81 Y/M) has been admitted to ICU Bed 45 under Dr. Deepak Bhasin.',
    time: '1h ago',
    type: 'info',
    isRead: true
  },
  {
    id: 'notif-4',
    title: 'High Respiratory Rate Alert',
    message: 'Bed 15 Ankita Rawat RR increased to 24/min. SpO2 is 91% on 2L O2.',
    time: '2h ago',
    type: 'warning',
    isRead: true
  }
];
