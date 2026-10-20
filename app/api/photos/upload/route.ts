import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

const BUCKET = 'event-photos';
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: 'Missing file or slug' }, { status: 400 });
    }

    // Validate guest
    const { data: guest } = await supabase
      .from('guests')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!guest) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 100 MB)' }, { status: 413 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${guest.id}/${timestamp}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, path });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
