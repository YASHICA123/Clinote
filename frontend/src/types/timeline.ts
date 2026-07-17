export type TimelineEventType = 
  | 'admission' 
  | 'diagnosis' 
  | 'medication' 
  | 'investigation' 
  | 'procedure' 
  | 'transfer' 
  | 'discharge';

export interface TimelineEvent {
  id: string;
  patientId: string;
  type: TimelineEventType;
  title: string;
  subtitle: string;
  timestamp: string;
  details?: string;
  meta?: Record<string, any>;
}
