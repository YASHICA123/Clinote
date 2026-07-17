import type { Medication } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/medications`;

export const medicationService = {
  getMedications: async (patientId: string): Promise<Medication[]> => {
    try {
      return await http.get<Medication[]>(`${BASE_URL}/${patientId}`);
    } catch {
      return [];
    }
  },

  addMedication: async (patientId: string, medData: Omit<Medication, 'id' | 'patientId'>): Promise<Medication> => {
    return http.post<Medication>(BASE_URL, {
      patientId,
      ...medData
    });
  },

  discontinueMedication: async (_patientId: string, medicationId: string): Promise<boolean> => {
    try {
      await http.patch<Medication>(`${BASE_URL}/${medicationId}`, {
        status: 'Discontinued',
        endDate: new Date().toLocaleDateString()
      });
      return true;
    } catch {
      return false;
    }
  }
};
