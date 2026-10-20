'use client';
import { motion } from 'framer-motion';

const ORBS = [
  { size: 480, x: 8,  y: 12, delay: 0,   dur: 24, color: 'rgba(154,112,53,0.07)' },
  { size: 360, x: 72, y: 55, delay: 3,   dur: 30, color: 'rgba(201,169,110,0.055)' },
  { size: 560, x: 38, y: 78, delay: 1.5, dur: 38, color: 'rgba(154,112,53,0.045)' },
  { size: 300, x: 85, y: 20, delay: 5,   dur: 26, color: 'rgba(218,190,140,0.06)' },
];

export default function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, 28, 0],
            x: [0, 14, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
