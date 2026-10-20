'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PendingScreen from '@/components/invite/PendingScreen';
import NoScreen from '@/components/invite/NoScreen';
import YesScreen from '@/components/invite/YesScreen';
import RevokedScreen from '@/components/invite/RevokedScreen';
import type { RsvpStatus } from '@/lib/supabase/types';

interface Props {
  slug: string;
  name: string;
  message: string | null;
  initialStatus: RsvpStatus;
}

export default function InviteClient({ slug, name, message, initialStatus }: Props) {
  const [status, setStatus] = useState<RsvpStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  // Track whether the yes screen should skip the celebration (returning visitor)
  const [skipCelebration] = useState(initialStatus === 'yes');

  async function rsvp(decision: 'yes' | 'no') {
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, decision }),
      });
      const data = await res.json();
      if (data.rsvp_status) setStatus(data.rsvp_status as RsvpStatus);
    } catch {
      // silent — let them try again
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AnimatePresence mode="wait">
        {status === 'pending' && (
          <PendingScreen
            key="pending"
            name={name}
            message={message}
            loading={loading}
            onYes={() => rsvp('yes')}
            onNo={() => rsvp('no')}
          />
        )}
        {status === 'no' && (
          <NoScreen
            key="no"
            onChangeMind={() => setStatus('pending')}
          />
        )}
        {status === 'revoked' && (
          <RevokedScreen key="revoked" />
        )}
        {status === 'yes' && (
          <YesScreen
            key="yes"
            name={name}
            slug={slug}
            skipCelebration={skipCelebration}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
