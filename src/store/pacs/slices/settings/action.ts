import { StateCreator } from 'zustand/vanilla';

import { PacsSettings, PacsState } from '../../initialState';

export interface PacsSettingsAction {
  /**
   * Clear last error
   */
  clearError: () => void;

  /**
   * Reset settings to default
   */
  resetSettings: () => void;

  /**
   * Set connection status
   */
  setConnected: (connected: boolean) => void;

  /**
   * Set last error
   */
  setError: (error: string) => void;

  /**
   * Test PACS connection
   */
  testConnection: () => Promise<boolean>;

  /**
   * Update PACS settings
   */
  updateSettings: (settings: Partial<PacsSettings>) => void;
}

export const createSettingsSlice: StateCreator<
  PacsState & PacsSettingsAction,
  [['zustand/devtools', never]],
  [],
  PacsSettingsAction
> = (set, get) => ({
  clearError: () => {
    set({ lastError: undefined }, false, 'clearError');
  },

  resetSettings: () => {
    const { INITIAL_PACS_SETTINGS } = require('../../initialState');
    set(
      {
        isConnected: false,
        lastError: undefined,
        settings: INITIAL_PACS_SETTINGS,
      },
      false,
      'resetSettings',
    );
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected }, false, 'setConnected');
  },

  setError: (error: string) => {
    set({ lastError: error }, false, 'setError');
  },

  testConnection: async () => {
    try {
      set({ lastError: undefined }, false, 'testConnection/start');

      // TODO: Implement actual PACS C-ECHO test
      // For now, just simulate a test
      const { settings } = get();

      if (!settings.host || !settings.port) {
        throw new Error('Please configure PACS host and port');
      }

      // Simulate connection test (replace with actual C-ECHO later)
      await new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 1000);
      });

      set({ isConnected: true }, false, 'testConnection/success');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      set({ isConnected: false, lastError: errorMessage }, false, 'testConnection/error');
      return false;
    }
  },

  updateSettings: (newSettings: Partial<PacsSettings>) => {
    set(
      (state) => ({
        settings: { ...state.settings, ...newSettings },
      }),
      false,
      'updateSettings',
    );
  },
});
