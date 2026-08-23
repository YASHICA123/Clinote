import type { Investigation } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/investigations`;

export const investigationService = {
  getInvestigations: async (patientId: string): Promise<Investigation[]> => {
    try {
      return await http.get<Investigation[]>(`${BASE_URL}/${patientId}`);
    } catch {
      return [];
    }
  },

  addInvestigation: async (patientId: string, data: Omit<Investigation, 'id' | 'patientId'>): Promise<Investigation> => {
    return http.post<Investigation>(BASE_URL, {
      patientId,
      ...data
    });
  }
};
