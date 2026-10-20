import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/server';
import PhotoAlbum from './PhotoAlbum';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: 'Photo album',
  robots: { index: false, follow: false },
};

export default async function PhotosPage({ params }: Props) {
  const { slug } = await params;

  const { data: guest } = await supabase
    .from('guests')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!guest) notFound();

  // Event date: 18 June 2026
  const eventDate = new Date('2026-06-18T19:00:00+01:00');
  const now = new Date();
  const postEvent = now >= eventDate;

  return <PhotoAlbum slug={slug} guestName={guest.name} postEvent={postEvent} />;
}
