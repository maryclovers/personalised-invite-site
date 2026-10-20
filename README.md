# Personalised event invitations

A full-stack invitation site I built for my birthday dinner in May 2026. Every guest received a private link with their own name in the invitation, their own preview card when the link was shared on WhatsApp or iMessage, and their own RSVP, so a small guest list behaved like a set of separate pages backed by one database.

Built with Next.js, React, TypeScript, Supabase, Tailwind CSS, Framer Motion and Vercel.

## What it does

- **One link per guest.** A seed script gives every guest a random slug, and the page at `/[slug]` greets them by name. A link that has been withdrawn shows a separate screen.
- **Preview cards per guest.** An Open Graph image is generated on the server for each slug, so the shared link already shows the guest's name before it is opened.
- **RSVP that changes the page.** Pending, yes and no each have their own screen. Plus-ones are allowed or not per guest.
- **Gift registry with private claiming.** Guests can claim a gift so nobody buys the same thing twice. Claims are visible to other guests only as "taken", and the host sees which gifts are claimed without seeing who claimed them.
- **Admin dashboard.** A password-protected page showing RSVPs, which links have been opened and recent activity.
- **Photo album.** After the event, guests upload photos to a shared album.
- **Personal welcome lines.** At seed time, an optional step calls a language model API to write one short welcome line per guest, with rules that keep it warm and avoid naming the relationship.

## How it is built

| Part | Detail |
|---|---|
| Frontend | Next.js App Router, React 19, TypeScript, Tailwind CSS, shadcn components, Framer Motion |
| Data | Supabase (Postgres) with three tables: guests, gifts and an activity log. Schema in `supabase/migrations/` |
| Server routes | RSVP, gift claim and unclaim, activity tracking, photo upload and listing, admin data, Open Graph images |
| Setup | `scripts/seed.ts` loads guests and gifts and writes each guest's link and WhatsApp message to a CSV |
| Hosting | Vercel |

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in your own Supabase and admin values
cp guests.example.json guests.json
npx tsx scripts/seed.ts --guests guests.json --gifts gifts.json
npm run dev
```

The guest list, generated links, event photos and all keys are kept out of this repository. `gifts.json` contains sample entries only. Add your own images to `public/` to restore the photo sections.

## What I learned

- Personalisation has to happen on the server. The preview card is generated before anyone opens the page, so the guest data has to be available to the server route that draws the image.
- Privacy decisions are product decisions. Hiding who claimed each gift, even from the host, needed its own field in the schema and its own logic in the API.
- Secrets belong in environment variables from the first commit, with a `.gitignore` that blocks every `.env` file except the example.

Clovers Akitoye · [GitHub](https://github.com/maryclovers) · [LinkedIn](https://www.linkedin.com/in/cloversakitoye)
