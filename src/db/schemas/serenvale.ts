import { pgTable, text, varchar, jsonb, timestamp, index, vector } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Helper function to generate IDs
function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== Users ====================
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => generateId('user')),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('doctor'), // doctor, admin, technician
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;

// ==================== Clinic Settings ====================
export const clinicSettings = pgTable('clinic_settings', {
  id: text('id').primaryKey().$defaultFn(() => generateId('clinic')),

  // Clinic Info
  clinicName: varchar('clinic_name', { length: 255 }).notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  logo: text('logo'), // Base64 or URL

  // PACS Configuration
  pacsConfig: jsonb('pacs_config').$type<{
    aeTitle: string;
    host: string;
    port: number;
    protocol: 'DIMSE' | 'WADO';
  }>(),

  // AI Configuration
  aiConfig: jsonb('ai_config').$type<{
    provider: 'openai';
    model: string;
    temperature: number;
    maxTokens: number;
  }>(),

  // Printer Settings
  printerConfig: jsonb('printer_config').$type<{
    defaultPrinter: string;
    paperSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
  }>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertClinicSettingsSchema = createInsertSchema(clinicSettings);
export const selectClinicSettingsSchema = createSelectSchema(clinicSettings);
export type ClinicSettings = z.infer<typeof selectClinicSettingsSchema>;

// ==================== Doctor Settings ====================
export const doctorSettings = pgTable('doctor_settings', {
  id: text('id').primaryKey().$defaultFn(() => generateId('doctor')),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

  // Preferences
  defaultModality: varchar('default_modality', { length: 50 }), // irm, tdm, echo, xr
  autoSaveInterval: text('auto_save_interval').default('30'), // seconds
  fontSize: varchar('font_size', { length: 20 }).default('medium'),

  // Signature
  signature: text('signature'), // Base64 image or text
  signaturePosition: varchar('signature_position', { length: 50 }).default('bottom-right'),

  // Voice Settings
  voiceEnabled: text('voice_enabled').default('true'),
  voiceLanguage: varchar('voice_language', { length: 10 }).default('fr-FR'),
  voiceSpeed: text('voice_speed').default('1.0'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertDoctorSettingsSchema = createInsertSchema(doctorSettings);
export const selectDoctorSettingsSchema = createSelectSchema(doctorSettings);
export type DoctorSettings = z.infer<typeof selectDoctorSettingsSchema>;

// ==================== Report Templates ====================
export const reportTemplates = pgTable('report_templates', {
  id: text('id').primaryKey().$defaultFn(() => generateId('template')),

  name: varchar('name', { length: 255 }).notNull(),
  modality: varchar('modality', { length: 50 }).notNull(), // irm, tdm, echo, xr, general
  language: varchar('language', { length: 10 }).notNull().default('fr'),

  // Template Structure
  structure: jsonb('structure').$type<{
    sections: Array<{
      id: string;
      title: string;
      placeholder?: string;
      required?: boolean;
    }>;
  }>(),

  // AI Configuration
  systemPrompt: text('system_prompt'),

  isDefault: text('is_default').default('false'),
  isActive: text('is_active').default('true'),

  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertReportTemplateSchema = createInsertSchema(reportTemplates);
export const selectReportTemplateSchema = createSelectSchema(reportTemplates);
export type ReportTemplate = z.infer<typeof selectReportTemplateSchema>;

// ==================== RadLex Terms (Medical Terminology) ====================
export const radlexTerms = pgTable(
  'radlex_terms',
  {
    id: text('id').primaryKey().$defaultFn(() => generateId('radlex')),

    radlexId: varchar('radlex_id', { length: 50 }).notNull().unique(),
    term: varchar('term', { length: 255 }).notNull(),
    termFr: varchar('term_fr', { length: 255 }),

    definition: text('definition'),
    definitionFr: text('definition_fr'),

    category: varchar('category', { length: 100 }),
    modality: varchar('modality', { length: 50 }),

    // Vector embeddings for semantic search
    embedding: vector('embedding', { dimensions: 1536 }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    radlexIdIdx: index('radlex_id_idx').on(table.radlexId),
    modalityIdx: index('modality_idx').on(table.modality),
    embeddingIdx: index('embedding_idx').using('hnsw', table.embedding),
  })
);

export const insertRadlexTermSchema = createInsertSchema(radlexTerms);
export const selectRadlexTermSchema = createSelectSchema(radlexTerms);
export type RadlexTerm = z.infer<typeof selectRadlexTermSchema>;

// ==================== PACS Worklist ====================
export const pacsWorklist = pgTable(
  'pacs_worklist',
  {
    id: text('id').primaryKey().$defaultFn(() => generateId('pacs')),

    // Patient Info
    patientId: varchar('patient_id', { length: 100 }).notNull(),
    patientName: varchar('patient_name', { length: 255 }).notNull(),
    patientBirthDate: varchar('patient_birth_date', { length: 20 }),
    patientSex: varchar('patient_sex', { length: 10 }),

    // Study Info
    studyInstanceUid: varchar('study_instance_uid', { length: 255 }).notNull().unique(),
    studyDate: varchar('study_date', { length: 20 }),
    studyTime: varchar('study_time', { length: 20 }),
    modality: varchar('modality', { length: 50 }),
    studyDescription: text('study_description'),

    // Accession
    accessionNumber: varchar('accession_number', { length: 100 }),

    // Status
    status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, in_progress, completed

    // DICOM Data (cached)
    dicomData: jsonb('dicom_data'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    patientIdIdx: index('patient_id_idx').on(table.patientId),
    studyUidIdx: index('study_uid_idx').on(table.studyInstanceUid),
    statusIdx: index('status_idx').on(table.status),
  })
);

export const insertPacsWorklistSchema = createInsertSchema(pacsWorklist);
export const selectPacsWorklistSchema = createSelectSchema(pacsWorklist);
export type PacsWorklist = z.infer<typeof selectPacsWorklistSchema>;

// ==================== Radiology Reports ====================
export const radiologyReports = pgTable(
  'radiology_reports',
  {
    id: text('id').primaryKey().$defaultFn(() => generateId('report')),

    // Link to worklist
    pacsWorklistId: text('pacs_worklist_id').references(() => pacsWorklist.id, { onDelete: 'cascade' }),

    // Report Content
    content: jsonb('content').$type<{
      technique?: string;
      findings?: string;
      impression?: string;
      [key: string]: string | undefined;
    }>(),

    // Template used
    templateId: text('template_id').references(() => reportTemplates.id),

    // Author
    authorId: text('author_id').references(() => users.id).notNull(),

    // Status
    status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, final, signed

    // PDF
    pdfUrl: text('pdf_url'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    signedAt: timestamp('signed_at'),
  },
  (table) => ({
    authorIdIdx: index('author_id_idx').on(table.authorId),
    statusIdx: index('report_status_idx').on(table.status),
  })
);

export const insertRadiologyReportSchema = createInsertSchema(radiologyReports);
export const selectRadiologyReportSchema = createSelectSchema(radiologyReports);
export type RadiologyReport = z.infer<typeof selectRadiologyReportSchema>;
