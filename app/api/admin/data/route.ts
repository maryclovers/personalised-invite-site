import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/server';

async function isAuthed() {
  const store = await cookies();
  return store.get('admin_session')?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(_req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [guestsRes, activityRes, giftsRes] = await Promise.all([
    supabase.from('guests').select('*').neq('relationship', 'view_only').neq('relationship', 'revoked').order('created_at'),
    supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('gifts').select('*').order('display_order'),
  ]);

  const guests = guestsRes.data ?? [];
  const activity = activityRes.data ?? [];
  const giftsRaw = giftsRes.data ?? [];

  const guestMap = new Map(guests.map((g) => [g.id, g.name]));

  const gifts = giftsRaw.map((g) => ({
    id: g.id,
    name: g.name,
    category: g.category,
    price_estimate: g.price_estimate,
    purchase_link: g.purchase_link,
    claimable: g.claimable,
    is_claimed: g.claimed_by !== null,
    claimed_by_name: g.claimed_by ? (guestMap.get(g.claimed_by) ?? 'Unknown') : null,
    claimed_at: g.claimed_at,
    marked_received: g.marked_received,
    display_order: g.display_order,
  }));

  const activityWithNames = activity.map((a) => ({
    ...a,
    guest_name: guestMap.get(a.guest_id) ?? 'Unknown',
  }));

  return NextResponse.json({ guests, activity: activityWithNames, gifts });
}
