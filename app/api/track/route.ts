import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

const ALLOWED_ACTIONS = new Set([
  'section_viewed',
  'gift_viewed',
  'external_link',
  'plus_one_response',
]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.action) {
    return NextResponse.json({ error: 'Missing slug or action' }, { status: 400 });
  }
  if (!ALLOWED_ACTIONS.has(body.action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const { data: guest } = await supabase
    .from('guests')
    .select('id')
    .eq('slug', body.slug)
    .single();

  if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

  await supabase.from('activity_log').insert({
    guest_id: guest.id,
    action: body.action,
    metadata: body.metadata ?? null,
    user_agent: req.headers.get('user-agent'),
  });

  return NextResponse.json({ ok: true });
}
