'use client';
import { motion } from 'framer-motion';
import { useTrackSection, useTrack } from '@/lib/tracking';

// ← paste the shared Google Drive folder link here when ready
const DRIVE_URL = '';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function DriveIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8.5 0H15.5L24 15H17L8.5 0Z" fill="#FFBA00"/>
      <path d="M0 15L8.5 0H15.5L7 15H0Z" fill="#0F9D58"/>
      <path d="M0 15H24L20 21H4L0 15Z" fill="#4285F4"/>
    </svg>
  );
}

export default function PhotosSection() {
  const ref = useTrackSection('photos');
  const track = useTrack();

  return (
    <section ref={ref} className="px-6 py-28 sm:py-36 flex flex-col items-center border-t border-border">
      <motion.div
        className="max-w-xl w-full flex flex-col gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.p className="text-[11px] uppercase tracking-[0.35em] text-gold" variants={fadeUp}>
          photos
        </motion.p>

        <motion.div className="flex flex-col gap-4" variants={fadeUp}>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
            The night, captured.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Everyone&apos;s photos from the evening, all in one place. After the dinner,
            everything goes into this shared Google Drive.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          {DRIVE_URL ? (
            <a
              href={DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('external_link', { label: 'google_drive_photos', url: DRIVE_URL })}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-border hover:border-foreground/20 transition-colors bg-card"
            >
              <DriveIcon />
              <span className="text-sm text-foreground font-medium">Open in Google Drive</span>
              <span className="text-muted-foreground text-sm">↗</span>
            </a>
          ) : (
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-card opacity-50">
              <DriveIcon />
              <span className="text-sm text-muted-foreground">Google Drive link coming soon</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
