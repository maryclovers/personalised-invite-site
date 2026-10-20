'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT = new Date('2026-06-18T19:00:00.000Z');

function getTimeLeft() {
  const diff = EVENT.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-card border border-border rounded-lg flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={str}
            className="font-display text-xl sm:text-2xl text-gold tabular-nums absolute"
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-3 sm:gap-4">
      <Digit value={time.days}    label="days" />
      <Digit value={time.hours}   label="hrs"  />
      <Digit value={time.minutes} label="min"  />
      <Digit value={time.seconds} label="sec"  />
    </div>
  );
}
