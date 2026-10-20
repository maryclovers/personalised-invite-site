'use client';
import { motion } from 'framer-motion';
import { useTrackSection } from '@/lib/tracking';

export default function Drinks() {
  const ref = useTrackSection('drinks');

  return (
    <section ref={ref} className="px-6 py-28 sm:py-36 flex flex-col items-center border-t border-border">
      <motion.div
        className="max-w-xl w-full flex flex-col gap-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold">drinks</p>

        <motion.p
          className="font-display text-xl sm:text-2xl text-foreground/85 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          The food&apos;s on me. Drinks aren&apos;t part of the buffet, but the bar upstairs is
          open all night. If everyone at our table grabs something, it makes the night feel like
          the celebration it&apos;s meant to be. That&apos;s all I&apos;ll say. Trust me on this one.
        </motion.p>
      </motion.div>
    </section>
  );
}
