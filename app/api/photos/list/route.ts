import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

const BUCKET = 'event-photos';
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'avif']);
const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'webm', 'm4v', '3gp']);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
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

  // List all files in bucket (across all guest folders)
  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: 500, sortBy: { column: 'created_at', order: 'asc' } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Each top-level entry is a guest folder — recurse one level
  const allPhotos: { url: string; name: string; type: 'image' | 'video' }[] = [];

  for (const folder of files ?? []) {
    if (!folder.id) {
      // It's a folder prefix — list its contents
      const { data: folderFiles } = await supabase.storage
        .from(BUCKET)
        .list(folder.name, { limit: 500, sortBy: { column: 'created_at', order: 'asc' } });

      for (const f of folderFiles ?? []) {
        const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
        const type: 'image' | 'video' = VIDEO_EXTS.has(ext) ? 'video' : 'image';
        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(`${folder.name}/${f.name}`);
        allPhotos.push({ url: urlData.publicUrl, name: `${folder.name}/${f.name}`, type });
      }
    } else {
      // It's a direct file (shouldn't happen but handle gracefully)
      const ext = folder.name.split('.').pop()?.toLowerCase() ?? '';
      const type: 'image' | 'video' = VIDEO_EXTS.has(ext) ? 'video' : 'image';
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(folder.name);
      allPhotos.push({ url: urlData.publicUrl, name: folder.name, type });
    }
  }

  return NextResponse.json({ photos: allPhotos });
}
