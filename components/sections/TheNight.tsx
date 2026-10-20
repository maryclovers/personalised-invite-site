'use client';
import { motion } from 'framer-motion';
import { useTrackSection } from '@/lib/tracking';

export default function TheNight() {
  const ref = useTrackSection('the_plan');

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
        the plan
      </motion.p>

      {/* Full-bleed photo first */}
      <motion.div
        className="relative w-full overflow-hidden mb-16"
        style={{ aspectRatio: '21/9' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85"
          alt="Elegant restaurant interior"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 72%, #faf9f7 100%)' }} />
      </motion.div>

      {/* Text block */}
      <motion.div
        className="px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="max-w-xl w-full flex flex-col gap-10">
          <motion.h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight overflow-hidden"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          >
            A buffet dinner.
            <br />
            <em className="text-foreground/50 not-italic italic">Just come hungry.</em>
          </motion.h2>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            We&apos;re doing Wing&apos;s International Cuisine in Hull, it&apos;s an all-you-can-eat
            buffet with over 150 dishes across 15 live cooking stations. Teppanyaki, sushi, dim sum,
            tandoori, desserts, the lot.
          </p>

        </div>
      </motion.div>
    </section>
  );
}
