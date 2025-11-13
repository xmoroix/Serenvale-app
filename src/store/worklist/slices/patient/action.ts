import type { StateCreator } from 'zustand/vanilla';

import { setNamespace } from '@/utils/storeDebug';

import type { FinishedReport, Patient } from '../../initialState';
import type { WorklistStore } from '../../store';

const n = setNamespace('worklist:patient');

export interface PatientAction {
  clearSelectedPatient: () => void;
  markReportAsDone: (patient: Patient, reportContent: string) => void;
  selectPatient: (patient: Patient) => void;
}

export const patientSlice: StateCreator<
  WorklistStore,
  [['zustand/devtools', never]],
  [],
  PatientAction
> = (set) => ({
  clearSelectedPatient: () => {
    set({ selectedPatient: undefined }, false, n('clearSelectedPatient'));
  },

  markReportAsDone: (patient: Patient, reportContent: string) => {
    const finishedReport: FinishedReport = {
      completedAt: new Date().toISOString(),
      patient,
      reportContent,
    };

    set(
      (state) => ({
        finishedReports: [...state.finishedReports, finishedReport],
      }),
      false,
      n('markReportAsDone'),
    );
  },

  selectPatient: (patient: Patient) => {
    set({ selectedPatient: patient }, false, n('selectPatient'));
  },
});
