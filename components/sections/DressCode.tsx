'use client';
import { motion } from 'framer-motion';
import { useTrackSection } from '@/lib/tracking';

const letters = 'STYLISH'.split('');

export default function DressCode() {
  const ref = useTrackSection('dress_code');

  return (
    <section ref={ref} className="py-28 sm:py-36 border-t border-border overflow-hidden">
      {/* Label */}
      <motion.p
        className="px-6 text-[11px] uppercase tracking-[0.35em] text-gold mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        dress code
      </motion.p>

      {/* Full-bleed stylish Black couple photo */}
      <motion.div
        className="relative w-full overflow-hidden mb-16"
        style={{ aspectRatio: '21/9' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="/dress_code.jpg"
          alt="Stylish couple dressed up"
          className="w-full h-full object-cover object-top"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1614804520306-ecbee1dfd39b?auto=format&fit=crop&w=1800&q=85';
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 72%, #faf9f7 100%)' }} />
      </motion.div>

      {/* Text block */}
      <motion.div
        className="px-6 flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="max-w-xl w-full flex flex-col gap-10">
          <div className="flex" aria-label="Stylish">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="font-display text-[13vw] sm:text-[10vw] lg:text-[8.5rem] text-foreground leading-none"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                } as const}
                transition={{ duration: 0.5 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="flex flex-col gap-3"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } } as const}
            transition={{ duration: 0.7 }}
          >
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Just look really good. You&apos;ll be in photos.
            </p>
            <div className="flex gap-3 flex-wrap">
              <span className="text-sm px-3 py-1.5 rounded-full border border-border text-muted-foreground">No white</span>
              <span className="text-sm px-3 py-1.5 rounded-full border border-border text-muted-foreground">No jeans</span>
            </div>
            <a
              href="https://uk.pinterest.com/search/pins/?q=stylish%20couple%20dinner&rs=rs&source_id=rs_JXAX84Z7&top_pin_ids=48273027253569940&eq=&etslf=5407"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline underline-offset-2 transition-colors self-start mt-1"
            >
              <span>Get some inspo on Pinterest</span>
              <span>↗</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
