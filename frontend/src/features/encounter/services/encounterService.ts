import type { Encounter } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

export interface CreateEncounterPayload {
  department?: string;
  admission_date?: string;
  doctor_id?: string;
  doctor_name?: string;
  admission_notes?: string;
  status?: string;
}

export interface UpdateEncounterPayload {
  department?: string;
  discharge_date?: string;
  status?: string;
  admission_notes?: string;
}

export const encounterService = {
  getEncountersByPatient: async (patientId: string): Promise<Encounter[]> => {
    try {
      const res = await http.get<Encounter[]>(`${config.apiUrl}/patients/${patientId}/encounters`);
      return res || [];
    } catch {
      return [];
    }
  },

  getEncounterById: async (encounterId: string): Promise<Encounter | undefined> => {
    try {
      return await http.get<Encounter>(`${config.apiUrl}/encounters/${encounterId}`);
    } catch {
      return undefined;
    }
  },

  createEncounter: async (patientId: string, payload: CreateEncounterPayload): Promise<Encounter> => {
    return http.post<Encounter>(`${config.apiUrl}/patients/${patientId}/encounters`, payload);
  },

  updateEncounter: async (encounterId: string, payload: UpdateEncounterPayload): Promise<Encounter> => {
    return http.patch<Encounter>(`${config.apiUrl}/encounters/${encounterId}`, payload);
  }
};
