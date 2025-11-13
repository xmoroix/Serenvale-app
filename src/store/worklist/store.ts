import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type WorklistState, initialState } from './initialState';
import { type PatientAction, patientSlice } from './slices/patient/action';

//  ===============  聚合 createStoreFn ============ //

export interface WorklistStore extends WorklistState, PatientAction {
  /* empty */
}

const createStore: StateCreator<WorklistStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...patientSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('worklist');

export const useWorklistStore = createWithEqualityFn<WorklistStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
