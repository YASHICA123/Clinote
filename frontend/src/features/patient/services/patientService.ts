import type { Patient } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/patients`;

export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    return http.get<Patient[]>(BASE_URL);
  },

  getPatientById: async (id: string): Promise<Patient | undefined> => {
    try {
      return await http.get<Patient>(`${BASE_URL}/${id}`);
    } catch {
      return undefined;
    }
  },

  admitPatient: async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
    return http.post<Patient>(BASE_URL, patientData);
  },

  updatePatient: async (id: string, updates: Partial<Patient>): Promise<Patient | undefined> => {
    try {
      return await http.patch<Patient>(`${BASE_URL}/${id}`, updates);
    } catch {
      return undefined;
    }
  }
};
