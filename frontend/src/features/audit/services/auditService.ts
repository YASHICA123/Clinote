import type { AuditLog } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

export const auditService = {
  getAuditLogs: async (patientId?: string): Promise<AuditLog[]> => {
    try {
      let url = `${config.apiUrl}/audit/logs`;
      if (patientId) {
        url += `?patient_id=${patientId}`;
      }
      const res = await http.get<AuditLog[]>(url);
      return res || [];
    } catch {
      return [];
    }
  }
};
