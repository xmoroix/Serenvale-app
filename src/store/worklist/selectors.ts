import type { WorklistStore } from './store';

export const worklistSelectors = {
  getFinishedReportByPatientId: (patientId: string) => (state: WorklistStore) => {
    return state.finishedReports.find((report) => report.patient.id === patientId);
  },
};
