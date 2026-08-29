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
  },

  createAuditLog: async (payload: {
    action: string;
    resource_type: string;
    resource_id: string;
    details?: string;
  }): Promise<any> => {
    try {
      return await http.post(`${config.apiUrl}/audit/logs`, payload);
    } catch (err) {
      console.warn('Failed to record audit log:', err);
      return null;
    }
  }
};
