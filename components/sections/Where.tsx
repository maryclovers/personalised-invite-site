'use client';
import { motion } from 'framer-motion';
import { useTrackSection, useTrack } from '@/lib/tracking';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Where() {
  const ref = useTrackSection('where');
  const track = useTrack();

  return (
    <section ref={ref} className="px-6 py-28 sm:py-36 flex flex-col items-center border-t border-border">
      <motion.div
        className="max-w-xl w-full flex flex-col gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.p className="text-[11px] uppercase tracking-[0.35em] text-gold" variants={fadeUp}>
          where
        </motion.p>

        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
            Wing&apos;s International <em>Cuisine</em>
          </h2>
          <a
            href="https://maps.google.com/?q=119+Ferensway+Hull+HU1+3UN"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('external_link', { label: 'venue_address', url: 'https://maps.google.com/?q=119+Ferensway+Hull+HU1+3UN' })}
            className="text-muted-foreground text-base hover:text-gold transition-colors"
          >
            119 Ferensway, Hull HU1 3UN
          </a>
        </motion.div>

        {/* Map embed */}
        <motion.div
          className="w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden glass"
          variants={fadeUp}
        >
          <iframe
            title="Wing's International Cuisine map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2360.0!2d-0.3434!3d53.7459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4878bbc7!2sWing's+International+Cuisine%2C+119+Ferensway%2C+Hull+HU1+3UN!5e0!3m2!1sen!2suk!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

      </motion.div>
    </section>
  );
}
