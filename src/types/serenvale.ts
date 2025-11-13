// Serenvale Settings Types
// Shared types for settings stored in localStorage

export interface SerenvaleAIConfig {
  customPrompt?: string;
  gptModel?: string;
  whisperMode?: 'local' | 'openai';
}

export interface SerenvaleClinicInfo {
  address?: string;
  email?: string;
  logoUrl?: string;
  name?: string;
  nif?: string;
  phone?: string;
}

export interface SerenvaleDoctorInfo {
  name?: string;
  qualification?: string;
  rpps?: string; // French medical ID
  signature?: string; // Base64 signature image
}

// LocalStorage keys
export const SERENVALE_STORAGE_KEYS = {
  AI_CONFIG: 'serenvale_ai_config',
  CLINIC_INFO: 'serenvale_clinic_info',
  DOCTOR_INFO: 'serenvale_doctor_info',
} as const;

// Default values
export const DEFAULT_AI_PROMPT = `You are a professional French radiologist.
Generate a clear, concise medical report in French based on the dictated findings.
Use standard medical terminology and maintain a professional tone.

Format the report naturally - no need for rigid sections unless specifically requested.
Focus on accuracy and clarity.`;

export const DEFAULT_CLINIC_INFO: SerenvaleClinicInfo = {
  address: '123 Avenue de la Santé, 75001 Paris',
  email: 'contact@serenvale.fr',
  name: 'CLINIQUE SERENVALE',
  phone: '+33 1 23 45 67 89',
};
