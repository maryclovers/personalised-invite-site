'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  hue: number; // 40–60 (warm gold/white range)
}

interface Props {
  // Emission points as fractions of container [x, y] each 0–1
  points?: [number, number][];
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_POINTS: [number, number][] = [
  [0.50, 0.21],
  [0.46, 0.19],
  [0.54, 0.23],
];

export default function Sparklers({ points = DEFAULT_POINTS, className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    let W = 0, H = 0;
    const particles: Particle[] = [];
    let animId: number;
    let frame = 0;

    let emitPts: { x: number; y: number }[] = [];

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      W = el.offsetWidth;
      H = el.offsetHeight;
      el.width = W;
      el.height = H;
      emitPts = points.map(([fx, fy]) => ({ x: fx * W, y: fy * H }));
    }

    function emit(cx: number, cy: number) {
      const n = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 3;
        particles.push({
          x: cx + (Math.random() - 0.5) * 10,
          y: cy + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.2,
          life: 1,
          size: 1.5 + Math.random() * 2.5,
          hue: 40 + Math.random() * 25,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Emit every other frame
      if (frame % 2 === 0) {
        emitPts.forEach((pt) => emit(pt.x, pt.y));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.1;   // gravity
        p.vx *= 0.98;  // drag
        p.life -= 0.024;

        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const a   = p.life * p.life;
        const r   = p.size * 5 * p.life;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grd.addColorStop(0,   `hsla(${p.hue}, 100%, 96%, ${a})`);
        grd.addColorStop(0.25,`hsla(${p.hue}, 90%, 80%, ${a * 0.8})`);
        grd.addColorStop(1,   `hsla(${p.hue}, 80%, 60%, 0)`);

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Bright white core
        ctx.fillStyle = `rgba(255, 255, 240, ${Math.min(1, a * 1.4)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6 * p.life, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const capturedCanvas = canvas;
    const ro = new ResizeObserver(resize);
    ro.observe(capturedCanvas);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [points]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ pointerEvents: 'none', ...style }}
    />
  );
}
