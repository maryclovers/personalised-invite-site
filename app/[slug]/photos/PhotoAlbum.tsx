'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoItem {
  url: string;
  name: string;
  type: 'image' | 'video';
}

interface Props {
  slug: string;
  guestName: string;
  postEvent: boolean;
}

export default function PhotoAlbum({ slug, guestName, postEvent }: Props) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(postEvent);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/photos/list?slug=${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setPhotos(data.photos ?? []);
    } catch {
      // silent
    } finally {
      setLoadingPhotos(false);
    }
  }, [slug]);

  useEffect(() => {
    if (postEvent) fetchPhotos();
  }, [postEvent, fetchPhotos]);

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (!arr.length) return;
    setUploading(true);
    setUploadError(null);
    setUploadDone(false);
    try {
      for (const file of arr) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slug);
        const res = await fetch('/api/photos/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? 'Upload failed');
        }
      }
      setUploadDone(true);
      await fetchPhotos();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 py-8 border-b border-border flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold">photo album</p>
          <h1 className="font-display text-2xl text-foreground">MaryClovers&apos; birthday</h1>
        </div>
        <a
          href={`/${slug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to invite
        </a>
      </header>

      <main className="px-6 py-12 max-w-3xl mx-auto flex flex-col gap-12">

        {!postEvent ? (
          /* Pre-event: coming soon */
          <motion.div
            className="flex flex-col items-center gap-6 py-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-5xl">📸</span>
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-3xl sm:text-4xl text-foreground">Photos coming soon.</h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                After the dinner on 18 June, this is where we&apos;ll keep all the photos and
                videos from the night.
              </p>
              <p className="text-muted-foreground/60 text-sm">
                Everyone can add their own. No Instagram required.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Post-event: upload + grid */
          <>
            {/* Upload area */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold">add your photos</p>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-gold bg-gold/5'
                    : 'border-border hover:border-gold/40 hover:bg-card/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <span className="text-4xl">{uploading ? '⏳' : '📷'}</span>
                <div className="flex flex-col gap-1">
                  <p className="text-foreground font-medium text-sm">
                    {uploading ? 'Uploading…' : 'Drop photos & videos here'}
                  </p>
                  <p className="text-muted-foreground text-xs">or click to choose from your camera roll</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>

              <AnimatePresence>
                {uploadDone && (
                  <motion.p
                    className="text-sm text-foreground/70"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Added. ✓
                  </motion.p>
                )}
                {uploadError && (
                  <motion.p
                    className="text-sm text-destructive"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {uploadError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Photo grid */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold">from the night</p>

              {loadingPhotos ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-card border border-border animate-pulse" />
                  ))}
                </div>
              ) : photos.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nothing here yet. Be the first to add a photo.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo, i) => (
                    <motion.div
                      key={photo.name}
                      className="aspect-square rounded-xl overflow-hidden border border-border cursor-pointer bg-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                      onClick={() => setLightbox(photo)}
                      whileHover={{ scale: 1.02 }}
                    >
                      {photo.type === 'video' ? (
                        <video
                          src={photo.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="max-w-4xl max-h-[90vh] w-full"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.type === 'video' ? (
                <video
                  src={lightbox.url}
                  className="w-full max-h-[85vh] rounded-xl object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={lightbox.url}
                  alt=""
                  className="w-full max-h-[85vh] rounded-xl object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
