import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { vector } from 'drizzle-orm/pg-core';

import * as schema from './schemas/serenvale';

// PGLite client for browser-based database
let pgliteClient: PGlite | null = null;

export async function getPGliteClient() {
  if (!pgliteClient) {
    pgliteClient = new PGlite({
      dataDir: 'idb://serenvale-db',
      extensions: {
        vector: true, // Enable pgvector extension
      },
    });
  }
  return pgliteClient;
}

export async function getDB() {
  const client = await getPGliteClient();
  return drizzle(client, { schema });
}

export type DB = Awaited<ReturnType<typeof getDB>>;
