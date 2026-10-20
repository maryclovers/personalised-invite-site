'use client';
import { motion } from 'framer-motion';
import { useTrackSection } from '@/lib/tracking';

const STATIONS = [
  { name: 'Teppanyaki',       description: 'Seafood, meat and vegetables cooked on the Japanese hotplate',    flag: '🇯🇵' },
  { name: 'Dim Sum',          description: 'Freshly prepared in small batches',                                flag: '🇨🇳' },
  { name: 'Sushi Conveyor',   description: 'Freshly made sushi, rolling right past you',                      flag: '🇯🇵' },
  { name: 'Roast Pork & Duck',description: 'Traditional Chinese delicacies, carved to order',                 flag: '🇨🇳' },
  { name: 'Robata & Grill Bar',description: 'Marinated meats grilled to perfection over charcoal',            flag: '🇯🇵' },
  { name: 'Seafood Bar',      description: 'Fresh seafood dishes from the ocean to the plate',                 flag: '🌊' },
  { name: 'Salad Bar',        description: 'Fresh, crisp, actually good salad',                               flag: '🥗' },
  { name: 'Noodle Bar',       description: 'Noodle dishes from across Asia',                                   flag: '🍜' },
  { name: 'Pancake Bar',      description: 'Great tasting pancakes, sweet and savoury',                       flag: '🥞' },
  { name: 'Desserts',         description: 'Looking delicious and tasting fantastic',                          flag: '🍮' },
  { name: 'Candy Floss Bar',  description: 'Freshly spun candy floss, made in front of you',                  flag: '🍬' },
  { name: 'Fried Ice Cream Bar', description: 'Frozen delights made in front of your eyes',                   flag: '🍦' },
  { name: 'Pizza Bar',        description: 'Delicious pizzas and authentic Italian dishes',                    flag: '🇮🇹' },
  { name: 'Tandoori Bar',     description: 'Fresh naan bread and traditional Indian dishes from the clay oven', flag: '🇮🇳' },
  { name: 'Kebab Bar',        description: 'Delicious Middle Eastern specialties',                             flag: '🌍' },
];

function StationCard({ station, index }: { station: typeof STATIONS[0]; index: number }) {
  return (
    <motion.div
      className="flex-none w-64 sm:w-72 bg-card border border-border rounded-2xl p-6 flex flex-col gap-3 cursor-default select-none"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
      whileHover={{ y: -4, borderColor: 'rgba(154,112,53,0.4)', boxShadow: '0 8px 32px rgba(154,112,53,0.08)' }}
    >
      <span className="text-2xl">{station.flag}</span>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg text-foreground leading-snug">{station.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{station.description}</p>
      </div>
    </motion.div>
  );
}

export default function MenuShowcase() {
  const trackRef = useTrackSection('menu');

  return (
    <section ref={trackRef} className="py-28 sm:py-36 border-t border-border overflow-hidden">
      {/* Text header */}
      <div className="px-6 flex flex-col items-center mb-0">
        <div className="max-w-xl w-full flex flex-col gap-10">
          <motion.p
            className="text-[11px] uppercase tracking-[0.35em] text-gold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            what we&apos;re eating
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
              15 stations.
              <br />
              <em className="text-foreground/50">150+ dishes.</em>
            </h2>
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              China, Japan, India, Thailand, Italy, Middle East, Britain. All in one room.
              Eat everything. Calories don&apos;t count today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed food photo */}
      <motion.div
        className="relative w-full mt-16 overflow-hidden"
        style={{ aspectRatio: '21/9' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="/menu.jpg"
          alt="Food spread"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 72%, #faf9f7 100%)' }} />
      </motion.div>

      {/* Horizontal scroll */}
      <div className="relative mt-6">
        <p className="px-6 mb-4 text-xs text-muted-foreground/50 tracking-wide">scroll →</p>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-none"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {STATIONS.map((s, i) => (
            <div key={s.name} className="snap-start">
              <StationCard station={s} index={i} />
            </div>
          ))}
          <div className="flex-none w-6" />
        </div>
      </div>
    </section>
  );
}
