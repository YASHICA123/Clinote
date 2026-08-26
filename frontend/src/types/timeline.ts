export type TimelineEventType = 
  | 'admission' 
  | 'diagnosis' 
  | 'medication' 
  | 'investigation' 
  | 'procedure' 
  | 'transfer' 
  | 'discharge'
  | string;

export interface TimelineEvent {
  id: string;
  patientId?: string;
  patient_id?: string;
  encounter_id?: string;
  type?: TimelineEventType;
  event_type?: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  details?: string;
  content?: string;
  created_by?: string;
  created_at?: string;
  meta?: Record<string, any>;
}
