import { PacsStore } from './store';

const isEnabled = (s: PacsStore) => s.settings.enabled;
const isConnected = (s: PacsStore) => s.isConnected;
const lastError = (s: PacsStore) => s.lastError;
const settings = (s: PacsStore) => s.settings;

export const pacsSelectors = {
  isConnected,
  isEnabled,
  lastError,
  settings,
};
