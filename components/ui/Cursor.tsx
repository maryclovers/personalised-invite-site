'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 600, damping: 36, restDelta: 0.1 });
  const y = useSpring(rawY, { stiffness: 600, damping: 36, restDelta: 0.1 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setActive(true);
    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onOver  = (e: MouseEvent) => {
      const el = e.target as Element;
      setHovered(!!el.closest('a, button, [role="button"], input, label, [tabindex]'));
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);

    cleanupRef.current = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.style.cursor = '';
    };

    return () => cleanupRef.current?.();
  }, [rawX, rawY]);

  if (!active) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: 'var(--gold)',
      }}
      animate={{
        width:   hovered ? 14 : 5,
        height:  hovered ? 14 : 5,
        opacity: visible ? (hovered ? 0.45 : 0.8) : 0,
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    />
  );
}
