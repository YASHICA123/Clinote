import type { DischargeSummary } from '../../../types';
import { getPatientDischargeSummary, mockDischargeSummaries } from '../../../mock/discharge';

export const dischargeService = {
  getDischargeSummary: async (patientId: string): Promise<DischargeSummary> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getPatientDischargeSummary(patientId);
  },

  saveDischargeSummary: async (patientId: string, summaryData: DischargeSummary): Promise<DischargeSummary> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate saving/generating
    mockDischargeSummaries[patientId] = {
      ...summaryData,
      patientId
    };
    return mockDischargeSummaries[patientId];
  }
};
