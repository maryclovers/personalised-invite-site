'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackSection, useTrack } from '@/lib/tracking';

type GiftItem = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price_estimate: number | null;
  image_url: string | null;
  purchase_link: string | null;
  claimable: boolean;
  is_claimed: boolean;
  is_mine: boolean;
  display_order: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface ClaimModalProps {
  gift: GiftItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ClaimModal({ gift, onConfirm, onCancel, loading }: ClaimModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative z-10 w-full max-w-sm bg-card border border-border rounded-2xl p-6 flex flex-col gap-5"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-gold">you're claiming</p>
          <p className="font-display text-2xl text-foreground">{gift.name}</p>
          {gift.price_estimate && (
            <p className="text-muted-foreground text-sm">£{gift.price_estimate.toFixed(2)}</p>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This is just between us. No one else will see your name. Only Mary knows after the
          event. Once you claim it, it&apos;s yours to bring.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold text-[#0f0e0d] text-sm font-medium tracking-wide transition-opacity disabled:opacity-50"
          >
            {loading ? 'Claiming…' : "Yes, I'll bring this"}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-xl text-muted-foreground text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface GiftCardProps {
  gift: GiftItem;
  onClaim: (gift: GiftItem) => void;
  onUnclaim: (gift: GiftItem) => void;
  onLinkClick: (gift: GiftItem) => void;
}

function GiftCard({ gift, onClaim, onUnclaim, onLinkClick }: GiftCardProps) {
  const isCash = gift.category === 'cash';

  // Show link only if: unclaimed (anyone can see it) OR claimed by this person (so they can go back to order)
  const showLink = gift.purchase_link && (!gift.is_claimed || gift.is_mine);

  const nameEl = showLink ? (
    <a
      href={gift.purchase_link!}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick(gift)}
      className="text-foreground font-medium text-sm leading-snug hover:text-gold transition-colors underline-offset-2 hover:underline"
    >
      {gift.name}
    </a>
  ) : (
    <span className="text-foreground font-medium text-sm leading-snug">{gift.name}</span>
  );

  return (
    <motion.div
      layout
      className={`relative flex items-center justify-between gap-4 p-5 rounded-xl transition-all ${
        gift.is_mine
          ? 'glass-gold'
          : 'glass'
      }`}
      whileHover={!gift.is_claimed || gift.is_mine ? {
        y: -3,
        boxShadow: '0 12px 32px rgba(154,112,53,0.13)',
      } : undefined}
      transition={{ duration: 0.22 }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {nameEl}
        {isCash && (
          <span className="text-muted-foreground text-xs">cash is always appreciated</span>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3">
        {gift.is_mine && (
          <span className="text-[9px] uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
            yours
          </span>
        )}
        {gift.claimable && (
          <>
            {gift.is_mine ? (
              <button
                onClick={() => onUnclaim(gift)}
                className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                release
              </button>
            ) : gift.is_claimed ? (
              <span className="text-[11px] text-muted-foreground/50">taken</span>
            ) : (
              <button
                onClick={() => onClaim(gift)}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              >
                I&apos;ll bring this
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

interface Props {
  slug: string;
}

export default function GiftRegistry({ slug }: Props) {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [toConfirm, setToConfirm] = useState<GiftItem | null>(null);
  const [raceLost, setRaceLost] = useState(false);
  const [myGift, setMyGift] = useState<GiftItem | null>(null);
  const sectionRef = useTrackSection('gift_registry', 'gift_viewed');
  const track = useTrack();

  const fetchGifts = useCallback(async () => {
    const res = await fetch(`/api/gifts?slug=${slug}`);
    if (!res.ok) return;
    const data = await res.json();
    setGifts(data.gifts);
    setMyGift(data.gifts.find((g: GiftItem) => g.is_mine) ?? null);
  }, [slug]);

  useEffect(() => {
    fetchGifts().finally(() => setLoading(false));
  }, [fetchGifts]);

  async function handleClaim(gift: GiftItem) {
    setClaiming(true);
    setRaceLost(false);
    try {
      const res = await fetch('/api/gifts/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, gift_id: gift.id }),
      });
      const data = await res.json();
      if (data.success) {
        setToConfirm(null);
        await fetchGifts();
      } else if (data.reason === 'race_condition') {
        setRaceLost(true);
        setToConfirm(null);
        await fetchGifts();
      }
    } catch {
      // silent
    } finally {
      setClaiming(false);
    }
  }

  async function handleUnclaim(gift: GiftItem) {
    try {
      await fetch('/api/gifts/unclaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, gift_id: gift.id }),
      });
      await fetchGifts();
    } catch {
      // silent
    }
  }

  return (
    <section ref={sectionRef} className="py-28 sm:py-36 border-t border-border">
      {/* Label */}
      <motion.p
        className="px-6 text-[11px] uppercase tracking-[0.35em] text-gold mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        gift registry
      </motion.p>

      {/* Full-bleed gifts photo first */}
      <motion.div
        className="relative w-full overflow-hidden mb-16"
        style={{ aspectRatio: '21/9' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="/gifts.jpg"
          alt="Gift ideas"
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1531956531700-dc0ee0f1f9a5?auto=format&fit=crop&w=1800&q=85';
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 18%, transparent 72%, #faf9f7 100%)' }} />
      </motion.div>

      <div className="px-6 flex flex-col items-center">
      <motion.div
        className="max-w-xl w-full flex flex-col gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.div className="flex flex-col gap-4" variants={fadeUp}>
          <motion.h2
            className="font-display text-4xl sm:text-5xl text-foreground leading-tight overflow-hidden"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          >
            Your presence is the gift. <em>Genuinely.</em>
          </motion.h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            But if you&apos;d like to bring something, here are some suggestions.
          </p>
        </motion.div>

        {/* "You're bringing" banner */}
        <AnimatePresence>
          {myGift && (
            <motion.div
              className="flex flex-col gap-2 p-5 rounded-xl bg-gold/10 border border-gold/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[10px] uppercase tracking-widest text-gold">you&apos;re bringing</p>
              <p className="text-foreground font-medium">{myGift.name}</p>
              <button
                onClick={() => handleUnclaim(myGift)}
                className="self-start text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                changed your mind? release it
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Race condition notice */}
        <AnimatePresence>
          {raceLost && (
            <motion.div
              className="p-4 rounded-xl bg-card border border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-muted-foreground text-sm">
                Someone just claimed that one a split second before you. Pick another?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift list */}
        {loading ? (
          <motion.div className="flex flex-col gap-2" variants={fadeUp}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </motion.div>
        ) : (
          <motion.div className="flex flex-col gap-3" variants={fadeUp}>
            {gifts.filter((gift) => !gift.is_claimed || gift.is_mine).map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onClaim={(g) => { setRaceLost(false); setToConfirm(g); }}
                onUnclaim={handleUnclaim}
                onLinkClick={(g) => track('external_link', { label: g.name, url: g.purchase_link ?? '' })}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Claim confirmation modal */}
      <AnimatePresence>
        {toConfirm && (
          <ClaimModal
            gift={toConfirm}
            onConfirm={() => handleClaim(toConfirm)}
            onCancel={() => setToConfirm(null)}
            loading={claiming}
          />
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}
