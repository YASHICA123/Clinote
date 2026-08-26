export interface AuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: string;
  created_at: string;
}
