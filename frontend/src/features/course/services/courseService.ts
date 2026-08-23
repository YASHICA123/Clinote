import type { CourseEntry } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/daily-notes`;

export const courseService = {
  getCourseEntries: async (patientId: string): Promise<CourseEntry[]> => {
    try {
      const res = await http.get<any[]>(`${BASE_URL}/${patientId}`);
      return res.map(note => ({
        id: note.note_id,
        patientId: note.patient_id,
        date: new Date(note.created_at).toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        note: note.note_text,
        doctorId: 'u1',
        doctorName: note.created_by
      }));
    } catch {
      return [];
    }
  },

  addCourseEntry: async (patientId: string, entryData: Omit<CourseEntry, 'id' | 'patientId'>): Promise<CourseEntry> => {
    const payload = {
      patient_id: patientId,
      note_text: entryData.note,
      created_by: entryData.doctorName || 'Staff'
    };
    const res = await http.post<any>(BASE_URL, payload);
    return {
      id: res.note_id,
      patientId: res.patient_id,
      date: new Date(res.created_at).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      note: res.note_text,
      doctorId: 'u1',
      doctorName: res.created_by
    };
  }
};
