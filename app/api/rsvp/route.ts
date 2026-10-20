import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  let body: { slug?: string; decision?: string } = {};
  try { body = await req.json(); } catch { /* bad json */ }

  const { slug, decision } = body;

  if (!slug || (decision !== 'yes' && decision !== 'no')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { data: guest } = await supabase
    .from('guests')
    .select('id, rsvp_status')
    .eq('slug', slug)
    .single();

  if (!guest) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const prevStatus = guest.rsvp_status;
  const action = prevStatus !== 'pending' ? 'rsvp_changed' : `rsvp_${decision}`;

  const { error } = await supabase
    .from('guests')
    .update({ rsvp_status: decision, rsvp_at: new Date().toISOString() })
    .eq('id', guest.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  await supabase.from('activity_log').insert({
    guest_id: guest.id,
    action,
    metadata: prevStatus !== 'pending' ? { from: prevStatus, to: decision } : null,
    user_agent: req.headers.get('user-agent'),
  });

  return NextResponse.json({ success: true, rsvp_status: decision });
}
