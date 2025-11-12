CREATE TABLE "pacs_worklist" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"patient_name" text NOT NULL,
	"patient_age" text,
	"patient_dob" text,
	"patient_sex" varchar(255),
	"study_instance_uid" text NOT NULL,
	"accession_number" varchar(255),
	"study_date" text,
	"study_time" text,
	"study_description" text,
	"modality" varchar(255),
	"scheduled_procedure_step_start_date" text,
	"scheduled_procedure_step_start_time" text,
	"scheduled_procedure_step_description" text,
	"referring_physician" text,
	"requesting_physician" text,
	"admitting_diagnosis" text,
	"raw_dicom_data" jsonb,
	"pacs_server" varchar(255),
	"user_id" text,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "radiology_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"patient_name" text NOT NULL,
	"patient_age" text,
	"patient_dob" text,
	"exam_type" varchar(255) NOT NULL,
	"exam_type_display" text NOT NULL,
	"exam_date" text NOT NULL,
	"accession_number" varchar(255),
	"study_instance_uid" text,
	"referring_doctor" text,
	"clinical_indication" text,
	"dictation_text" text,
	"report_content" text NOT NULL,
	"findings" text,
	"conclusion" text,
	"recommendations" text,
	"status" varchar(255) DEFAULT 'draft' NOT NULL,
	"completed_at" text,
	"signed_at" text,
	"signed_by" text,
	"ai_model_used" varchar(255),
	"modality_agent" varchar(255),
	"rag_chunks_used" jsonb,
	"metadata" jsonb,
	"user_id" text NOT NULL,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinic_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"nif" varchar(255),
	"logo" text,
	"letterhead_html" text,
	"footer_html" text,
	"pacs_config" jsonb,
	"ai_config" jsonb,
	"printer_config" jsonb,
	"theme" jsonb,
	"user_id" text NOT NULL,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"specialty" text,
	"license_number" varchar(255),
	"signature" text,
	"stamp" text,
	"default_language" varchar(255) DEFAULT 'fr',
	"default_template" varchar(255),
	"voice_settings" jsonb,
	"user_id" text NOT NULL,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "radlex_terms" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"radlex_id" varchar(255),
	"term" text NOT NULL,
	"term_fr" text,
	"definition" text,
	"definition_fr" text,
	"category" varchar(255),
	"modality" varchar(255),
	"body_part" varchar(255),
	"embedding_en" vector(1536),
	"embedding_fr" vector(1536),
	"synonyms" jsonb,
	"related_terms" jsonb,
	"usage_frequency" text,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_templates" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"modality" varchar(255) NOT NULL,
	"language" varchar(255) DEFAULT 'fr' NOT NULL,
	"header" text,
	"footer" text,
	"structure" jsonb,
	"agent_id" varchar(255),
	"system_prompt" text,
	"rag_filter" jsonb,
	"is_default" text DEFAULT 'false',
	"is_active" text DEFAULT 'true',
	"user_id" text,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pacs_worklist" ADD CONSTRAINT "pacs_worklist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_reports" ADD CONSTRAINT "radiology_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_settings" ADD CONSTRAINT "clinic_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_settings" ADD CONSTRAINT "doctor_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pacs_worklist_user_id_idx" ON "pacs_worklist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pacs_worklist_patient_id_idx" ON "pacs_worklist" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "pacs_worklist_study_uid_idx" ON "pacs_worklist" USING btree ("study_instance_uid");--> statement-breakpoint
CREATE INDEX "pacs_worklist_study_date_idx" ON "pacs_worklist" USING btree ("study_date");--> statement-breakpoint
CREATE UNIQUE INDEX "pacs_worklist_study_uid_user_id_unique" ON "pacs_worklist" USING btree ("study_instance_uid","user_id");--> statement-breakpoint
CREATE INDEX "radiology_reports_user_id_idx" ON "radiology_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "radiology_reports_patient_id_idx" ON "radiology_reports" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "radiology_reports_exam_type_idx" ON "radiology_reports" USING btree ("exam_type");--> statement-breakpoint
CREATE INDEX "radiology_reports_status_idx" ON "radiology_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "radiology_reports_study_uid_idx" ON "radiology_reports" USING btree ("study_instance_uid");--> statement-breakpoint
CREATE UNIQUE INDEX "radiology_reports_accession_number_user_id_unique" ON "radiology_reports" USING btree ("accession_number","user_id");--> statement-breakpoint
CREATE INDEX "clinic_settings_user_id_idx" ON "clinic_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "doctor_settings_user_id_idx" ON "doctor_settings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "doctor_settings_user_id_unique" ON "doctor_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "radlex_terms_modality_idx" ON "radlex_terms" USING btree ("modality");--> statement-breakpoint
CREATE INDEX "radlex_terms_category_idx" ON "radlex_terms" USING btree ("category");--> statement-breakpoint
CREATE INDEX "radlex_terms_body_part_idx" ON "radlex_terms" USING btree ("body_part");--> statement-breakpoint
CREATE UNIQUE INDEX "radlex_terms_radlex_id_unique" ON "radlex_terms" USING btree ("radlex_id");--> statement-breakpoint
CREATE INDEX "report_templates_modality_idx" ON "report_templates" USING btree ("modality");--> statement-breakpoint
CREATE INDEX "report_templates_user_id_idx" ON "report_templates" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "report_templates_name_user_id_unique" ON "report_templates" USING btree ("name","user_id");