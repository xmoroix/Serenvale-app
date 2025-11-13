export interface Patient {
  age: number;
  examDate: string;
  examType: string; // Internal format (e.g., 'irm-cerebrale', 'tdm-thorax')
  examTypeDisplay: string; // User-friendly display (e.g., 'IRM Cérébrale', 'TDM Thoracique')
  id: string;
  name: string;
  referringDoctor: string;
}

export interface FinishedReport {
  completedAt: string;
  patient: Patient;
  reportContent: string;
}

export interface WorklistState {
  finishedReports: FinishedReport[];
  selectedPatient?: Patient;
}

export const initialState: WorklistState = {
  finishedReports: [],
  selectedPatient: undefined,
};
