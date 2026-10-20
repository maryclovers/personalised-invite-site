import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase/server';
import InviteClient from './InviteClient';
import type { Metadata } from 'next';
import type { RsvpStatus } from '@/lib/supabase/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: guest } = await supabase
    .from('guests')
    .select('name')
    .eq('slug', slug)
    .single();

  if (!guest) return { title: "You're invited" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const title = `${guest.name} is invited`;
  return {
    title,
    openGraph: {
      title,
      description: "Mary Clovers's Birthday Dinner — 18 June 2026",
      images: [`${baseUrl}/api/og/${slug}`],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params;
  const h = await headers();
  const ua = h.get('user-agent');

  const { data: guest } = await supabase
    .from('guests')
    .select('id, slug, name, personalised_message, rsvp_status, relationship, opened_at, created_at')
    .eq('slug', slug)
    .single();

  if (!guest) notFound();

  const now = new Date().toISOString();
  if (!guest.opened_at) {
    await Promise.all([
      supabase.from('guests').update({ opened_at: now }).eq('id', guest.id),
      supabase.from('activity_log').insert({ guest_id: guest.id, action: 'page_opened', user_agent: ua }),
    ]);
  } else {
    await supabase.from('activity_log').insert({ guest_id: guest.id, action: 'page_returned', user_agent: ua });
  }

  // Manually uninvited guests (relationship = 'revoked') always see the revoked screen.
  // After the RSVP deadline, guests who were invited before the deadline and never responded also see it.
  const RSVP_DEADLINE = new Date('2026-06-04T23:59:59.000Z');
  const invitedBeforeDeadline = new Date(guest.created_at) < RSVP_DEADLINE;
  const effectiveStatus: RsvpStatus =
    guest.relationship === 'revoked'
      ? 'revoked'
      : (guest.rsvp_status === 'pending' && new Date() > RSVP_DEADLINE && invitedBeforeDeadline)
        ? 'revoked'
        : (guest.rsvp_status as RsvpStatus);

  return (
    <InviteClient
      slug={guest.slug}
      name={guest.name}
      message={guest.personalised_message}
      initialStatus={effectiveStatus}
    />
  );
}
