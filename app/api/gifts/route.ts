import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const { data: guest } = await supabase
    .from('guests')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

  const { data: gifts, error } = await supabase
    .from('gifts')
    .select('*')
    .order('display_order');

  if (error) return NextResponse.json({ error: 'Failed to load gifts' }, { status: 500 });

  const result = gifts.map((g: Record<string, unknown>) => {
    const isMine = g.claimed_by === guest.id;
    const isClaimed = g.claimed_by !== null;
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      category: g.category,
      price_estimate: g.price_estimate,
      image_url: g.image_url,
      purchase_link: g.purchase_link,
      claimable: g.claimable,
      is_claimed: isClaimed,
      is_mine: isMine,
      display_order: g.display_order,
    };
  });

  return NextResponse.json({ gifts: result, guest_id: guest.id });
}
