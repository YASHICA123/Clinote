import type { TimelineEvent } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

export interface CreateClinicalEventPayload {
  patient_id: string;
  encounter_id?: string;
  event_type: string;
  title?: string;
  content: string;
  created_by?: string;
}

export const timelineService = {
  getTimeline: async (patientId: string, encounterId?: string, order: string = 'desc'): Promise<TimelineEvent[]> => {
    try {
      let url = `${config.apiUrl}/patients/${patientId}/timeline?order=${order}`;
      if (encounterId) url += `&encounter_id=${encounterId}`;
      const res = await http.get<any>(url);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.events)) return res.events;
      return [];
    } catch {
      return [];
    }
  },

  createClinicalEvent: async (payload: CreateClinicalEventPayload): Promise<any> => {
    return http.post<any>(`${config.apiUrl}/clinical/events`, payload);
  },

  addTimelineEvent: async (patientId: string, eventData: any): Promise<TimelineEvent> => {
    return http.post<TimelineEvent>(`${config.apiUrl}/clinical/events`, {
      patient_id: patientId,
      event_type: eventData.type ? eventData.type.toUpperCase() : 'DAILY_UPDATE',
      title: eventData.title,
      content: eventData.details || eventData.subtitle || eventData.title,
      ...eventData
    });
  }
};
