import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.gift_id) {
    return NextResponse.json({ error: 'Missing slug or gift_id' }, { status: 400 });
  }

  const { data: guest } = await supabase
    .from('guests')
    .select('id')
    .eq('slug', body.slug)
    .single();

  if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

  // Only the original claimant can unclaim
  const { data: updated, error } = await supabase
    .from('gifts')
    .update({ claimed_by: null, claimed_at: null })
    .eq('id', body.gift_id)
    .eq('claimed_by', guest.id)
    .select('id')
    .maybeSingle();

  if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 });

  if (!updated) {
    return NextResponse.json({ error: 'Not your claim' }, { status: 403 });
  }

  await supabase.from('activity_log').insert({
    guest_id: guest.id,
    action: 'gift_unclaimed',
    metadata: { gift_id: body.gift_id },
  });

  return NextResponse.json({ success: true });
}
