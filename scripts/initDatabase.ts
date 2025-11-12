/**
 * Database Initialization Script for Serenvale
 *
 * This script:
 * 1. Initializes PGLite database with vector extension
 * 2. Runs all migrations including Serenvale schema
 * 3. Verifies tables are created
 *
 * Usage: tsx scripts/initDatabase.ts
 */

import { DatabaseManager } from '@/database/client/db';

async function initDatabase() {
  console.log('🚀 Starting Serenvale database initialization...\n');

  try {
    // Initialize PGLite with callbacks
    const dbManager = DatabaseManager.getInstance();

    const db = await dbManager.initDatabase({
      onStateChange: (state) => {
        console.log(`📊 State: ${state}`);
      },
      onProgress: (progress) => {
        if (progress.phase === 'applyingMigrations') {
          console.log(`⚡ Migrating: ${progress.currentMigration}/${progress.totalMigrations}`);
        }
      },
      onError: (error) => {
        console.error('❌ Error:', error.error.message);
      },
    });

    console.log('\n✅ Database initialized successfully!');
    console.log('\n📋 Verifying Serenvale tables...');

    // Verify Serenvale tables exist
    const tables = [
      'users',
      'clinic_settings',
      'doctor_settings',
      'report_templates',
      'radlex_terms',
      'pacs_worklist',
      'radiology_reports',
    ];

    for (const table of tables) {
      try {
        const result = await db.execute({
          sql: `SELECT COUNT(*) FROM ${table}`,
          args: [],
        });
        console.log(`✅ ${table}: Ready (${result.rows[0]?.count || 0} records)`);
      } catch (error) {
        console.log(`❌ ${table}: Not found`);
      }
    }

    console.log('\n🎉 Serenvale database is ready!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run seed:radlex (to populate medical terminology)');
    console.log('2. Run: npm run dev (to start the application)');

  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initDatabase();
