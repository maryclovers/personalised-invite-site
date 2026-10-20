'use client';
import { motion } from 'framer-motion';
import { useTrackSection } from '@/lib/tracking';

interface Props {
  slug: string;
}

export default function AfterDinner({ slug }: Props) {
  const ref = useTrackSection('after_dinner');

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
        after dinner
      </motion.p>

      {/* Full-bleed photo */}
      <motion.div
        className="relative w-full overflow-hidden mb-16"
        style={{ aspectRatio: '21/9' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="/after_dinner.jpg"
          alt="Friends celebrating with drinks"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 72%, #faf9f7 100%)' }} />
      </motion.div>

      {/* Text */}
      <motion.div
        className="px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-xl w-full flex flex-col gap-6">
          <motion.h2
            className="font-display text-3xl sm:text-4xl text-foreground leading-tight overflow-hidden"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          >
            The pub.
          </motion.h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            There&apos;s a Wetherspoons two minutes from Wing&apos;s. The Admiral of the Humber on
            Anlaby Road. We can head over after dinner and keep the night going.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
