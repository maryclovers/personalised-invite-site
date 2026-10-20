'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// All values pre-computed — no Math.random() at render time (SSR safe)
// Sizes bumped up significantly; mix of foreground (bigger, more opaque) and background (huge, very transparent)
const BALLOONS = [
  { id: 0,  x: 5,  size: 110, c: 0, delay: 0,    dur: 20, sway: 20,  opacity: 0.18 },
  { id: 1,  x: 13, size: 85,  c: 1, delay: 2.5,  dur: 24, sway: -16, opacity: 0.28 },
  { id: 2,  x: 23, size: 130, c: 2, delay: 1,    dur: 18, sway: 24,  opacity: 0.15 },
  { id: 3,  x: 32, size: 95,  c: 3, delay: 4,    dur: 27, sway: -12, opacity: 0.25 },
  { id: 4,  x: 41, size: 75,  c: 4, delay: 0.5,  dur: 22, sway: 18,  opacity: 0.32 },
  { id: 5,  x: 50, size: 120, c: 0, delay: 3,    dur: 19, sway: -22, opacity: 0.14 },
  { id: 6,  x: 59, size: 90,  c: 1, delay: 1.5,  dur: 25, sway: 14,  opacity: 0.26 },
  { id: 7,  x: 67, size: 105, c: 2, delay: 5,    dur: 21, sway: -18, opacity: 0.20 },
  { id: 8,  x: 76, size: 80,  c: 3, delay: 0.8,  dur: 23, sway: 20,  opacity: 0.30 },
  { id: 9,  x: 84, size: 140, c: 4, delay: 2,    dur: 26, sway: -15, opacity: 0.12 },
  { id: 10, x: 92, size: 100, c: 0, delay: 3.5,  dur: 17, sway: 16,  opacity: 0.22 },
  { id: 11, x: 9,  size: 88,  c: 2, delay: 6,    dur: 22, sway: -20, opacity: 0.27 },
  { id: 12, x: 36, size: 115, c: 3, delay: 1.2,  dur: 20, sway: 12,  opacity: 0.16 },
  { id: 13, x: 62, size: 82,  c: 1, delay: 4.5,  dur: 24, sway: -14, opacity: 0.29 },
  { id: 14, x: 18, size: 150, c: 4, delay: 0.3,  dur: 28, sway: 22,  opacity: 0.11 },
  { id: 15, x: 46, size: 70,  c: 2, delay: 7,    dur: 21, sway: -10, opacity: 0.33 },
] as const;

const COLORS = [
  { fill: '#C9A96E', hi: '#F5E8C0', sh: '#7A5828' },
  { fill: '#D4B47C', hi: '#F8EDD0', sh: '#8A6830' },
  { fill: '#B8924A', hi: '#E8D090', sh: '#725820' },
  { fill: '#E0CB94', hi: '#FFF8DC', sh: '#9A7838' },
  { fill: '#CAA058', hi: '#F2DE98', sh: '#806020' },
] as const;

function Balloon({ id, size, c }: { id: number; size: number; c: number }) {
  const col = COLORS[c];
  const w = size;
  const h = Math.round(size * 1.22);
  const gid = `b${id}`;

  return (
    <svg width={w} height={h + 60} viewBox={`0 0 ${w} ${h + 60}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gid} cx="31%" cy="27%" r="70%">
          <stop offset="0%"   stopColor={col.hi} />
          <stop offset="46%"  stopColor={col.fill} />
          <stop offset="100%" stopColor={col.sh} />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx={w/2} cy={h/2} rx={w/2 - 1} ry={h/2 - 1} fill={`url(#${gid})`} />
      {/* Main specular highlight */}
      <ellipse cx={w*0.32} cy={h*0.26} rx={w*0.14} ry={h*0.1} fill="rgba(255,255,255,0.45)" />
      {/* Tiny secondary shine */}
      <ellipse cx={w*0.55} cy={h*0.17} rx={w*0.045} ry={h*0.033} fill="rgba(255,255,255,0.3)" />
      {/* Bottom nub */}
      <path d={`M ${w/2-3.5} ${h-2} Q ${w/2} ${h+7} ${w/2+3.5} ${h-2}`} fill={col.sh} />
      {/* Curling string */}
      <path
        d={`M ${w/2} ${h+7} C ${w/2+14} ${h+23} ${w/2-14} ${h+40} ${w/2+7} ${h+60}`}
        stroke={col.sh}
        strokeWidth="1.3"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export default function FloatingBalloons() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]" aria-hidden="true">
      {BALLOONS.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.x}%`,
            bottom: '-240px',
            opacity: b.opacity,
            filter: `blur(${b.opacity < 0.18 ? '2.5px' : b.opacity < 0.25 ? '1.5px' : '0.5px'})`,
          }}
          animate={{
            y: [0, -1900],
            x: [0, b.sway, 0, b.sway * -0.6, 0],
          }}
          transition={{
            y: {
              duration: b.dur,
              repeat: Infinity,
              ease: 'linear',
              delay: b.delay,
            },
            x: {
              duration: b.dur * 0.55,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: b.delay,
            },
          }}
        >
          <Balloon id={b.id} size={b.size} c={b.c} />
        </motion.div>
      ))}
    </div>
  );
}
