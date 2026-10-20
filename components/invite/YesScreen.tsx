'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from './Countdown';
import FloatingBalloons from '@/components/ui/FloatingBalloons';
import AmbientOrbs from '@/components/ui/AmbientOrbs';
import TheNight from '@/components/sections/TheNight';
import Where from '@/components/sections/Where';
import MenuShowcase from '@/components/sections/MenuShowcase';
import DressCode from '@/components/sections/DressCode';
import GiftRegistry from '@/components/sections/GiftRegistry';
import AfterDinner from '@/components/sections/AfterDinner';
import PlusOne from '@/components/sections/PlusOne';
import PhotosSection from '@/components/sections/PhotosSection';
import SiteFooter from '@/components/sections/SiteFooter';
import { TrackingProvider } from '@/lib/tracking';

interface Props {
  name: string;
  slug: string;
  skipCelebration?: boolean;
}

function ConfettiBurst() {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360 + Math.random() * 10;
    const dist  = 70 + Math.random() * 130;
    return {
      id: i,
      x:  Math.cos((angle * Math.PI) / 180) * dist,
      y:  Math.sin((angle * Math.PI) / 180) * dist,
      delay: Math.random() * 0.15,
      size: 4 + Math.random() * 4,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: p.delay }}
        />
      ))}
    </div>
  );
}

export default function YesScreen({ name, slug, skipCelebration = false }: Props) {
  const [phase, setPhase] = useState<'celebrate' | 'reveal'>(
    skipCelebration ? 'reveal' : 'celebrate'
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (phase === 'celebrate') {
      const t = setTimeout(() => setPhase('reveal'), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) setScrolled(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">

        {/* ── Celebration flash ─────────────────────────── */}
        {phase === 'celebrate' && (
          <motion.div
            key="celebrate"
            className="relative min-h-screen flex items-center justify-center"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5 }}
          >
            <ConfettiBurst />
            <motion.p
              className="font-display text-5xl sm:text-7xl text-gold select-none italic"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              let&apos;s go
            </motion.p>
          </motion.div>
        )}

        {/* ── Full invite ───────────────────────────────── */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            {/* Hero */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8 overflow-hidden">

              {/* Full-bleed background photo — all screen sizes */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              >
                <img
                  src="/mary.jpg"
                  alt=""
                  className="w-full h-full object-cover object-top select-none"
                  draggable={false}
                />
                {/* Fade all edges into page background */}
                <div className="absolute inset-0" style={{ background: 'rgba(250,249,247,0.30)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 78%, #faf9f7 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #faf9f7 0%, transparent 20%, transparent 80%, #faf9f7 100%)' }} />
              </motion.div>

              {/* Ambient gold orbs */}
              <AmbientOrbs />

              {/* Floating balloons */}
              <FloatingBalloons />

              {/* Warm gold glow */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_40%_at_50%_55%,rgba(154,112,53,0.07)_0%,transparent_70%)]" />

              <motion.div
                className="relative z-10 flex flex-col items-center gap-5"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {/* Label */}
                <motion.p
                  className="text-[11px] uppercase tracking-[0.35em] text-gold"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  you&apos;re invited to my
                </motion.p>

                {/* 29th */}
                <motion.h1
                  className="font-display text-[8rem] sm:text-[12rem] lg:text-[15rem] text-foreground leading-none select-none"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.9, ease: 'easeOut' }}
                >
                  29<sup className="font-display text-[2.8rem] sm:text-[4rem] lg:text-[5rem] align-super leading-none">th</sup>
                </motion.h1>

                {/* birthday dinner */}
                <motion.p
                  className="font-display text-2xl sm:text-4xl lg:text-5xl text-foreground/65 italic -mt-4 sm:-mt-8 lg:-mt-10"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.8 }}
                >
                  birthday dinner
                </motion.p>

                {/* Date */}
                <motion.div
                  className="flex flex-col items-center gap-1.5 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                >
                  <p className="text-muted-foreground text-sm sm:text-base tracking-wide">
                    Thursday 18 June 2026 &middot; 7:00 PM
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.7 }}
                >
                  <Countdown />
                </motion.div>

              </motion.div>

              <motion.div
                className="absolute bottom-8 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: scrolled ? 0 : 1 }}
                transition={{ delay: scrolled ? 0 : 1.8, duration: 0.6 }}
              >
                <motion.div
                  className="w-px h-8 bg-gold/50 origin-top"
                  animate={{ scaleY: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
                <span className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">scroll</span>
              </motion.div>
            </section>

            {/* Sections */}
            <TrackingProvider slug={slug}>
              <TheNight />
              <Where />
              <MenuShowcase />
              <DressCode />
              <GiftRegistry slug={slug} />
              <PlusOne slug={slug} />
              <AfterDinner slug={slug} />
              <PhotosSection />
              <SiteFooter />
            </TrackingProvider>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
