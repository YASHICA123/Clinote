import type { Patient } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const BASE_URL = `${config.apiUrl}/patients`;

export interface PatientAdmissionData {
  full_name?: string;
  uhid?: string;
  date_of_birth?: string;
  age?: number | null;
  gender?: string;
  phone_number?: string;
  address?: string;
  admission_date?: string;
  admission_time?: string;
  department?: string;
  ward?: string;
  consultant?: string;
  hospital?: string;
  [key: string]: any;
}

export interface ExtractedAdmissionData {
  upload_id: string;
  status: string;
  filename?: string;
  ocr_engine?: string;
  raw_text_length?: number;
  patient_data?: PatientAdmissionData;
  missing_fields?: string[];
  [key: string]: any;
}

export interface ConfirmPatientResponse {
  success: boolean;
  status: 'success' | 'duplicate';
  message?: string;
  patient_id?: string;
  encounter_id?: string;
  existing_patient_id?: string;
  existing_patient?: {
    id: string;
    name: string;
    hospital_patient_id: string;
    department?: string;
    status?: string;
    gender?: string;
    age?: number;
    consultant?: string;
  };
  patient?: any;
}

export const patientService = {
  getPatients: async (search?: string, mrn?: string): Promise<Patient[]> => {
    let url = BASE_URL;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (mrn) params.append('hospital_patient_id', mrn);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const res = await http.get<Patient[]>(url);
    return res || [];
  },

  getPatientById: async (id: string): Promise<Patient | undefined> => {
    try {
      return await http.get<Patient>(`${BASE_URL}/${id}`);
    } catch {
      return undefined;
    }
  },

  createPatient: async (patientData: Partial<Patient>): Promise<Patient> => {
    return http.post<Patient>(BASE_URL, patientData);
  },

  admitPatient: async (patientData: any): Promise<Patient> => {
    return http.post<Patient>(BASE_URL, patientData);
  },

  updatePatient: async (id: string, updates: Partial<Patient>): Promise<Patient | undefined> => {
    try {
      return await http.patch<Patient>(`${BASE_URL}/${id}`, updates);
    } catch {
      return undefined;
    }
  },

  processAdmissionReport: async (file: File): Promise<ExtractedAdmissionData> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await http.post<any>(`${BASE_URL}/admission-report/process`, formData);
    return res.data || res;
  },

  confirmPatient: async (uploadId: string | undefined, patientData: any): Promise<ConfirmPatientResponse> => {
    const res = await http.post<ConfirmPatientResponse>(`${BASE_URL}/confirm`, {
      upload_id: uploadId,
      patient_data: patientData
    });
    return res;
  }
};
