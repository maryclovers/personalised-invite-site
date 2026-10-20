'use client';
import { motion } from 'framer-motion';

interface Props {
  onChangeMind: () => void;
}

export default function NoScreen({ onChangeMind }: Props) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="flex flex-col items-center gap-8 max-w-sm">
        <motion.p
          className="font-display text-4xl sm:text-5xl text-foreground leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          All love.
          <br />
          Catch up soon.
        </motion.p>

        <motion.p
          className="text-muted-foreground text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          No hard feelings. Life happens.
        </motion.p>

        <motion.button
          onClick={onChangeMind}
          className="text-sm text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-4 transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          actually, I changed my mind
        </motion.button>
      </div>
    </motion.div>
  );
}
