'use client';
import { motion } from 'framer-motion';

export default function RevokedScreen() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_55%,rgba(154,112,53,0.04)_0%,transparent_70%)]" />

      <div className="relative flex flex-col items-center gap-8 max-w-sm">
        {/* Thin gold line */}
        <motion.div
          className="w-px bg-gold/40"
          initial={{ height: 0 }}
          animate={{ height: 48 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        />

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
            invitation
          </p>
          <p className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
            This link is no longer
            <br />
            <em>active.</em>
          </p>
        </motion.div>

        <motion.p
          className="text-muted-foreground text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          The details for this event have changed.
        </motion.p>
      </div>
    </motion.div>
  );
}
