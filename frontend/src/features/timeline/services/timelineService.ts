import type { TimelineEvent } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/timeline`;

export const timelineService = {
  getTimeline: async (patientId: string): Promise<TimelineEvent[]> => {
    try {
      return await http.get<TimelineEvent[]>(`${BASE_URL}/${patientId}`);
    } catch {
      return [];
    }
  },

  addTimelineEvent: async (patientId: string, eventData: Omit<TimelineEvent, 'id' | 'patientId'>): Promise<TimelineEvent> => {
    return http.post<TimelineEvent>(`${BASE_URL}/event`, {
      patientId,
      ...eventData
    });
  }
};
