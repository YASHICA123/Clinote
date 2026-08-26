export type DocumentStatus = 'DRAFT' | 'FINAL';

export interface ClinicalDocument {
  id: string;
  patient_id: string;
  encounter_id?: string;
  document_type: string;
  title: string;
  content: string;
  status: DocumentStatus;
  created_by: string;
  finalized_at?: string;
  finalized_by?: string;
  created_at: string;
  updated_at: string;
}
