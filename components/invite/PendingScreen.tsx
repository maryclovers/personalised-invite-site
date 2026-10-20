'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  message: string | null;
  loading: boolean;
  onYes: () => void;
  onNo: () => void;
}

function useTypewriter(text: string | null, charDelay = 26, startDelay = 1400) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDone(true); return; }
    setDisplayed('');
    setDone(false);
    const start = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(tick); setDone(true); }
      }, charDelay);
      return () => clearInterval(tick);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, charDelay, startDelay]);

  return { displayed, done };
}

const charVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function PendingScreen({ name, message, loading, onYes, onNo }: Props) {
  const [yesHovered, setYesHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleMagnetMove(e: React.MouseEvent) {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMagnet({
      x: (e.clientX - rect.left - rect.width / 2) * 0.28,
      y: (e.clientY - rect.top - rect.height / 2) * 0.28,
    });
  }
  function handleMagnetLeave() { setMagnet({ x: 0, y: 0 }); }
  const { displayed, done: typingDone } = useTypewriter(message);

  // Show question + buttons after typing finishes (or immediately if no message)
  useEffect(() => {
    if (typingDone) {
      const t = setTimeout(() => setShowActions(true), 450);
      return () => clearTimeout(t);
    }
  }, [typingDone]);

  const chars = name.split('');

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Warm radial glow — intensifies when hovering yes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: yesHovered
            ? 'radial-gradient(ellipse 70% 55% at 50% 65%, rgba(201,169,110,0.09) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 55% at 50% 65%, rgba(201,169,110,0.03) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.9 }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full text-center">

        {/* Name — letter by letter */}
        <motion.div
          className="font-display text-5xl sm:text-7xl text-foreground leading-none tracking-tight"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.055, delayChildren: 0.25 } } }}
          aria-label={name}
        >
          {chars.map((char, i) => (
            <motion.span key={i} variants={charVariants} transition={{ duration: 0.45 }} className="inline-block">
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Personalised welcome line — typewriter */}
        <motion.div
          className="min-h-[3rem] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {message && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm">
              {displayed}
              {!typingDone && (
                <motion.span
                  className="inline-block w-[2px] h-[1em] bg-gold ml-[2px] align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.75 }}
                />
              )}
            </p>
          )}
        </motion.div>

        {/* Question + buttons — appear after typing */}
        <motion.div
          className="flex flex-col items-center gap-6 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={showActions ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <p className="font-display text-xl sm:text-2xl text-foreground/80">
            It&apos;s my birthday. Are you in?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* I'm in — magnetic */}
            <motion.button
              ref={btnRef}
              onClick={onYes}
              disabled={loading}
              onMouseMove={handleMagnetMove}
              onMouseLeave={() => { handleMagnetLeave(); setYesHovered(false); }}
              onHoverStart={() => setYesHovered(true)}
              onHoverEnd={() => setYesHovered(false)}
              className="relative px-10 py-4 rounded-full text-base font-medium text-[#0f0e0d] bg-gold disabled:opacity-50 min-w-[180px] overflow-hidden cursor-pointer"
              animate={{ x: magnet.x, y: magnet.y, scale: [1, 1.018, 1] }}
              transition={{
                x: { type: 'spring', stiffness: 180, damping: 14 },
                y: { type: 'spring', stiffness: 180, damping: 14 },
                scale: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span
                className="absolute inset-0 bg-white/15 rounded-full"
                animate={{ opacity: yesHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative">I&apos;m in</span>
            </motion.button>

            {/* Can't make it */}
            <motion.button
              onClick={onNo}
              disabled={loading}
              className="px-10 py-4 rounded-full text-base font-medium text-muted-foreground border border-border hover:border-foreground/25 transition-colors min-w-[180px] cursor-pointer"
              animate={{ scale: [1, 1.018, 1] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', delay: 0.5 }}
              whileTap={{ scale: 0.96 }}
            >
              Can&apos;t make it
            </motion.button>
          </div>

          <p className="text-muted-foreground/50 text-xs tracking-wide">
            Please RSVP by 4 June
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
