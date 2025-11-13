export interface PacsSettings {
  /**
   * AE Title (Application Entity Title) for this Serenvale instance
   * Default: SERENVALE
   */
  aeTitle: string;

  /**
   * Whether PACS integration is enabled
   */
  enabled: boolean;

  /**
   * PACS server hostname or IP address
   * Example: dicomserver.co.uk or 192.168.1.100
   */
  host: string;

  /**
   * PACS server AE Title
   * Example: PACS_SERVER
   */
  pacsAeTitle: string;

  /**
   * PACS server port
   * Default: 104 (standard DICOM port)
   */
  port: number;

  /**
   * Timeout for DICOM operations (in milliseconds)
   * Default: 30000 (30 seconds)
   */
  timeout: number;
}

export interface PacsState {
  /**
   * Connection status
   */
  isConnected: boolean;

  /**
   * Last connection error
   */
  lastError?: string;

  /**
   * PACS configuration
   */
  settings: PacsSettings;
}

export const INITIAL_PACS_SETTINGS: PacsSettings = {
  aeTitle: 'SERENVALE',
  enabled: false,
  host: 'www.dicomserver.co.uk',
  pacsAeTitle: 'STORESCP',
  port: 104,
  timeout: 30000,
};

export const initialPacsState: PacsState = {
  isConnected: false,
  settings: INITIAL_PACS_SETTINGS,
};
