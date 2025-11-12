/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { index, jsonb, pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { idGenerator } from '../utils/idGenerator';
import { timestamps, varchar255 } from './_helpers';
import { users } from './user';

/**
 * Radiology reports table for Serenvale
 * Stores patient examination reports with metadata
 */
export const radiologyReports = pgTable(
  'radiology_reports',
  {
    id: varchar255('id')
      .primaryKey()
      .$defaultFn(() => idGenerator('reports'))
      .notNull(),

    // Patient Information
    patientId: varchar255('patient_id').notNull(),
    patientName: text('patient_name').notNull(),
    patientAge: text('patient_age'),
    patientDob: text('patient_dob'), // Date of birth

    // Exam Information
    examType: varchar255('exam_type').notNull(), // Internal: 'irm-cerebrale', 'tdm-thorax', etc.
    examTypeDisplay: text('exam_type_display').notNull(), // Display: 'IRM Cérébrale', etc.
    examDate: text('exam_date').notNull(),
    accessionNumber: varchar255('accession_number'), // DICOM Accession Number
    studyInstanceUid: text('study_instance_uid'), // DICOM Study Instance UID

    // Clinical Information
    referringDoctor: text('referring_doctor'),
    clinicalIndication: text('clinical_indication'), // Reason for exam

    // Report Content
    dictationText: text('dictation_text'), // Original dictation
    reportContent: text('report_content').notNull(), // Final formatted report
    findings: text('findings'), // Structured findings section
    conclusion: text('conclusion'), // Conclusion section
    recommendations: text('recommendations'), // Follow-up recommendations

    // Report Status
    status: varchar255('status').notNull().default('draft'), // draft, completed, signed, amended
    completedAt: text('completed_at'), // When marked as done
    signedAt: text('signed_at'), // When digitally signed
    signedBy: text('signed_by'), // Doctor who signed

    // AI Generation Metadata
    aiModelUsed: varchar255('ai_model_used'), // Which model generated the report
    modalityAgent: varchar255('modality_agent'), // Which agent (irm, tdm, echo, xr)
    ragChunksUsed: jsonb('rag_chunks_used').$type<string[]>(), // Which RAG chunks were retrieved

    // Metadata
    metadata: jsonb('metadata').$type<{
      facility?: string;
      department?: string;
      technique?: string;
      contrast?: string;
      [key: string]: any;
    }>(),

    // User Association
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index('radiology_reports_user_id_idx').on(t.userId),
    index('radiology_reports_patient_id_idx').on(t.patientId),
    index('radiology_reports_exam_type_idx').on(t.examType),
    index('radiology_reports_status_idx').on(t.status),
    index('radiology_reports_study_uid_idx').on(t.studyInstanceUid),
    uniqueIndex('radiology_reports_accession_number_user_id_unique').on(
      t.accessionNumber,
      t.userId,
    ),
  ],
);

export type RadiologyReport = typeof radiologyReports.$inferSelect;
export type NewRadiologyReport = typeof radiologyReports.$inferInsert;

export const insertRadiologyReportSchema = createInsertSchema(radiologyReports);
export const selectRadiologyReportSchema = createSelectSchema(radiologyReports);

/**
 * PACS worklist table (optional - for caching PACS queries)
 * Stores patient worklist entries from DICOM C-FIND queries
 */
export const pacsWorklist = pgTable(
  'pacs_worklist',
  {
    id: varchar255('id')
      .primaryKey()
      .$defaultFn(() => idGenerator('worklist'))
      .notNull(),

    // DICOM Worklist Fields
    patientId: varchar255('patient_id').notNull(),
    patientName: text('patient_name').notNull(),
    patientAge: text('patient_age'),
    patientDob: text('patient_dob'),
    patientSex: varchar255('patient_sex'),

    // Study Information
    studyInstanceUid: text('study_instance_uid').notNull(),
    accessionNumber: varchar255('accession_number'),
    studyDate: text('study_date'),
    studyTime: text('study_time'),
    studyDescription: text('study_description'),
    modality: varchar255('modality'), // MR, CT, US, CR, DX, etc.

    // Scheduling
    scheduledProcedureStepStartDate: text('scheduled_procedure_step_start_date'),
    scheduledProcedureStepStartTime: text('scheduled_procedure_step_start_time'),
    scheduledProcedureStepDescription: text('scheduled_procedure_step_description'),

    // Additional DICOM Tags
    referringPhysician: text('referring_physician'),
    requestingPhysician: text('requesting_physician'),
    admittingDiagnosis: text('admitting_diagnosis'),

    // Metadata
    rawDicomData: jsonb('raw_dicom_data'), // Full DICOM dataset
    pacsServer: varchar255('pacs_server'), // Which PACS server this came from

    // User Association (for multi-user server mode)
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

    ...timestamps,
  },
  (t) => [
    index('pacs_worklist_user_id_idx').on(t.userId),
    index('pacs_worklist_patient_id_idx').on(t.patientId),
    index('pacs_worklist_study_uid_idx').on(t.studyInstanceUid),
    index('pacs_worklist_study_date_idx').on(t.studyDate),
    uniqueIndex('pacs_worklist_study_uid_user_id_unique').on(t.studyInstanceUid, t.userId),
  ],
);

export type PacsWorklistEntry = typeof pacsWorklist.$inferSelect;
export type NewPacsWorklistEntry = typeof pacsWorklist.$inferInsert;

export const insertPacsWorklistSchema = createInsertSchema(pacsWorklist);
export const selectPacsWorklistSchema = createSelectSchema(pacsWorklist);
