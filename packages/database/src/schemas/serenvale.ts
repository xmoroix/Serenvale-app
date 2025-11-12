/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { index, jsonb, pgTable, text, uniqueIndex, varchar, vector } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { idGenerator } from '../utils/idGenerator';
import { timestamps, varchar255 } from './_helpers';
import { users } from './user';

/**
 * Report templates table for different modalities
 * Stores predefined structures for IRM, TDM, Echo, Xray reports
 */
export const reportTemplates = pgTable(
  'report_templates',
  {
    id: varchar255('id')
      .primaryKey()
      .$defaultFn(() => idGenerator('template'))
      .notNull(),

    name: varchar255('name').notNull(), // e.g., "IRM Cérébrale Standard"
    modality: varchar255('modality').notNull(), // irm, tdm, echo, xr, general
    language: varchar255('language').notNull().default('fr'), // fr, en

    // Template Structure
    header: text('header'), // Clinic letterhead HTML/text
    footer: text('footer'), // Doctor signature/stamp HTML/text
    structure: jsonb('structure').$type<{
      sections: Array<{
        id: string;
        title: string;
        placeholder?: string;
        required?: boolean;
      }>;
    }>(), // Structured sections (Technique, Findings, Conclusion, etc.)

    // AI Agent Configuration
    agentId: varchar255('agent_id'), // Link to specific agent for this modality
    systemPrompt: text('system_prompt'), // Custom instructions for AI generation
    ragFilter: jsonb('rag_filter').$type<{
      modalities?: string[];
      keywords?: string[];
    }>(), // RAG retrieval filters

    // Metadata
    isDefault: text('is_default').default('false'), // Default template for modality
    isActive: text('is_active').default('true'),

    // User Association
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

    ...timestamps,
  },
  (t) => [
    index('report_templates_modality_idx').on(t.modality),
    index('report_templates_user_id_idx').on(t.userId),
    uniqueIndex('report_templates_name_user_id_unique').on(t.name, t.userId),
  ],
);

export type ReportTemplate = typeof reportTemplates.$inferSelect;
export type NewReportTemplate = typeof reportTemplates.$inferInsert;

export const insertReportTemplateSchema = createInsertSchema(reportTemplates);
export const selectReportTemplateSchema = createSelectSchema(reportTemplates);

/**
 * RadLex medical terminology table
 * Stores radiology lexicon terms with embeddings for RAG
 */
export const radlexTerms = pgTable(
  'radlex_terms',
  {
    id: varchar255('id')
      .primaryKey()
      .$defaultFn(() => idGenerator('radlex'))
      .notNull(),

    // RadLex Core Fields
    radlexId: varchar255('radlex_id'), // Official RadLex RID (e.g., RID123)
    term: text('term').notNull(), // English term
    termFr: text('term_fr'), // French translation
    definition: text('definition'), // English definition
    definitionFr: text('definition_fr'), // French definition

    // Classification
    category: varchar255('category'), // anatomy, finding, procedure, etc.
    modality: varchar255('modality'), // irm, tdm, echo, xr, general (for filtering)
    bodyPart: varchar255('body_part'), // brain, thorax, abdomen, etc.

    // Embeddings for RAG (1536 dimensions for OpenAI text-embedding-3-small)
    embeddingEn: vector('embedding_en', { dimensions: 1536 }), // English embedding
    embeddingFr: vector('embedding_fr', { dimensions: 1536 }), // French embedding

    // Metadata
    synonyms: jsonb('synonyms').$type<string[]>(), // Alternative terms
    relatedTerms: jsonb('related_terms').$type<string[]>(), // Related RadLex IDs
    usageFrequency: text('usage_frequency'), // common, uncommon, rare

    ...timestamps,
  },
  (t) => [
    index('radlex_terms_modality_idx').on(t.modality),
    index('radlex_terms_category_idx').on(t.category),
    index('radlex_terms_body_part_idx').on(t.bodyPart),
    uniqueIndex('radlex_terms_radlex_id_unique').on(t.radlexId),
  ],
);

