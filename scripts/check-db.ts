/**
 * Quick sanity check — run after applying the migration.
 * Usage: npx tsx scripts/check-db.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const tables = ['guests', 'gifts', 'activity_log'];
  let allGood = true;

  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1);
    if (error) {
      console.error(`✗ ${table}: ${error.message}`);
      allGood = false;
    } else {
      console.log(`✓ ${table}`);
    }
  }

  if (allGood) {
    console.log('\nDatabase is ready. Run the seed script next:\n  npm run seed -- --guests guests.json --gifts gifts.json --ai\n');
  } else {
    console.log('\nRun the migration first — paste supabase/migrations/001_initial_schema.sql into your Supabase SQL editor.\n');
  }
}

main().catch(console.error);
