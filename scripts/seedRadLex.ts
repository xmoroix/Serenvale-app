/**
 * Seed RadLex Medical Terminology into Database
 *
 * This script populates the radlex_terms table with medical terminology
 * and generates embeddings for semantic search.
 *
 * Usage: npm run seed:radlex
 */

import { OpenAI } from 'openai';
import { getDB, radlexTerms } from '../src/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RadLexEntry {
  radlexId: string;
  term: string;
  termFr: string;
  definition: string;
  definitionFr: string;
  category: string;
  modality: string;
}

// Sample RadLex terms for seeding
const sampleTerms: RadLexEntry[] = [
  {
    radlexId: 'RID58',
    term: 'Brain',
    termFr: 'Cerveau',
    definition: 'The part of the central nervous system enclosed in the cranium',
    definitionFr: 'Partie du système nerveux central enfermée dans le crâne',
    category: 'Anatomy',
    modality: 'irm',
  },
  {
    radlexId: 'RID1243',
    term: 'Cerebral infarction',
    termFr: 'Infarctus cérébral',
    definition: 'An area of necrosis in the brain resulting from ischemia',
    definitionFr: 'Zone de nécrose dans le cerveau résultant d\'une ischémie',
    category: 'Pathology',
    modality: 'irm',
  },
  {
    radlexId: 'RID5825',
    term: 'Liver',
    termFr: 'Foie',
    definition: 'Large organ in the upper right abdomen',
    definitionFr: 'Grand organe dans la partie supérieure droite de l\'abdomen',
    category: 'Anatomy',
    modality: 'tdm',
  },
  {
    radlexId: 'RID28473',
    term: 'Hepatic lesion',
    termFr: 'Lésion hépatique',
    definition: 'An abnormality found in the liver',
    definitionFr: 'Anomalie trouvée dans le foie',
    category: 'Pathology',
    modality: 'tdm',
  },
  {
    radlexId: 'RID1385',
    term: 'Heart',
    termFr: 'Cœur',
    definition: 'Muscular organ that pumps blood',
    definitionFr: 'Organe musculaire qui pompe le sang',
    category: 'Anatomy',
    modality: 'echo',
  },
  {
    radlexId: 'RID34820',
    term: 'Pericardial effusion',
    termFr: 'Épanchement péricardique',
    definition: 'Abnormal accumulation of fluid in the pericardial cavity',
    definitionFr: 'Accumulation anormale de liquide dans la cavité péricardique',
    category: 'Pathology',
    modality: 'echo',
  },
  {
    radlexId: 'RID2468',
    term: 'Lung',
    termFr: 'Poumon',
    definition: 'Organ of respiration in the thorax',
    definitionFr: 'Organe de la respiration dans le thorax',
    category: 'Anatomy',
    modality: 'xr',
  },
  {
    radlexId: 'RID4778',
    term: 'Pneumonia',
    termFr: 'Pneumonie',
    definition: 'Inflammatory condition of the lung',
    definitionFr: 'Condition inflammatoire du poumon',
    category: 'Pathology',
    modality: 'xr',
  },
];

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return zero vector on error
    return new Array(1536).fill(0);
  }
}

async function seedRadLex() {
  console.log('🌱 Starting RadLex seeding...');

  const db = await getDB();

  for (const term of sampleTerms) {
    console.log(`Processing: ${term.term} (${term.radlexId})`);

    // Generate embedding from combined English + French text
    const textToEmbed = `${term.term} ${term.termFr} ${term.definition} ${term.definitionFr}`;
    const embedding = await generateEmbedding(textToEmbed);

    // Insert into database
    await db.insert(radlexTerms).values({
      radlexId: term.radlexId,
      term: term.term,
      termFr: term.termFr,
      definition: term.definition,
      definitionFr: term.definitionFr,
      category: term.category,
      modality: term.modality,
      embedding: embedding,
    });

    console.log(`✅ Inserted: ${term.term}`);
  }

  console.log(`\n🎉 Successfully seeded ${sampleTerms.length} RadLex terms!`);
}

// Run the seeder
seedRadLex().catch((error) => {
  console.error('❌ Error seeding RadLex:', error);
  process.exit(1);
});
