import { randomBytes } from 'crypto';

const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_LENGTH = 10;

export function generateSlug(): string {
  const bytes = randomBytes(SLUG_LENGTH);
  return Array.from(bytes)
    .map((b) => SLUG_CHARS[b % SLUG_CHARS.length])
    .join('');
}