export type RadlexTerm = typeof radlexTerms.$inferSelect;
export type NewRadlexTerm = typeof radlexTerms.$inferInsert;

// Note: Schema generation disabled due to vector type incompatibility with drizzle-zod
// export const insertRadlexTermSchema = createInsertSchema(radlexTerms);
// export const selectRadlexTermSchema = createSelectSchema(radlexTerms);

/**
 * Clinic settings table
 * Stores clinic/facility configuration (separate from user settings)
 */
export const clinicSettings = pgTable(
  'clinic_settings',
  {
    id: varchar255('id')
      .primaryKey()
      .$defaultFn(() => idGenerator('clinic'))
      .notNull(),

    // Clinic Information
    name: text('name').notNull(),
    address: text('address'),
    phone: text('phone'),
    email: text('email'),
    nif: varchar255('nif'), // Tax ID / NIF
    logo: text('logo'), // Base64 or URL to logo image

    // Letterhead Configuration
    letterheadHtml: text('letterhead_html'), // Custom HTML template
    footerHtml: text('footer_html'),

    // PACS Configuration
    pacsConfig: jsonb('pacs_config').$type<{
      host?: string;
      port?: number;
      aet?: string; // AE Title
      callingAet?: string;
      timeout?: number;
      hl7Auth?: boolean;
    }>(),

    // AI Configuration
    aiConfig: jsonb('ai_config').$type<{
      provider?: string; // openai, anthropic, etc.
      apiKey?: string; // Encrypted
      defaultModel?: string;
      temperature?: number;
      maxTokens?: number;
      ragEnabled?: boolean;
    }>(),

    // Printer Configuration
    printerConfig: jsonb('printer_config').$type<{
      networkPrinter?: string;
      paperSize?: string;
      autoPrint?: boolean;
    }>(),

    // Theme Configuration
    theme: jsonb('theme').$type<{
      primaryColor?: string;
      darkMode?: boolean;
    }>(),

    // User Association
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    ...timestamps,
  },
  (t) => [index('clinic_settings_user_id_idx').on(t.userId)],
);

export type ClinicSettings = typeof clinicSettings.$inferSelect;
export type NewClinicSettings = typeof clinicSettings.$inferInsert;

export const insertClinicSettingsSchema = createInsertSchema(clinicSettings);
export const selectClinicSettingsSchema = createSelectSchema(clinicSettings);

/**
 * Doctor/Radiologist settings table
 * Stores individual doctor preferences and signature
 */
export const doctorSettings = pgTable(
  'doctor_settings',
  {
    id: varchar255('id')
      .primaryKey()
      .$defaultFn(() => idGenerator('doctor'))
      .notNull(),

    // Doctor Information
    name: text('name').notNull(),
    specialty: text('specialty'), // Radiology, Neuroradiology, etc.
    licenseNumber: varchar255('license_number'),
    signature: text('signature'), // Base64 image of signature
    stamp: text('stamp'), // Base64 image of official stamp

    // Preferences
    defaultLanguage: varchar255('default_language').default('fr'), // fr, en
    defaultTemplate: varchar255('default_template'), // Default template ID
    voiceSettings: jsonb('voice_settings').$type<{
      ttsEnabled?: boolean;
      ttsVoice?: string;
      ttsSpeed?: number;
      sttEnabled?: boolean;
      sttLanguage?: string;
    }>(),

    // User Association
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index('doctor_settings_user_id_idx').on(t.userId),
    uniqueIndex('doctor_settings_user_id_unique').on(t.userId),
  ],
);

export type DoctorSettings = typeof doctorSettings.$inferSelect;
export type NewDoctorSettings = typeof doctorSettings.$inferInsert;

export const insertDoctorSettingsSchema = createInsertSchema(doctorSettings);
export const selectDoctorSettingsSchema = createSelectSchema(doctorSettings);
