import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { initialPacsState, PacsState } from './initialState';
import { PacsSettingsAction, createSettingsSlice } from './slices/settings/action';

export type PacsStore = PacsState & PacsSettingsAction;

const createStore: StateCreator<PacsStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialPacsState,
  ...createSettingsSlice(...parameters),
});

export const usePacsStore = createWithEqualityFn<PacsStore>()(
  persist(
    devtools(createStore, {
      name: 'Serenvale_Pacs_Store',
    }),
    {
      name: 'SERENVALE_PACS',
      partialize: (state) => ({
        settings: state.settings,
      }),
    },
  ),
  shallow,
);
