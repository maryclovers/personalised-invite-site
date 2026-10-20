'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlug } from '@/lib/tracking';

export default function SiteFooter() {
  const slug = useSlug();
  const [step, setStep] = useState<'idle' | 'confirm' | 'done'>('idle');
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, decision: 'no' }),
      });
      setStep('done');
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="px-6 py-16 border-t border-border flex flex-col items-center gap-6 text-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.button
              key="idle"
              onClick={() => setStep('confirm')}
              className="text-muted-foreground/40 text-xs hover:text-muted-foreground/70 transition-colors underline underline-offset-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Can no longer make it?
            </motion.button>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-muted-foreground text-sm">Are you sure you can&apos;t make it?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="text-xs px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Yes, cancel my spot'}
                </button>
                <button
                  onClick={() => setStep('idle')}
                  className="text-xs px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors"
                >
                  Actually I&apos;m still coming
                </button>
              </div>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.p
              key="done"
              className="text-muted-foreground/60 text-sm font-display italic"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Noted. You&apos;ll be missed.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-muted-foreground/40 text-sm">prn</p>
      </motion.div>
    </footer>
  );
}
