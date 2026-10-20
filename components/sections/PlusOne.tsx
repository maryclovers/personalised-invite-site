'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackSection } from '@/lib/tracking';

interface Props {
  slug: string;
}

export default function PlusOne({ slug }: Props) {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [saving, setSaving] = useState(false);
  const ref = useTrackSection('plus_one');

  async function respond(decision: 'yes' | 'no') {
    setSaving(true);
    setAnswer(decision);
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          action: 'plus_one_response',
          metadata: { wants_plus_one: decision === 'yes' },
        }),
      });
    } catch { /* silent */ }
    setSaving(false);
  }

  return (
    <section ref={ref} className="py-28 sm:py-36 border-t border-border">
      {/* Label */}
      <motion.p
        className="px-6 text-[11px] uppercase tracking-[0.35em] text-gold mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        plus one
      </motion.p>

      {/* Full-bleed couple photo first */}
      <motion.div
        className="relative w-full overflow-hidden mb-16"
        style={{ aspectRatio: '21/9' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="/plus_one.jpg"
          alt="Couple together"
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 72%, #faf9f7 100%)' }} />
      </motion.div>

      {/* Text + interactions */}
      <motion.div
        className="px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-xl w-full flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
              Bringing <em>someone?</em>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              You&apos;re welcome to bring a guest. They&apos;d cover their own meal on the night.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Just let me know so I can make sure the table is big enough.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {answer === null && (
              <motion.div
                key="question"
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-foreground/70 text-sm">Are you thinking of bringing a +1?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => respond('yes')}
                    disabled={saving}
                    className="px-6 py-3 rounded-full text-sm font-medium border border-gold/40 text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                  >
                    Yes, I&apos;ll bring someone
                  </button>
                  <button
                    onClick={() => respond('no')}
                    disabled={saving}
                    className="px-6 py-3 rounded-full text-sm font-medium border border-border text-muted-foreground hover:border-foreground/20 transition-colors cursor-pointer"
                  >
                    Just me
                  </button>
                </div>
              </motion.div>
            )}

            {answer === 'yes' && (
              <motion.p
                key="yes"
                className="text-foreground/70 text-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Noted. I&apos;ll make sure there&apos;s room. See you both there.
              </motion.p>
            )}

            {answer === 'no' && (
              <motion.p
                key="no"
                className="text-foreground/70 text-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Got it. Solo icon energy.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
