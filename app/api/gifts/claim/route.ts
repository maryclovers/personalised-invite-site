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

  // Atomic claim — only succeeds if claimed_by is still NULL
  const { data: updated, error } = await supabase
    .from('gifts')
    .update({ claimed_by: guest.id, claimed_at: new Date().toISOString() })
    .eq('id', body.gift_id)
    .is('claimed_by', null)
    .select('id')
    .maybeSingle();

  if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 });

  if (!updated) {
    // Race condition — someone else just claimed it
    await supabase.from('activity_log').insert({
      guest_id: guest.id,
      action: 'gift_claim_lost',
      metadata: { gift_id: body.gift_id },
    });
    return NextResponse.json({ success: false, reason: 'race_condition' }, { status: 409 });
  }

  await supabase.from('activity_log').insert({
    guest_id: guest.id,
    action: 'gift_claimed',
    metadata: { gift_id: body.gift_id },
  });

  return NextResponse.json({ success: true });
}
