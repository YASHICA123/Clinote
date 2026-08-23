import type { Report } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/reports`;

export const reportService = {
  getReports: async (patientId: string): Promise<Report[]> => {
    try {
      return await http.get<Report[]>(`${BASE_URL}/${patientId}`);
    } catch {
      return [];
    }
  },

  uploadReport: async (patientId: string, file: File): Promise<Report> => {
    const formData = new FormData();
    formData.append('patient_id', patientId);
    formData.append('file', file);
    
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Report upload failed: ${res.statusText}`);
    return res.json() as Promise<Report>;
  }
};
