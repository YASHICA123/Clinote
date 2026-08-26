import type { ClinicalDocument } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/documents`;

export interface CreateDocumentPayload {
  patient_id: string;
  encounter_id?: string;
  document_type: string;
  title: string;
  content: string;
  status?: 'DRAFT' | 'FINAL';
}

export interface UpdateDocumentPayload {
  title?: string;
  content?: string;
  document_type?: string;
}

export const documentService = {
  getDocumentsByPatient: async (patientId: string): Promise<ClinicalDocument[]> => {
    try {
      const res = await http.get<ClinicalDocument[]>(`${config.apiUrl}/patients/${patientId}/documents`);
      return res || [];
    } catch {
      return [];
    }
  },

  getDocumentById: async (documentId: string): Promise<ClinicalDocument | undefined> => {
    try {
      return await http.get<ClinicalDocument>(`${BASE_URL}/${documentId}`);
    } catch {
      return undefined;
    }
  },

  createDocument: async (payload: CreateDocumentPayload): Promise<ClinicalDocument> => {
    return http.post<ClinicalDocument>(BASE_URL, payload);
  },

  updateDocument: async (documentId: string, payload: UpdateDocumentPayload): Promise<ClinicalDocument> => {
    return http.patch<ClinicalDocument>(`${BASE_URL}/${documentId}`, payload);
  },

  finalizeDocument: async (documentId: string): Promise<ClinicalDocument> => {
    return http.post<ClinicalDocument>(`${BASE_URL}/${documentId}/finalize`, {});
  }
};
