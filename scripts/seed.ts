/**
 * Seed script — run with: npx tsx scripts/seed.ts
 *
 * Usage:
 *   npx tsx scripts/seed.ts --guests guests.json --gifts gifts.json [--ai]
 *
 * --ai  calls the Anthropic API to generate one personalised welcome line per guest.
 *       Omit to skip AI generation (message will be null).
 *
 * Output: seed-output.csv  (name, slug, full_url, whatsapp_message)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import Anthropic from '@anthropic-ai/sdk';

// ─── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL            = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY       = process.env.ANTHROPIC_API_KEY;
const BASE_URL                = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://marycloversbday.vercel.app';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface GuestInput {
  name: string;
  relationship?: string;
}

interface GiftInput {
  name: string;
  description?: string;
  category?: string;
  price_estimate?: number | null;
  image_url?: string | null;
  purchase_link?: string | null;
  claimable?: boolean;
  display_order?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function generateSlug(): string {
  const bytes = randomBytes(12);
  return Array.from(bytes)
    .map((b) => SLUG_CHARS[b % SLUG_CHARS.length])
    .join('');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function generateWelcomeLine(
  name: string,
  relationship: string | undefined,
  client: Anthropic
): Promise<string> {
  const prompt = [
    `Write a single warm, personal welcome line for a birthday dinner invitation.`,
    `Guest name: ${name}`,
    relationship ? `Their relationship to the host: ${relationship}` : '',
    ``,
    `Rules:`,
    `- One sentence only, no more.`,
    `- Sound like the host is talking directly to this person. Warm but not over-the-top.`,
    `- Use the host's voice: direct, conversational, short sentences, no corporate words.`,
    `- Do NOT mention the relationship label directly (don't say "my sister" or "my best friend").`,
    `- Do NOT start with "Hey" or "Hi".`,
    `- Make it feel like it was written just for this person.`,
    `Output only the welcome line. No quotes, no preamble.`,
  ]
    .filter(Boolean)
    .join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Anthropic');
  return content.text.trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const guestsFlag = args.indexOf('--guests');
  const giftsFlag  = args.indexOf('--gifts');
  const useAI      = args.includes('--ai');

  const guestsPath = guestsFlag !== -1 ? args[guestsFlag + 1] : 'guests.json';
  const giftsPath  = giftsFlag  !== -1 ? args[giftsFlag  + 1] : 'gifts.json';

  let guestInputs: GuestInput[];
  let giftInputs: GiftInput[];

  try {
    guestInputs = JSON.parse(readFileSync(resolve(guestsPath), 'utf-8'));
  } catch {
    console.error(`Could not read guests file: ${guestsPath}`);
    process.exit(1);
  }

  try {
    giftInputs = JSON.parse(readFileSync(resolve(giftsPath), 'utf-8'));
  } catch {
    console.error(`Could not read gifts file: ${giftsPath}`);
    process.exit(1);
  }

  let anthropic: Anthropic | null = null;
  if (useAI) {
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is required when using --ai');
      process.exit(1);
    }
    anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  }

  console.log(`\nSeeding ${guestInputs.length} guests and ${giftInputs.length} gifts...\n`);

  // ── Insert gifts ────────────────────────────────────────────────────────────
  const { error: giftsError } = await supabase.from('gifts').insert(
    giftInputs.map((g, i) => ({
      name:           g.name,
      description:    g.description ?? null,
      category:       g.category ?? null,
      price_estimate: g.price_estimate ?? null,
      image_url:      g.image_url ?? null,
      purchase_link:  g.purchase_link ?? null,
      claimable:      g.claimable !== false,
      display_order:  g.display_order ?? i,
    }))
  );

  if (giftsError) {
    console.error('Failed to insert gifts:', giftsError.message);
    process.exit(1);
  }
  console.log(`✓ Inserted ${giftInputs.length} gifts`);

  // ── Insert guests ───────────────────────────────────────────────────────────
  const csvRows: string[] = ['name,slug,full_url,whatsapp_message'];

  for (const guest of guestInputs) {
    const slug = generateSlug();
    const url  = `${BASE_URL}/${slug}`;

    let message: string | null = null;
    if (anthropic) {
      try {
        message = await generateWelcomeLine(guest.name, guest.relationship, anthropic);
        console.log(`  AI welcome for ${guest.name}: "${message}"`);
      } catch (err) {
        console.warn(`  Could not generate AI line for ${guest.name}:`, err);
      }
    }

    const { error } = await supabase.from('guests').insert({
      slug,
      name:                 guest.name,
      relationship:         guest.relationship ?? null,
      personalised_message: message,
    });

    if (error) {
      console.error(`Failed to insert guest ${guest.name}:`, error.message);
      continue;
    }

    const firstName     = guest.name.split(' ')[0];
    const whatsappText  = `Hey ${firstName}! 🎂 I'd love for you to come to my birthday dinner. Here's your personal invite: ${url}`;

    csvRows.push([guest.name, slug, url, whatsappText].map(escapeCSV).join(','));
    console.log(`✓ ${guest.name} → ${url}`);
  }

  writeFileSync('seed-output.csv', csvRows.join('\n'), 'utf-8');
  console.log(`\n✓ Done. Links saved to seed-output.csv\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
